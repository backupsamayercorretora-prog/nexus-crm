import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI SDK to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoints
app.post('/api/copilot', async (req, res) => {
  try {
    const { deal, client } = req.body;

    if (!deal || !client) {
      res.status(400).json({ error: 'Faltam dados do negócio ou de cliente.' });
      return;
    }

    const clientInfo = `
      Nome do Cliente: ${client.name}
      Tipo de Cliente: ${client.type === 'company' ? 'Empresa' : 'Contato Individual'}
      E-mail: ${client.email}
      Telefone: ${client.phone}
      ${client.companyName ? `Empresa Relacionada: ${client.companyName}` : ''}
      ${client.role ? `Cargo: ${client.role}` : ''}
      ${client.notes ? `Notas sobre o Cliente: ${client.notes}` : ''}
    `;

    const dealInfo = `
      Título do Negócio: ${deal.title}
      Etapa Atual: ${deal.stage}
      Valor do Negócio: R$ ${deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      Probabilidade Informada: ${deal.probability}%
      ${deal.description ? `Descrição do Negócio: ${deal.description}` : ''}
      Assinado a: ${deal.assignedTo}
      Palavras-chave/Tags: ${deal.tags ? deal.tags.join(', ') : 'Nenhuma'}
    `;

    const prompt = `
      Você é um especialista em vendas sênior e consultor corporativo integrando um assistente de inteligência artificial de CRM (CoPilot). 
      Seu objetivo é analisar o negócio e as informações do cliente especificados abaixo e devolver uma avaliação altamente estratégica, focada em guiar o vendedor para fechar o negócio.

      DADOS DO CLIENTE:
      ${clientInfo}

      DADOS DO NEGÓCIO:
      ${dealInfo}

      Instruções para a saída de dados:
      Gere uma resposta em JSON com o formato exato especificado na estrutura de dados de retorno. 
      Toda a análise deve ser amigável, direta, oportuna, profissional e escrita em Português do Brasil de forma perfeitamente formatada.
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um CoPilot de CRM profissional. Ajude o vendedor a analisar o lead, estimar o sucesso e sugerir estratégias de follow-up, mensagens de telefone/WhatsApp e templates de correio.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['assessment', 'probabilityOfSuccess', 'recommendedNextSteps', 'salesScript', 'suggestedEmail'],
          properties: {
            assessment: {
              type: Type.STRING,
              description: 'Uma análise estratégica sucinta descrevendo pontos fortes, fracos, oportunidades e se o valor faz sentido com base na descrição.',
            },
            probabilityOfSuccess: {
              type: Type.STRING,
              description: 'Estimativa verbal e em porcentagem da chance de fechar esse negócio (ex: "65% - Boa chance devido ao alinhamento de interesse, mas requer formalizar escopo...").',
            },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista com exatamente 3 ou 4 passos concretos e detalhados de acompanhamento (Action Items).',
            },
            salesScript: {
              type: Type.STRING,
              description: 'Um roteiro prático e personalizado para o vendedor falar por telefone ou mandar no WhatsApp (com tom caloroso, formal e consultivo em PT-BR).',
            },
            suggestedEmail: {
              type: Type.STRING,
              description: 'Um template de e-mail de follow-up comercial extremamente polido, pronto para envio, contendo variáveis/espaços como [Nome do Cliente], [Seu Nome], etc.',
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      res.status(500).json({ error: 'Resposta nula gerada pela inteligência artificial.' });
      return;
    }

    const result = JSON.parse(resultText);
    res.json(result);
  } catch (error: any) {
    console.error('Erro na chamada da API CoPilot:', error);
    res.status(500).json({
      error: 'Não foi possível rodar o CoPilot IA.',
      details: error.message || String(error),
    });
  }
});

// Configure Vite middleware in development or serve static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CRM Backend] Servidor rodando na porta ${PORT}`);
  });
}

startServer();

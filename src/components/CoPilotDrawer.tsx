import React, { useState, useEffect } from 'react';
import { Deal, Client, CoPilotFeedback } from '../types';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  RefreshCw, 
  Copy, 
  Check, 
  Loader2, 
  Bot, 
  AlertCircle 
} from 'lucide-react';

interface CoPilotDrawerProps {
  deal: Deal;
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onSaveFeedback: (dealId: string, feedback: CoPilotFeedback) => void;
}

export default function CoPilotDrawer({
  deal,
  client,
  isOpen,
  onClose,
  onSaveFeedback
}: CoPilotDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Status de cópia
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Carregar os dados ao abrir ou atualizar se o deal já tiver feed ou não
  useEffect(() => {
    if (isOpen && !deal.coPilotFeedback) {
      fetchCoPilotAnalysis();
    }
  }, [isOpen, deal.id]);

  const fetchCoPilotAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deal, client }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao chamar assistente de inteligência artificial.');
      }

      const feedback: CoPilotFeedback = await response.json();
      feedback.updatedAt = new Date().toISOString();
      onSaveFeedback(deal.id, feedback);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha de comunicação com o servidor Copilot AI.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'script' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  if (!isOpen) return null;

  const data = deal.coPilotFeedback;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Painel da Gaveta */}
        <div className="w-180 max-w-md md:max-w-2xl bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Header */}
          <div className="bg-slate-950 text-white p-5 border-b border-indigo-500/20 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
            {/* Brilhos de IA no fundo */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="h-10 w-10 b-2 bg-slate-900 rounded-xl flex items-center justify-center border border-indigo-800 shadow-md shadow-indigo-500/10">
                <Sparkles className="h-5.5 w-5.5 text-indigo-400 animate-pulse fill-indigo-950" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-white flex items-center space-x-1.5">
                  <span>CRM CoPilot AI</span>
                  <span className="text-[9px] bg-indigo-500 text-indigo-950 px-1 py-0.5 rounded-md font-black uppercase tracking-widest align-middle">Beta</span>
                </h2>
                <div className="text-[11px] text-indigo-400 font-semibold mt-0.5">
                  Análise inteligente de Negócio: {deal.title}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors relative z-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Conteúdo da Gaveta */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
            
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Consultando o Especialista de IA...</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Analisando o comportamento do cliente {client.name} e estimando as estratégias ideais de fechamento.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Falha na Análise de IA</h4>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchCoPilotAnalysis}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center space-x-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Tentar Novamente</span>
                </button>
              </div>
            ) : data ? (
              <div className="space-y-6">
                
                {/* 1. Sumário e Probabilidade */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Avaliação de Saúde do Negócio</span>
                    <button
                      onClick={fetchCoPilotAnalysis}
                      disabled={loading}
                      className="text-xs text-gray-500 hover:text-indigo-650 hover:bg-gray-100 p-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-gray-200"
                      title="Atualizar análise com dados recentes"
                    >
                      <RefreshCw className="h-3 w-3 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-4 md:space-y-0">
                    {/* Probabilidade de Fechamento */}
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-center md:w-44 shrink-0">
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Sucesso Estimado</span>
                      <span className="text-2xl font-black text-indigo-700 block mt-1">
                        {data.probabilityOfSuccess.split('-')[0].trim() || 'Médio'}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed flex-1">
                      {data.assessment}
                    </p>
                  </div>

                  <div className="text-[10px] text-gray-400 text-right italic font-medium">
                    Análise efetuada em {new Date(data.updatedAt).toLocaleString('pt-BR')}
                  </div>
                </div>

                {/* 2. Passos Recomendados */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3.5">
                  <h4 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Ações de Acompanhamento Recomendadas (Follow-up)</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {data.recommendedNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700 leading-snug">
                        <span className="h-5 w-5 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Script de Abordagem de Telefone ou WhatsApp */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3.5 relative">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-extrabold text-sm text-gray-900 flex items-center space-x-1.5">
                      <PhoneCall className="h-4 w-4 text-amber-500" />
                      <span>Roteiro de Abordagem (Telefone / WhatsApp)</span>
                    </h4>
                    <button
                      onClick={() => copyToClipboard(data.salesScript, 'script')}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 font-semibold transition-all cursor-pointer ${
                        copiedScript 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-600 hover:text-indigo-650 border-gray-200'
                      }`}
                    >
                      {copiedScript ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedScript ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <blockquote className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 border-l-4 border-slate-400 rounded-r-lg font-medium italic whitespace-pre-line">
                    "{data.salesScript}"
                  </blockquote>
                </div>

                {/* 4. Modelo de E-mail de Envio */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3.5 relative">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-extrabold text-sm text-gray-900 flex items-center space-x-1.5">
                      <Mail className="h-4 w-4 text-purple-500" />
                      <span>Template de E-mail Recomendado</span>
                    </h4>
                    <button
                      onClick={() => copyToClipboard(data.suggestedEmail, 'email')}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 font-semibold transition-all cursor-pointer ${
                        copiedEmail 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-600 hover:text-indigo-650 border-gray-200'
                      }`}
                    >
                      {copiedEmail ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-sans border border-gray-100">
                    {data.suggestedEmail}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
                <Bot className="h-10 w-10 text-slate-300" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Sem Análise de IA</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Não há análise inicial para este negócio. Clique no botão abaixo para gerar uma nova análise estratégica.
                  </p>
                </div>
                <button
                  onClick={fetchCoPilotAnalysis}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow cursor-pointer transition-colors flex items-center space-x-1.5 mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Gerar Análise de IA</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

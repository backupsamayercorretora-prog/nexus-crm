import { Deal, Client } from '../types';
import { 
  Plus, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  FolderKanban, 
  CheckCircle, 
  XCircle, 
  Target, 
  Users, 
  Activity 
} from 'lucide-react';

interface DashboardProps {
  deals: Deal[];
  clients: Client[];
}

export default function Dashboard({ deals, clients }: DashboardProps) {
  
  // Totalizer metrics
  const totalDealsCount = deals.length;
  const activeDeals = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost');
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const lostDeals = deals.filter(d => d.stage === 'Lost');

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const activePipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonPipelineValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  
  // Taxa de conversão: (Won / (Won + Lost)) * 100
  const finalStageCount = wonDeals.length + lostDeals.length;
  const conversionRate = finalStageCount > 0 
    ? Math.round((wonDeals.length / finalStageCount) * 100) 
    : 0;

  // Distribuição por Etapas
  const stageData = {
    Prospect: deals.filter(d => d.stage === 'Prospect'),
    Proposal: deals.filter(d => d.stage === 'Proposal'),
    Negotiation: deals.filter(d => d.stage === 'Negotiation'),
    Invoice: deals.filter(d => d.stage === 'Invoice'),
    Won: wonDeals,
    Lost: lostDeals,
  };

  // Funil de Vendas Máximo (valor para normalização)
  const maxStageValue = Math.max(
    stageData.Prospect.reduce((sum, d) => sum + d.value, 0),
    stageData.Proposal.reduce((sum, d) => sum + d.value, 0),
    stageData.Negotiation.reduce((sum, d) => sum + d.value, 0),
    stageData.Invoice.reduce((sum, d) => sum + d.value, 0),
    stageData.Won.reduce((sum, d) => sum + d.value, 0)
  ) || 1;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0 select-none p-6 space-y-6">
      
      {/* Título */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-950 flex items-center space-x-2">
            <TrendingUp className="h-5.5 w-5.5 text-indigo-600" />
            <span>Métricas do Funil & Relatórios Práticos</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Análise de metas financeiras, performance da equipe e saúde comercial.</p>
        </div>
        
        {/* Status de conversão rápida */}
        <div className="flex space-x-3 text-xs">
          <span className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 font-bold">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Conversão: {conversionRate}%</span>
          </span>
        </div>
      </div>

      {/* Grid de KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* KPI 1: volume total */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Volume Total Guardado</span>
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              R$ {totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </h3>
            <span className="text-[11px] text-gray-500 block">Total de {totalDealsCount} negócios cadastrados</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 2: receita ganha */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Faturamento Confirmado (Ganho)</span>
            <h3 className="text-xl font-black text-emerald-600 leading-tight">
              R$ {wonPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </h3>
            <span className="text-[11px] text-gray-500 block">Total de {wonDeals.length} contratos fechados</span>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 3: pipeline ativo */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pipeline em Aberto (Ativo)</span>
            <h3 className="text-xl font-black text-indigo-600 leading-tight">
              R$ {activePipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </h3>
            <span className="text-[11px] text-gray-500 block">Total de {activeDeals.length} negócios ativos nas etapas</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 4: metas de conversão */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Taxa de Sucesso Geral</span>
            <h3 className="text-xl font-black text-slate-800 leading-tight">
              {conversionRate}%
            </h3>
            <span className="text-[11px] text-gray-500 block">{lostDeals.length} oportunidades perdidas</span>
          </div>
          <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
            <Target className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Bento Grid: Funil de Vendas Visual e Estatísticas de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo/Centro: Funil de Vendas Estilizado */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
            <FolderKanban className="h-4.5 w-4.5 text-gray-400" />
            <span>Distribuição e Funil de Vendas (R$)</span>
          </h3>

          <div className="space-y-5.5">
            {/* ETAPA 1: Prospecção */}
            {(() => {
              const val = stageData.Prospect.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((val / maxStageValue) * 100) || 0;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                      <span>1. Prospecção ({stageData.Prospect.length} Neg.)</span>
                    </span>
                    <span className="font-bold text-gray-950">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6.5 rounded-lg overflow-hidden relative border border-gray-150">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    <span className="absolute inset-y-0 left-3 flex items-center text-[10px] text-gray-700 font-bold">
                      Impacto: {percent}% do maior volume
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* ETAPA 2: Elaboração */}
            {(() => {
              const val = stageData.Proposal.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((val / maxStageValue) * 100) || 0;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400 inline-block"></span>
                      <span>2. Proposta Escrita ({stageData.Proposal.length} Neg.)</span>
                    </span>
                    <span className="font-bold text-gray-950">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6.5 rounded-lg overflow-hidden relative border border-gray-150">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-lg transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    <span className="absolute inset-y-0 left-3 flex items-center text-[10px] text-gray-700 font-bold">
                      Impacto: {percent}% do maior volume
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* ETAPA 3: Negociação */}
            {(() => {
              const val = stageData.Negotiation.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((val / maxStageValue) * 100) || 0;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
                      <span>3. Negociação Ativa ({stageData.Negotiation.length} Neg.)</span>
                    </span>
                    <span className="font-bold text-gray-950">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6.5 rounded-lg overflow-hidden relative border border-gray-150">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    <span className="absolute inset-y-0 left-3 flex items-center text-[10px] text-gray-700 font-bold">
                      Impacto: {percent}% do maior volume
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* ETAPA 4: Faturamento */}
            {(() => {
              const val = stageData.Invoice.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((val / maxStageValue) * 100) || 0;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500 inline-block"></span>
                      <span>4. Faturamento Planejado ({stageData.Invoice.length} Neg.)</span>
                    </span>
                    <span className="font-bold text-gray-950">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6.5 rounded-lg overflow-hidden relative border border-gray-150">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    <span className="absolute inset-y-0 left-3 flex items-center text-[10px] text-gray-700 font-bold">
                      Impacto: {percent}% do maior volume
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* ETAPA 5: Fechado Ganho */}
            {(() => {
              const val = stageData.Won.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((val / maxStageValue) * 100) || 0;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>5. Fechado / Ganho ({stageData.Won.length} Neg.)</span>
                    </span>
                    <span className="font-bold text-emerald-600">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6.5 rounded-lg overflow-hidden relative border border-gray-150">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    <span className="absolute inset-y-0 left-3 flex items-center text-[10px] text-gray-700 font-bold">
                      Impacto: {percent}% do maior volume
                    </span>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Lado Direito: Estatísticas Rápidas de Clientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
            <Users className="h-4.5 w-4.5 text-gray-400" />
            <span>Perfil da Base de Clientes</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Contatos (Pessoa Física)</span>
                <span className="text-2xl font-black text-gray-800">{clients.filter(c => c.type === 'contact').length}</span>
              </div>
              <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold">U</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Empresas (Pessoa Jurídica)</span>
                <span className="text-2xl font-black text-gray-800">{clients.filter(c => c.type === 'company').length}</span>
              </div>
              <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center font-bold">E</div>
            </div>

            {/* Caixa de IA Assistente */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-indigo-500/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">CoPilot Ativo</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ao clicar no botão "CRM CoPilot" em qualquer cartão de negócio, a IA analisará o perfil do cliente e proporá roteiros de abordagem em tempo real.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

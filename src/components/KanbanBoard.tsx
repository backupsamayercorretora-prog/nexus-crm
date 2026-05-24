import React, { useState } from 'react';
import { Deal, Client, DealStage } from '../types';
import { Sparkles, Calendar, User, DollarSign, Bot, ArrowRight, Trash2, Edit2, ChevronRight, Tag } from 'lucide-react';

interface KanbanBoardProps {
  deals: Deal[];
  clients: Client[];
  onMoveDeal: (id: string, newStage: DealStage) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
  onOpenCoPilot: (deal: Deal) => void;
  searchQuery: string;
}

const STAGES: { key: DealStage; label: string; color: string; border: string; bg: string; text: string }[] = [
  { key: 'Prospect', label: 'Prospecção / Novo', color: 'bg-blue-500', border: 'border-t-4 border-t-blue-500', bg: 'bg-blue-50/40', text: 'text-blue-700' },
  { key: 'Proposal', label: 'Elaboração de Proposta', color: 'bg-sky-400', border: 'border-t-4 border-t-sky-400', bg: 'bg-sky-50/30', text: 'text-sky-700' },
  { key: 'Negotiation', label: 'Em Negociação', color: 'bg-amber-500', border: 'border-t-4 border-t-amber-500', bg: 'bg-amber-50/40', text: 'text-amber-700' },
  { key: 'Invoice', label: 'Aguardando Faturamento', color: 'bg-purple-500', border: 'border-t-4 border-t-purple-500', bg: 'bg-purple-50/40', text: 'text-purple-700' },
  { key: 'Won', label: 'Negócio Ganho 🎉', color: 'bg-emerald-500', border: 'border-t-4 border-t-emerald-500', bg: 'bg-emerald-50/40', text: 'text-emerald-700' },
  { key: 'Lost', label: 'Negócio Perdido ❌', color: 'bg-rose-500', border: 'border-t-4 border-t-rose-500', bg: 'bg-rose-50/40', text: 'text-rose-700' }
];

export default function KanbanBoard({
  deals,
  clients,
  onMoveDeal,
  onEditDeal,
  onDeleteDeal,
  onOpenCoPilot,
  searchQuery
}: KanbanBoardProps) {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  // Filtrar negócios se houver busca
  const filteredDeals = deals.filter(deal => {
    const client = clients.find(c => c.id === deal.clientId);
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client && client.companyName && client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (deal.tags && deal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedDealId(id);
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onMoveDeal(id, stage);
    }
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 select-none">
      
      {/* Sub-cabeçalho de Infos de Filtro do Kanban */}
      <div className="px-6 py-3 shrink-0 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <span>Visualização por Etapas</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">Pipeline Principal</span>
          {searchQuery && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-600 italic">Filtrado por: "{searchQuery}"</span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-400">
          Dica: Arraste e solte os cartões para mudar a etapa do negócio
        </div>
      </div>

      {/* Grid de Colunas Kanban */}
      <div className="flex-1 p-6 overflow-x-auto flex space-x-4 min-h-0 items-start">
        {STAGES.map(stage => {
          const stageDeals = filteredDeals.filter(d => d.stage === stage.key);
          const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const isOver = dragOverStage === stage.key;

          return (
            <div
              key={stage.key}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDrop={(e) => handleDrop(e, stage.key)}
              onDragLeave={() => setDragOverStage(null)}
              className={`w-72 bg-gray-100 rounded-xl flex flex-col shrink-0 max-h-full min-h-[450px] border border-gray-200 transition-all duration-150 ${stage.border} ${
                isOver ? 'bg-indigo-50/50 scale-[1.01] ring-2 ring-indigo-500/20' : ''
              }`}
            >
              {/* Header da Coluna */}
              <div className="p-3.5 border-b border-gray-200 bg-white rounded-t-lg flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm tracking-tight flex items-center space-x-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${stage.color} inline-block`}></span>
                    <span>{stage.label}</span>
                  </h3>
                  <div className="text-[12px] font-semibold text-gray-500 mt-1">
                    {stageDeals.length} {stageDeals.length === 1 ? 'negócio' : 'negócios'}
                  </div>
                </div>
                {/* Total da Coluna */}
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-800 block">
                    R$ {stageTotalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Corpo da Coluna */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {stageDeals.length === 0 ? (
                  <div className="h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 p-4 text-center">
                    Arraste um negócio aqui ou use "+ Criar Negócio" acima
                  </div>
                ) : (
                  stageDeals.map(deal => {
                    const client = clients.find(c => c.id === deal.clientId);
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        onDragEnd={handleDragEnd}
                        className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group"
                      >
                        {/* Ações Rápidas que aparecem no Hover */}
                        <div className="absolute top-3 right-3 flex items-center space-x-1 border opacity-0 group-hover:opacity-100 bg-white rounded-md shadow-sm transition-opacity duration-150 p-1">
                          <button
                            onClick={() => onEditDeal(deal)}
                            className="p-1 hover:bg-slate-100 text-gray-600 rounded"
                            title="Editar negócio"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDeal(deal.id)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded"
                            title="Excluir negócio"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Título do Negócio */}
                        <h4 className="font-bold text-gray-900 text-sm leading-snug pr-12">
                          {deal.title}
                        </h4>

                        {/* Nome do Cliente e Link */}
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-2">
                          <User className="h-3 w-3 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[170px]" title={client ? client.name : 'Cliente Desconhecido'}>
                            {client ? client.name : 'Cliente Desconhecido'}
                          </span>
                          {client && client.companyName && (
                            <span className="text-gray-300 shrink-0">|</span>
                          )}
                          {client && client.companyName && (
                            <span className="truncate max-w-[120px] text-gray-400 font-medium" title={client.companyName}>
                              {client.companyName}
                            </span>
                          )}
                        </div>

                        {/* Valor do Negócio */}
                        <div className="flex items-center text-xs text-gray-900 font-extrabold mt-3.5 bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-lg w-fit">
                          R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>

                        {/* Linha de Progresso & Barra de Probabilidade */}
                        <div className="mt-3.5">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                            <span>PROBABILIDADE</span>
                            <span>{deal.probability}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                deal.stage === 'Won' 
                                  ? 'bg-emerald-500' 
                                  : deal.stage === 'Lost' 
                                  ? 'bg-rose-500' 
                                  : deal.probability >= 80 
                                  ? 'bg-purple-500' 
                                  : deal.probability >= 50 
                                  ? 'bg-amber-400' 
                                  : 'bg-blue-400'
                              }`}
                              style={{ width: `${deal.probability}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Tags */}
                        {deal.tags && deal.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {deal.tags.map(tag => (
                              <span key={tag} className="text-[9px] bg-slate-150 text-slate-600 px-1.5 py-0.5 rounded flex items-center space-x-0.5 font-medium border border-slate-200">
                                <Tag className="h-2 w-2 mr-0.5" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Botão Especial do CoPilot IA */}
                        <div className="mt-4 pt-3.5 border-t border-dashed border-gray-150 flex items-center justify-between">
                          <button
                            onClick={() => onOpenCoPilot(deal)}
                            className="bg-indigo-50/80 hover:bg-indigo-100 text-indigo-600 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all border border-indigo-100 flex items-center space-x-1.5 cursor-pointer ml-auto shadow-sm active:scale-95 hover:shadow"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse fill-indigo-200" />
                            <span>CRM CoPilot</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

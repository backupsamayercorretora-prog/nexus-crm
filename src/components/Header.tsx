import { Search, Plus, Filter, User, HelpCircle, Phone, Calendar, Mail, Sparkles, MessageCircle } from 'lucide-react';
import { Deal } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewDealClick: () => void;
  onNewClientClick: () => void;
  deals: Deal[];
}

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  onNewDealClick, 
  onNewClientClick,
  deals 
}: HeaderProps) {
  
  const activeDeals = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost');
  const activeValue = activeDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shrink-0 shadow-sm relative z-30 select-none">
      
      {/* Busca rápida unificada */}
      <div className="flex items-center space-x-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Procurar negócios, contatos e empresas..."
            className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* KPI Rápido do Pipeline no topo */}
      <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-600 border-l border-gray-200 pl-6 mr-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Negócios em aberto</span>
          <span className="font-bold text-gray-800 text-base">{activeDeals.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Volume do Pipeline</span>
          <span className="font-bold text-indigo-600 text-base">
            R$ {activeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Botões de Ação estilo Bitrix24 Air */}
      <div className="flex items-center space-x-3">
        {/* Adicionar Cliente */}
        <button
          onClick={onNewClientClick}
          className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer shadow-sm"
        >
          <User className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>

        {/* Criar Negócio Rápido */}
        <button
          onClick={onNewDealClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Criar Negócio</span>
        </button>

        {/* Avatar Rápido do Operador */}
        <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-indigo-500 flex items-center justify-center text-slate-700 font-bold text-sm relative ml-2 shadow-sm">
          S
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
      </div>
    </header>
  );
}

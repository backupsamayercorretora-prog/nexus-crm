import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  Settings, 
  Bot, 
  Sparkles,
  HelpCircle,
  FolderKanban,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'kanban' | 'clients' | 'analytics' | 'settings';
  onChangeTab: (tab: 'kanban' | 'clients' | 'analytics' | 'settings') => void;
}

export default function Sidebar({ currentTab, onChangeTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col border-r border-slate-200 shrink-0 select-none">
      {/* Header do Logo estilo Nexus CRM */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
          N
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          Nexus<span className="text-indigo-600 font-extrabold">CRM</span>
          <span className="text-[10px] ml-1 uppercase bg-indigo-500/10 text-indigo-600 px-1.5 py-0.5 rounded-sm font-semibold tracking-wider align-middle">
            Lite
          </span>
        </span>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 py-4 px-3 space-y-7 overflow-y-auto">
        <div>
          <h4 className="px-3 text-xs font-semibold text-slate-450 uppercase tracking-widest mb-3">
            Principal
          </h4>
          <nav className="space-y-1">
            <button
              onClick={() => onChangeTab('kanban')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'kanban'
                  ? 'bg-indigo-50 text-indigo-650 font-bold border-l-4 border-indigo-650 rounded-l-none shadow-sm'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="h-5 w-5" />
              <span>Pipelines (Kanban)</span>
            </button>

            <button
              onClick={() => onChangeTab('clients')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'clients'
                  ? 'bg-indigo-50 text-indigo-650 font-bold border-l-4 border-indigo-650 rounded-l-none shadow-sm'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Contatos & Empresas</span>
            </button>
          </nav>
        </div>

        <div>
          <h4 className="px-3 text-xs font-semibold text-slate-450 uppercase tracking-widest mb-3">
            Relatórios & Produtividade
          </h4>
          <nav className="space-y-1">
            <button
              onClick={() => onChangeTab('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-650 font-bold border-l-4 border-indigo-650 rounded-l-none shadow-sm'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Análises & Métricas</span>
            </button>
          </nav>
        </div>

        {/* Integração Inteligente com IA */}
        <div className="bg-slate-950 rounded-xl p-4 border border-indigo-500/20 shadow-inner relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center space-x-1.5 mb-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
            <span>CoPilot Inteligente</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tenha recomendações de estratégias de negociação, templates de e-mail e estimativas de sucesso acionados por IA em cada negócio.
          </p>
        </div>
      </div>

      {/* Footer da Sidebar */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col space-y-1 text-xs text-slate-500">
        <div className="flex items-center space-x-2 text-slate-600 hover:text-indigo-650 transition-colors cursor-pointer py-1.5 px-1 rounded hover:bg-slate-100" onClick={() => onChangeTab('settings')}>
          <Settings className="h-4 w-4 shrink-0" />
          <span>Configurações do CRM</span>
        </div>
        <div className="flex items-center space-x-1 justify-between pt-2">
          <span>&copy; 2026 Nexus CRM</span>
          <HelpCircle className="h-3.5 w-3.5 hover:text-slate-650 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
}

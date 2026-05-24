import { useState, useEffect } from 'react';
import { Client, Deal, DealStage, CoPilotFeedback } from './types';
import { INITIAL_CLIENTS, INITIAL_DEALS } from './utils/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import ClientList from './components/ClientList';
import Dashboard from './components/Dashboard';
import CoPilotDrawer from './components/CoPilotDrawer';
import DealModal from './components/DealModal';
import { Sparkles, Bot, Settings2, RefreshCw, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'kanban' | 'clients' | 'analytics' | 'settings'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar dados de Clientes e Negócios
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('crm_lite_clients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler clientes do localStorage', e);
      }
    }
    return INITIAL_CLIENTS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('crm_lite_deals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler negócios do localStorage', e);
      }
    }
    return INITIAL_DEALS;
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('crm_lite_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('crm_lite_deals', JSON.stringify(deals));
  }, [deals]);

  // Controles de Modais
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);

  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  const [coPilotDeal, setCoPilotDeal] = useState<Deal | null>(null);

  // Manipular Clientes
  const handleAddClient = (clientInput: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientInput,
      id: `cli_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
  };

  const handleEditClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Todos os negócios associados continuarão existindo.')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  // Manipular Negócios
  const handleSaveDeal = (dealInput: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const isEdit = !!dealInput.id;

    if (isEdit) {
      const updated = dealInput as Deal;
      // Adicionar campos de data e feedback remanescentes se for edição
      const original = deals.find(d => d.id === updated.id);
      const finalDeal: Deal = {
        ...original,
        ...updated,
        createdAt: original?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Deal;
      setDeals(prev => prev.map(d => d.id === updated.id ? finalDeal : d));
    } else {
      const newId = `deal_${Date.now()}`;
      const newDeal: Deal = {
        title: dealInput.title,
        clientId: dealInput.clientId,
        stage: dealInput.stage,
        value: dealInput.value,
        probability: dealInput.probability,
        description: dealInput.description,
        assignedTo: dealInput.assignedTo,
        tags: dealInput.tags,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDeals(prev => [newDeal, ...prev]);
    }
    setIsDealModalOpen(false);
    setDealToEdit(null);
  };

  const handleMoveDeal = (id: string, newStage: DealStage) => {
    setDeals(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          stage: newStage,
          probability: newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : d.probability,
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleEditDealClick = (deal: Deal) => {
    setDealToEdit(deal);
    setIsDealModalOpen(true);
  };

  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Deseja realmente remover esta oportunidade do pipeline comercial? Essa ação não pode ser desfeita.')) {
      setDeals(prev => prev.filter(d => d.id !== id));
    }
  };

  // Abrir Assistente de IA
  const handleOpenCoPilot = (deal: Deal) => {
    setCoPilotDeal(deal);
    setIsCoPilotOpen(true);
  };

  // Salvar feedback do CoPilot IA
  const handleSaveCoPilotFeedback = (dealId: string, feedback: CoPilotFeedback) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return {
          ...d,
          coPilotFeedback: feedback,
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));
    // Sincronizar também o deal ativo da gaveta
    if (coPilotDeal && coPilotDeal.id === dealId) {
      setCoPilotDeal(prev => prev ? { ...prev, coPilotFeedback: feedback } : null);
    }
  };

  // Redefinir dados para padrões originais
  const handleResetData = () => {
    if (window.confirm('Atenção: Isso restaurará o pipeline comercial e de clientes para os dados de teste iniciais. Deseja continuar?')) {
      setClients(INITIAL_CLIENTS);
      setDeals(INITIAL_DEALS);
      localStorage.removeItem('crm_lite_clients');
      localStorage.removeItem('crm_lite_deals');
      setCurrentTab('kanban');
    }
  };

  const activeCoPilotClient = coPilotDeal
    ? clients.find(c => c.id === coPilotDeal.clientId) || null
    : null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar de navegação do Bitrix */}
      <Sidebar currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Conteúdo Central */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header do Bitrix */}
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewDealClick={() => {
            setDealToEdit(null);
            setIsDealModalOpen(true);
          }}
          onNewClientClick={() => {
            setCurrentTab('clients');
          }}
          deals={deals}
        />

        {/* View renderizada dinamicamente */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          
          {currentTab === 'kanban' && (
            <KanbanBoard 
              deals={deals}
              clients={clients}
              onMoveDeal={handleMoveDeal}
              onEditDeal={handleEditDealClick}
              onDeleteDeal={handleDeleteDeal}
              onOpenCoPilot={handleOpenCoPilot}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'clients' && (
            <ClientList 
              clients={clients}
              deals={deals}
              onAddClient={handleAddClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {currentTab === 'analytics' && (
            <Dashboard 
              deals={deals}
              clients={clients}
            />
          )}

          {currentTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2">
                    <Settings2 className="h-5.5 w-5.5 text-indigo-600" />
                    <span>Configurações do Sistema de CRM</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Gerencie a base de dados comercial do Bitrix24 Clone.</p>
                </div>

                <div className="border-t border-gray-150 pt-5 space-y-6">
                  {/* Sessão 1: Limpeza de dados */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-200">
                    <div className="space-y-1 pr-4">
                      <h4 className="font-bold text-gray-900 text-sm">Restaurar Base de Dados Original</h4>
                      <p className="text-xs text-gray-500 max-w-md">
                        Caso queira iniciar do zero ou limpar alterações de negócios, isso restaurará todos os negócios do pipeline padrão e clientes originais para os dados simulados polidos do Vancouver e AWS.
                      </p>
                    </div>
                    <button
                      onClick={handleResetData}
                      className="mt-3 md:mt-0 flex items-center space-x-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 shrink-0" />
                      <span>Limpar e Restaurar</span>
                    </button>
                  </div>

                  {/* Sessão 2: Guia Rápida CoPilot */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                      <h4 className="font-extrabold text-indigo-800 text-sm">Uso do CoPilot de CRM</h4>
                    </div>
                    <p className="text-xs text-indigo-700 leading-relaxed max-w-2xl">
                      Nosso CoPilot usa o modelo de inteligência artificial de última geração <strong>Gemini 3.5 Flash</strong> de ponta a ponta. Ele analisa o escopo do deal comercial, o faturamento estimado do cliente corporativo e gera recomendações concretas de fechamento. 
                      Certifique-se de preencher detalhadamente os critérios do seu negócio no modal para extrair as melhores respostas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Gaveta do CRM CoPilot */}
      {coPilotDeal && activeCoPilotClient && (
        <CoPilotDrawer 
          isOpen={isCoPilotOpen}
          onClose={() => {
            setIsCoPilotOpen(false);
            setCoPilotDeal(null);
          }}
          deal={coPilotDeal}
          client={activeCoPilotClient}
          onSaveFeedback={handleSaveCoPilotFeedback}
        />
      )}

      {/* Modal de Criar/Editar Negócio */}
      <DealModal 
        isOpen={isDealModalOpen}
        onClose={() => {
          setIsDealModalOpen(false);
          setDealToEdit(null);
        }}
        clients={clients}
        dealToEdit={dealToEdit}
        onSave={handleSaveDeal}
      />

    </div>
  );
}

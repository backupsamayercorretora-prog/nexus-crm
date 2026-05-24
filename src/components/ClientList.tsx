import React, { useState } from 'react';
import { Client, Deal } from '../types';
import { 
  Building2, 
  User, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Briefcase, 
  Trash2, 
  Edit, 
  Users, 
  ChevronRight, 
  DollarSign, 
  MessageSquare, 
  Building 
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  deals: Deal[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export default function ClientList({ 
  clients, 
  deals, 
  onAddClient, 
  onEditClient, 
  onDeleteClient 
}: ClientListProps) {
  
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'company'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado do formulário simples de criação de cliente
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'contact' | 'company'>('contact');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [revenue, setRevenue] = useState('');
  const [notes, setNotes] = useState('');

  // Controlar edição
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Filtrar clientes
  const filteredClients = clients.filter(c => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClient) {
      onEditClient({
        ...editingClient,
        name,
        type,
        email,
        phone,
        companyName: type === 'contact' ? companyName : undefined,
        role: type === 'contact' ? role : undefined,
        revenue: type === 'company' ? revenue : undefined,
        notes
      });
      setEditingClient(null);
    } else {
      onAddClient({
        name,
        type,
        email,
        phone,
        companyName: type === 'contact' ? companyName : undefined,
        role: type === 'contact' ? role : undefined,
        revenue: type === 'company' ? revenue : undefined,
        notes
      });
    }

    // Resetar campos
    setName('');
    setType('contact');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setRole('');
    setRevenue('');
    setNotes('');
    setShowAddForm(false);
  };

  const startEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setType(client.type);
    setEmail(client.email);
    setPhone(client.phone);
    setCompanyName(client.companyName || '');
    setRole(client.role || '');
    setRevenue(client.revenue || '');
    setNotes(client.notes || '');
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setEditingClient(null);
    setShowAddForm(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setRole('');
    setRevenue('');
    setNotes('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-0 select-none overflow-y-auto">
      
      {/* Subheader com Filtros e Ações */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 shrink-0">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-gray-950 flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span>Dados de Clientes</span>
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {clients.length} cadastrados
          </span>
        </div>

        {/* Abas e Filtros de Tipo */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('contact')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'contact' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Contatos (Pessoa Física)
            </button>
            <button
              onClick={() => setFilterType('company')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'company' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Empresas
            </button>
          </div>

          <button
            onClick={() => {
              setEditingClient(null);
              setShowAddForm(true);
            }}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg shadow cursor-pointer transition-colors"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Cadastrar Novo</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        {/* Formulário de Adicionar/Editar Cliente */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-indigo-500/20 shadow-md p-6 relative">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
              {editingClient ? '✏️ Editar Registro de Cliente' : '✨ Criar Novo Cadastro de Cliente'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Nome */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nome Completo / Razão Social*</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Pedro Alencar ou Vancouver Engenharia"
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Tipo */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tipo de Cliente</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'contact' | 'company')}
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="contact">Contato Individual (Pessoa Física)</option>
                    <option value="company">Empresa (Pessoa Jurídica)</option>
                  </select>
                </div>

                {/* E-mail */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">E-mail Comercial</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendas@empresa.com"
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Telefone */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Telefone / Celular</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Campos condicionais para Contatos */}
                {type === 'contact' && (
                  <>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Empresa Relacionada</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Nome da empresa onde trabalha"
                        className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cargo / Função</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: Diretor de Compras"
                        className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </>
                )}

                {/* Campos condicionais para Empresas */}
                {type === 'company' && (
                  <div className="flex flex-col col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Faturamento Estimado / Faturamento Anual</label>
                    <input
                      type="text"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="Ex: R$ 5.000.000,00"
                      className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                )}
              </div>

              {/* Notas */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notas / Informações Gerais</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações relevantes sobre este contato, preferências, histórico ou acordos prévios..."
                  rows={2}
                  className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full"
                  maxLength={1000}
                ></textarea>
              </div>

              {/* Botões do form */}
              <div className="flex space-x-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg text-sm shadow cursor-pointer"
                >
                  {editingClient ? 'Salvar Edição' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Caixa de Pesquisa do Grid de Clientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, email, telefone ou empresa..."
            className="flex-1 border-0 bg-transparent text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Lista de Registros */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-800 text-sm">Nenhum cliente encotrado</p>
              <p className="text-xs text-gray-400 mt-1">
                Tente redefinir o termo de pesquisa ou clique em "Cadastrar Novo" para registrar um cliente.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50/70 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Cliente</th>
                    <th scope="col" className="px-6 py-4">E-mail</th>
                    <th scope="col" className="px-6 py-4">Telefone</th>
                    <th scope="col" className="px-6 py-4">Relacionamento / Negócios</th>
                    <th scope="col" className="px-6 py-4">Notas Básicas</th>
                    <th scope="col" className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client) => {
                    const clientDeals = deals.filter(d => d.clientId === client.id);
                    const isCompany = client.type === 'company';

                    return (
                      <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                        
                        {/* Nome do Cliente e Tipo */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center space-x-3.5">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                              isCompany ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {isCompany ? (
                                <Building2 className="h-4.5 w-4.5" />
                              ) : (
                                <User className="h-4.5 w-4.5" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{client.name}</span>
                              {isCompany ? (
                                <span className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider mt-0.5 inline-block">Empresa CNPJ</span>
                              ) : (
                                <span className="text-[11px] text-gray-500 inline-block mt-0.5">
                                  {client.role ? `${client.role}` : 'Contato'} {client.companyName ? `em ${client.companyName}` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* E-mail */}
                        <td className="px-6 py-4.5 text-gray-700">
                          {client.email ? (
                            <div className="flex items-center space-x-1.5 text-xs">
                              <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span>{client.email}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300 italic text-xs">Sem e-mail</span>
                          )}
                        </td>

                        {/* Telefone */}
                        <td className="px-6 py-4.5 text-gray-700">
                          {client.phone ? (
                            <div className="flex items-center space-x-1.5 text-xs font-mono">
                              <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span>{client.phone}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300 italic text-xs">Sem telefone</span>
                          )}
                        </td>

                        {/* Negócios Relacionados */}
                        <td className="px-6 py-4.5 text-gray-700">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-800">
                              {clientDeals.length} {clientDeals.length === 1 ? 'negócio associado' : 'negócios associados'}
                            </span>
                            
                            {clientDeals.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {clientDeals.slice(0, 2).map(deal => (
                                  <span 
                                    key={deal.id} 
                                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                                      deal.stage === 'Won' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : deal.stage === 'Lost' 
                                        ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                    }`}
                                  >
                                    R$ {deal.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                  </span>
                                ))}
                                {clientDeals.length > 2 && (
                                  <span className="text-[9px] text-gray-400 font-semibold align-middle shrink-0">+{clientDeals.length - 2} mais</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Observações */}
                        <td className="px-6 py-4.5 text-gray-500 text-xs max-w-xs truncate" title={client.notes}>
                          {client.notes || <span className="text-gray-300 italic">Nenhuma observação</span>}
                        </td>

                        {/* Ações */}
                        <td className="px-6 py-4.5 text-right shrink-0">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => startEdit(client)}
                              className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
                              title="Editar cliente"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteClient(client.id)}
                              className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Excluir cliente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

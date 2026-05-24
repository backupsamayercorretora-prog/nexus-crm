import React, { useState, useEffect } from 'react';
import { Deal, Client, DealStage } from '../types';
import { X, Tag, User, DollarSign, Calendar, Sparkles, FolderPlus } from 'lucide-react';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  dealToEdit: Deal | null; // se nulo, cria um novo
  onSave: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const STAGES: { key: DealStage; label: string }[] = [
  { key: 'Prospect', label: 'Prospecção / Novo' },
  { key: 'Proposal', label: 'Elaboração de Proposta' },
  { key: 'Negotiation', label: 'Em Negociação' },
  { key: 'Invoice', label: 'Aguardando Faturamento' },
  { key: 'Won', label: 'Negócio Ganho 🎉' },
  { key: 'Lost', label: 'Negócio Perdido ❌' }
];

export default function DealModal({
  isOpen,
  onClose,
  clients,
  dealToEdit,
  onSave
}: DealModalProps) {
  
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [stage, setStage] = useState<DealStage>('Prospect');
  const [value, setValue] = useState<number>(0);
  const [probability, setProbability] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('SAMAYER Whatsapp');
  const [tagsInput, setTagsInput] = useState('');

  // Sincronizar informações de edição se houver
  useEffect(() => {
    if (dealToEdit) {
      setTitle(dealToEdit.title);
      setClientId(dealToEdit.clientId);
      setStage(dealToEdit.stage);
      setValue(dealToEdit.value);
      setProbability(dealToEdit.probability);
      setDescription(dealToEdit.description || '');
      setAssignedTo(dealToEdit.assignedTo);
      setTagsInput(dealToEdit.tags ? dealToEdit.tags.join(', ') : '');
    } else {
      // Limpar campos pará novo negócio
      setTitle('');
      setClientId(clients.length > 0 ? clients[0].id : '');
      setStage('Prospect');
      setValue(0);
      setProbability(50);
      setDescription('');
      setAssignedTo('SAMAYER Whatsapp');
      setTagsInput('');
    }
  }, [dealToEdit, isOpen, clients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    // Processar tags
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const dealData = {
      title,
      clientId,
      stage,
      value: Number(value),
      probability: Number(probability),
      description,
      assignedTo,
      tags,
    };

    if (dealToEdit) {
      onSave({
        ...dealToEdit,
        ...dealData,
      });
    } else {
      onSave(dealData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Caixa do Modal */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden transform transition-all relative z-10">
        
        {/* Header do Modal */}
        <div className="bg-slate-50 px-6 py-4.5 border-b border-gray-150 flex items-center justify-between">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <FolderPlus className="h-5 w-5 text-indigo-600" />
            <span>{dealToEdit ? '✏️ Editar Detalhes do Negócio' : '✨ Criar Oportunidade de Negócio'}</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Título do Negócio */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título do Negócio*</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aquisição de CRM Vancouver"
              className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Selecionar Cliente */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Selecione o Cliente Associado*</label>
            {clients.length === 0 ? (
              <div className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-100 rounded-lg p-3">
                Você primeiro precisa cadastrar pelo menos um cliente na aba "Contatos & Empresas" antes de criar um negócio.
              </div>
            ) : (
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Selecione um cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valor do Negócio (R$)*</label>
              <input
                type="number"
                required
                min={0}
                value={value || ''}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="Ex: 50000"
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Probabilidade */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Probabilidade ({probability}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="h-10 cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Etapa */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Etapa Atual</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {STAGES.map(st => (
                  <option key={st.key} value={st.key}>{st.label}</option>
                ))}
              </select>
            </div>

            {/* Responsável */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Responsável Comercial</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Nome do vendedor"
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Palavras-chave / Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: ERP, SaaS, Urgente (Separadas por vírgula)"
              className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col border-b border-gray-100 pb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Requisitos & Escopo do Negócio</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informações úteis sobre o escopo, dores do cliente, concorrência, prazos críticos ou soluções propostas... (Nossa IA usará isto para criar a estratégia ideal)."
              rows={3}
              className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full"
            ></textarea>
          </div>

          {/* Botoes de Acao */}
          <div className="flex space-x-3 justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={clients.length === 0}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg text-sm shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pronto, Salvar
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export interface Client {
  id: string;
  name: string;
  type: 'contact' | 'company';
  email: string;
  phone: string;
  companyName?: string;
  role?: string; // e.g. CEO, Gerente de Vendas
  revenue?: string; // faturamento anual para empresas
  notes?: string;
  createdAt: string;
}

export type DealStage = 'Prospect' | 'Proposal' | 'Negotiation' | 'Invoice' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  clientId: string; // referenciar Client.id
  stage: DealStage;
  value: number;
  probability: number; // 0-100%
  description?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string; // Responsável
  tags?: string[];
  coPilotFeedback?: CoPilotFeedback;
}

export interface CoPilotFeedback {
  assessment: string;
  probabilityOfSuccess: string;
  recommendedNextSteps: string[];
  salesScript: string;
  suggestedEmail: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalValue: number;
  wonValue: number;
  dealCount: number;
  conversionRate: number;
}

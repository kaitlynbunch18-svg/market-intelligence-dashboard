export interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  closeDate: string;
  lastActivity: string;
  nextAction: string;
  tags: string[];
  notes: string;
}

export interface FilterState {
  search: string;
  stage: string;
  source: string;
  sortBy: 'value' | 'probability' | 'closeDate';
}

export interface Stats {
  totalOpportunities: number;
  totalValue: number;
  expectedRevenue: number;
  avgProbability: number;
}

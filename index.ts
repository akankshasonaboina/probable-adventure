export interface NLUAnalysis {
  sentiment: {
    document: {
      score: number;
      label: 'positive' | 'negative' | 'neutral';
    };
  };
  keywords: Array<{
    text: string;
    relevance: number;
  }>;
  entities: Array<{
    text: string;
    type: string;
  }>;
}

export interface BudgetData {
  income: number;
  expenses: Record<string, number>;
  savings_goal: number;
  currency: string;
  user_type: 'student' | 'professional';
}

export interface SpendingData {
  income: number;
  expenses: Record<string, number>;
  goals: Array<{
    name: string;
    amount: number;
    months: number;
  }>;
  user_type: 'student' | 'professional';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FinancialInsight {
  category: string;
  amount: number;
  percentage: number;
  recommendation?: string;
}
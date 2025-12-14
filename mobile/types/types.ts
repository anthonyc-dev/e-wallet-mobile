export type Transaction = {
  id: number;
  user_ID: string;
  title: string;
  amount: number;
  category?: string;
  created_at: string;
};

export type TransactionSummary = {
  income: number;
  expenses: number;
  balance: number;
};

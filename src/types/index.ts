export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
  resourceId: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}
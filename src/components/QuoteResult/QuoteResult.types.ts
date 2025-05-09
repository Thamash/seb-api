export interface Quote {
  quote_id: string;
  status: string;
  valid_until: string;
  customer_id: string;
  exchange_rate: {
    rate: number;
    rate_currency: string;
    quoted_currency: string;
  };
  debit_amount: {
    amount: number;
    currency: string;
  };
  credit_amount: {
    amount: number;
    currency: string;
  };
}

export interface QuoteResultProps {
  quote: Quote | null;
}
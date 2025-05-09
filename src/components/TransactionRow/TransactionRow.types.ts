export interface Transaction {
  transactionId: string;
  bookingDate: string;
  transactionAmount: {
    amount: string;
    currency: string;
  };
  descriptiveText: string;
  proprietaryBankTransactionCodeText: string;
  _links?: {
    transactionDetails?: {
      href: string;
    };
  };
}

export interface TransactionDetailsResponse {
  data?: {
    transactionAmount: {
      amount: string;
      currency: string;
    };
    proprietaryBankTransactionCodeText: string;
    valueDate: string;
    bookingDate: string;
    debtorAccount?: {
      bban: string;
    };
    creditorAccount?: {
      bban: string;
    };
    remittanceInformationUnstructuredArray?: string[];
    debtorReference?: string;
  };
  error?: {
    type: string;
    title: string;
    detail: string;
    code: string;
  };
}

export interface TransactionRowProps {
  transaction: Transaction;
  expanded: Record<string, TransactionDetailsResponse>;
  fetchTransactionDetails: (transactionId: string) => void;
}
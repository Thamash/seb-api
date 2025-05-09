export interface Account {
  resourceId: string;
  iban: string;
  bban: string;
  status: string;
  currency: string;
  ownerName: string;
  creditLine: string;
  product: string;
  name: string;
  balances: {
    balanceType: string;
    balanceAmount: {
      amount: string;
      currency: string;
    };
    creditLimitIncluded?: boolean;
  }[];
  bic: string;
  bicAddress: string;
  cardLinkedToAccount: boolean;
  paymentService: boolean;
  accountInterest: string;
  _links: {
    transactions: {
      href: string;
    };
  };
};

export interface AccountDetailsProps {
  account?: Account;
  token: string;
  id: string;
}
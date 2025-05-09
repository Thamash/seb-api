export interface Account {
  resourceId: string
  iban: string
  bban: string
  status: string
  currency: string
  ownerName: string
  name: string
}

export interface AccountCardProps {
  account: Account
}
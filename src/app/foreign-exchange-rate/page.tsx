import ForeignExchangeRates from '@/components/ForeignExchangeRate/ForeignExchangeRate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  return <ForeignExchangeRates />;
}

import TransactionsPage from '@/components/TransactionsPage/TransactionsPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TransactionsPage id={id} />;
}

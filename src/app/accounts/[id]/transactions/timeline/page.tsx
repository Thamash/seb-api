import TransactionTimeline from '@/components/TransactionTimeline/TransactionTimeline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TransactionTimeline id={id} />;
}

import AlternativeInvestmentsViewer from '@/components/AlternativeInvestmentsViewer/AlternativeInvestmentsViewer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  return <AlternativeInvestmentsViewer />;
}

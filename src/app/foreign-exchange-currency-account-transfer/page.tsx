import { FXQuoteForm } from '@/components/FXQuoteForm/FXQuoteForm';
import FXTransferPing from '@/components/FXTransferPing/FXTransferPing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  return (
    <>
      <FXTransferPing />
      <FXQuoteForm />
    </>
  );
}

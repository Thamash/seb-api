import AccountDetails from '@/components/AccountDetails/AccountDetails';
import type { Account } from '@/components/AccountDetails/AccountDetails.types';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  return {
    title: `Account ${id}`,
  };
}

export default async function Account({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return <div>Please Login!</div>;
  }

  return (
    <div>
      <h1>Account {id}</h1>
      <AccountDetails token={token} id={id}/>
    </div>
  );
}

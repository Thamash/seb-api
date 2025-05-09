'use client';

import AccountCard from '@/components/AccountCard/AccountCard';
import { Account } from '@/components/AccountDetails/AccountDetails.types';
import { SEB_PRODUCTS } from '@/config/products';
import { SEB_ROUTES } from '@/config/routes';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostLoginCallback() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithLoading<Promise<any>>('/api/accounts', SEB_ROUTES.ACCOUNTS, SEB_PRODUCTS.AUTHORIZATIONS)
      .then(response => response)
      .then(data => {
        if (data.accounts) {
          setAccounts(data.accounts);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('Hiba a kód mentésekor:', error);
        router.push('/');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen p-6 text-gray-100 bg-surface">
      {loading && (
        <p className="mb-4 text-sm text-center text-gray-400">Loading accounts...</p>
      )}

      {!loading && accounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account: Account) => (
            <AccountCard key={account.resourceId} account={account} />
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-center text-gray-500">No accounts found.</p>
        )
      )}
    </div>
  );
}

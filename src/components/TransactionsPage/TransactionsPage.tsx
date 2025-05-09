/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import TransactionRow from '../TransactionRow/TransactionRow';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

export default function TransactionsPage({ id }: { id: string }) {
  const [booked, setBooked] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [nextLink, setNextLink] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchInitial();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInitial() {
    const data = await fetchWithLoading<Promise<any>>(
      `/api/accounts/${id}/transactions`,
      `${SEB_ROUTES.ACCOUNTS}/${id}/transactions`,
      SEB_PRODUCTS.PSD2_ACCOUNT_INFORMATION,
      {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    setBooked(data?.transactions?.transactions?.booked || []);
    setNextLink(data?.transactions?.transactions?._links?.next?.href || null);
  }

  async function fetchTransactionDetails(transactionId: string) {
    if (expanded[transactionId]) {
      setExpanded((prev) => {
        const copy = { ...prev };
        delete copy[transactionId];
        return copy;
      });
      return;
    }

    const details = await fetchWithLoading<Promise<any>>(
      `/api/accounts/${id}/transactions/${transactionId}`,
      `${SEB_ROUTES.ACCOUNTS}/${id}/transactions/${transactionId}`,
      SEB_PRODUCTS.PSD2_ACCOUNT_INFORMATION,
      {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    setExpanded((prev) => ({ ...prev, [transactionId]: details }));
  }

  async function loadNextPage() {
    if (!nextLink) return;
    const res = await fetch(nextLink);
    const { transactions } = await res.json();
    setBooked((prev) => [...prev, ...(transactions?.booked || [])]);
    setNextLink(transactions?._links?.next?.href || null);
  }

  function filteredAndSorted() {
    const filtered = booked.filter((tx) =>
      tx.descriptiveText?.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const d1 = new Date(a.bookingDate).getTime();
      const d2 = new Date(b.bookingDate).getTime();
      return sortAsc ? d1 - d2 : d2 - d1;
    });
  }

  function downloadCSV(data: any[]) {
    const csv = [
      ['Date', 'Amount', 'Currency', 'Description', 'Type'],
      ...data.map((tx) => [
        tx.bookingDate,
        tx.transactionAmount?.amount,
        tx.transactionAmount?.currency,
        tx.descriptiveText,
        tx.proprietaryBankTransactionCodeText,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="max-w-6xl min-h-screen px-4 py-8 mx-auto text-gray-100 bg-surface">
      <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
        <h1 className="text-3xl font-bold text-primary">Transactions for Account {id}</h1>
        <button
          onClick={() => downloadCSV(filteredAndSorted())}
          className="button-primary"
        >
          ⬇ Download CSV
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6 sm:flex-row">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 text-sm text-white placeholder-gray-400 bg-[#2a2a2a] border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="px-4 py-2 text-sm text-white border border-primary rounded-lg hover:bg-primary hover:text-[#1C1C1C] transition"
        >
          Sort by date {sortAsc ? '↑' : '↓'}
        </button>
      </div>

      {filteredAndSorted().length > 0 ? (
        <div className="overflow-x-auto border rounded-xl border-primary">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="bg-[#2a2a2a] text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Currency</th>
                <th className="p-4">Description</th>
                <th className="p-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {filteredAndSorted().map((tx) => (
                <TransactionRow
                  key={`transaction-row-${tx.transactionId}`}
                  transaction={tx}
                  expanded={expanded}
                  fetchTransactionDetails={fetchTransactionDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-gray-500">No transactions found.</div>
      )}

      {nextLink && (
        <div className="mt-6 text-center">
          <button
            onClick={loadNextPage}
            className="button-primary"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

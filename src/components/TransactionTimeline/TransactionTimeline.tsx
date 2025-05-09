/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Info,
  Search,
  Loader2,
} from 'lucide-react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { motion, AnimatePresence } from 'framer-motion';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

interface Transaction {
  transactionId: string;
  bookingDate: string;
  descriptiveText: string;
  transactionAmount: {
    amount: string;
    currency: string;
  };
  proprietaryBankTransactionCodeText?: string;
}

interface TransactionDetail {
  transactionAmount: { amount: string; currency: string };
  proprietaryBankTransactionCodeText?: string;
  bookingDate?: string;
  valueDate?: string;
  debtorAccount?: { bban?: string };
  creditorAccount?: { bban?: string };
  remittanceInformationUnstructuredArray?: string[];
  debtorReference?: string;
}

function groupByDate(transactions: Transaction[]) {
  return transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const date = tx.bookingDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {});
}

function getDailySummary(transactions: Transaction[]) {
  const income = transactions
    .filter((tx) => parseFloat(tx.transactionAmount.amount) > 0)
    .reduce((sum, tx) => sum + parseFloat(tx.transactionAmount.amount), 0);
  const outcome = transactions
    .filter((tx) => parseFloat(tx.transactionAmount.amount) < 0)
    .reduce((sum, tx) => sum + parseFloat(tx.transactionAmount.amount), 0);
  return {
    income: income.toFixed(2),
    outcome: outcome.toFixed(2),
    currency: transactions[0]?.transactionAmount?.currency || '',
  };
}

export default function TransactionTimeline({ id }: { id: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, TransactionDetail>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await fetchWithLoading<Promise<any>>(
          `/api/accounts/${id}/transactions`,
          `${SEB_ROUTES.ACCOUNTS}/${id}/transactions`,
          SEB_PRODUCTS.PSD2_ACCOUNT_INFORMATION,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setTransactions(data?.transactions?.transactions?.booked || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  const handleToggle = async (transactionId: string) => {
    if (expandedId === transactionId) {
      setExpandedId(null);
    } else {
      setExpandedId(transactionId);
      if (!details[transactionId]) {
        try {
          const detailData = await fetchWithLoading<Promise<any>>(
            `/api/accounts/${id}/transactions/${transactionId}`,
            `${SEB_ROUTES.ACCOUNTS}/${id}/transactions/${transactionId}`,
            SEB_PRODUCTS.PSD2_ACCOUNT_INFORMATION,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
          setDetails((prev) => ({
            ...prev,
            [transactionId]: detailData?.data || {},
          }));
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.descriptiveText?.toLowerCase().includes(search.toLowerCase()) ||
      tx.transactionAmount.amount.includes(search)
  );

  const grouped = groupByDate(filteredTransactions);
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="relative w-full max-w-4xl px-2 mx-auto sm:px-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by description or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#1C1C1C] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="mr-2 animate-spin" /> Loading timeline...
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && filteredTransactions.length === 0 && (
        <p className="text-center text-gray-500">No transactions found.</p>
      )}

      <div className="absolute top-0 bottom-0 w-px bg-gray-700 left-1/2" />

      {sortedDates.map((date, groupIndex) => {
        const dailySummary = getDailySummary(grouped[date]);

        return (
          <div key={date} className="mb-16">
            <div className="mb-1 text-xs tracking-wide text-center text-gray-400 uppercase">
              {date}
            </div>
            <div className="mb-6 text-sm text-center text-gray-300">
              +{dailySummary.income} {dailySummary.currency} /{' '}
              {dailySummary.outcome} {dailySummary.currency}
            </div>

            {grouped[date].map((tx, index) => {
              const isNegative = parseFloat(tx.transactionAmount.amount) < 0;
              const Icon = isNegative ? ArrowUpRight : ArrowDownLeft;
              const iconColor = isNegative ? 'text-red-400' : 'text-green-400';
              const alignRight = (groupIndex + index) % 2 === 0;
              const isExpanded = expandedId === tx.transactionId;
              const detail = details[tx.transactionId];

              return (
                <div
                  key={tx.transactionId}
                  className={`w-full flex ${
                    alignRight
                      ? 'justify-start pr-4 sm:pr-10'
                      : 'justify-end pl-4 sm:pl-10'
                  } relative mb-12`}
                >
                  <div className="absolute z-10 w-3 h-3 -translate-x-1/2 border rounded-full left-1/2 top-1 bg-primary border-primary" />

                  <motion.div
                    layout
                    initial={{ opacity: 0.8, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#1C1C1C] p-4 sm:p-5 rounded-xl border border-gray-700 shadow-md w-full sm:w-[calc(50%-2rem)] transition hover:shadow-lg cursor-pointer"
                    onClick={() => handleToggle(tx.transactionId)}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                      <CalendarDays size={14} className="opacity-80" />
                      <span>{tx.bookingDate}</span>
                    </div>
                    <div className="mb-1 text-sm font-semibold text-gray-200 line-clamp-2">
                      {tx.descriptiveText || 'No description'}
                    </div>
                    <div className="flex items-center gap-2 mb-1 text-sm">
                      <Icon size={16} className={iconColor} />
                      <span className={`font-semibold ${iconColor}`}>
                        {tx.transactionAmount.amount}{' '}
                        {tx.transactionAmount.currency}
                      </span>
                    </div>
                    {tx.proprietaryBankTransactionCodeText && (
                      <div className="flex items-center gap-2 text-xs italic text-gray-500">
                        <Info size={12} className="opacity-70" />
                        {tx.proprietaryBankTransactionCodeText}
                      </div>
                    )}

                    <AnimatePresence>
                      {isExpanded && detail && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-3 mt-4 space-y-2 overflow-hidden text-xs text-gray-300 border-t border-gray-700"
                        >
                          {detail.valueDate && (
                            <div>
                              <span className="text-gray-400">Value Date:</span>{' '}
                              {detail.valueDate}
                            </div>
                          )}
                          {detail.debtorAccount?.bban && (
                            <div>
                              <span className="text-gray-400">
                                Debtor BBAN:
                              </span>{' '}
                              {detail.debtorAccount.bban}
                            </div>
                          )}
                          {detail.creditorAccount?.bban && (
                            <div>
                              <span className="text-gray-400">
                                Creditor BBAN:
                              </span>{' '}
                              {detail.creditorAccount.bban}
                            </div>
                          )}
                          {detail.remittanceInformationUnstructuredArray &&
                            detail.remittanceInformationUnstructuredArray
                              .length > 0 && (
                              <div>
                                <div className="text-gray-400">
                                  Remittance Info:
                                </div>
                                <ul className="ml-4 list-disc list-inside">
                                  {detail.remittanceInformationUnstructuredArray.map(
                                    (item, idx) => (
                                      <li key={idx}>{item}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          {detail.debtorReference && (
                            <div>
                              <span className="text-gray-400">
                                Debtor Reference:
                              </span>{' '}
                              {detail.debtorReference}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

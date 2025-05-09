'use client';

import { useEffect, useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';

interface TradeResult {
  id: string;
  transactTime: string;
  trades: {
    customerId: string;
    settlementDate: string;
    exchange: {
      rate: number;
      rateCurrency: string;
      quotedCurrency: string;
    };
    debit: {
      amount: number;
      currency: string;
    };
    credit: {
      amount: number;
      currency: string;
    };
  }[];
}

export default function FxTradeResultViewer() {
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await fetchWithLoading<any>('/api/alternative-investments');
        setTradeResult(data);
      } catch (err) {
        setError('Failed to load trade result.');
        console.error('Error fetching trade result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl p-6 mx-auto mt-6 bg-surface rounded-xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-white">FX Trade Result</h2>

      {loading && <p className="text-gray-400">Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && tradeResult && (
        <div className="space-y-6">
          <div className="text-sm text-gray-400">
            <p>
              <strong className="text-white">Trade ID:</strong>{' '}
              {tradeResult.id}
            </p>
            <p>
              <strong className="text-white">Transaction Time:</strong>{' '}
              {new Date(tradeResult.transactTime).toLocaleString()}
            </p>
          </div>

          {tradeResult.trades.map((trade, idx) => (
            <div
              key={idx}
              className="border border-[#2a2a2a] rounded-lg p-4 bg-[#1C1C1C]"
            >
              <p>
                <strong className="text-gray-400">Customer ID:</strong>{' '}
                {trade.customerId}
              </p>
              <p>
                <strong className="text-gray-400">Settlement Date:</strong>{' '}
                {trade.settlementDate}
              </p>
              <p>
                <strong className="text-gray-400">Exchange Rate:</strong>{' '}
                {trade.exchange.rate} {trade.exchange.rateCurrency} /{' '}
                {trade.exchange.quotedCurrency}
              </p>
              <p>
                <strong className="text-gray-400">Debit:</strong>{' '}
                {trade.debit.amount} {trade.debit.currency}
              </p>
              <p>
                <strong className="text-gray-400">Credit:</strong>{' '}
                {trade.credit.amount} {trade.credit.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

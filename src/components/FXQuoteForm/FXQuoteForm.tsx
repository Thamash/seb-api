'use client';

import { useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { QuoteResult } from '../QuoteResult/QuoteResult';
import { Quote } from '../QuoteResult/QuoteResult.types';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

const currencyOptions = ['EUR', 'SEK', 'USD', 'GBP', 'HUF'];

export const FXQuoteForm = () => {
  const [buyCurrency, setBuyCurrency] = useState('EUR');
  const [sellCurrency, setSellCurrency] = useState('SEK');
  const [buyAmount, setBuyAmount] = useState(1000);
  const [settlementDate, setSettlementDate] = useState(() => new Date().toISOString().slice(0, 10));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetchWithLoading<Quote>('/api/fx-transfer/quotes',
        SEB_ROUTES.FX_TRANSFER_QUOTES,
        SEB_PRODUCTS.FX_RATES,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: buyAmount,
          debitCurrency: sellCurrency,
          creditCurrency: buyCurrency,
        }),
      });

      setResponse(res);
    } catch (err) {
      console.error(err);
      setError('Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-surface min-w-[500px] rounded-xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Get FX Quote</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Buy Currency</label>
            <select
              value={buyCurrency}
              onChange={(e) => setBuyCurrency(e.target.value)}
              className="w-full p-2 bg-[#1C1C1C] border border-gray-700 rounded-md"
            >
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1">Sell Currency</label>
            <select
              value={sellCurrency}
              onChange={(e) => setSellCurrency(e.target.value)}
              className="w-full p-2 bg-[#1C1C1C] border border-gray-700 rounded-md"
            >
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Buy Amount</label>
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(Number(e.target.value))}
            className="w-full p-2 bg-[#1C1C1C] border border-gray-700 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Settlement Date</label>
          <input
            type="date"
            value={settlementDate}
            onChange={(e) => setSettlementDate(e.target.value)}
            className="w-full p-2 bg-[#1C1C1C] border border-gray-700 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="button-primary w-full"
          disabled={loading}
        >
          {loading ? 'Requesting Quote...' : 'Get Quote'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {response && <QuoteResult quote={response} />}
    </div>
  );
}

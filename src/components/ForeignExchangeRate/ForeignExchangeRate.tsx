'use client';

import { useEffect, useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FxRate } from './ForeignExchangeRate.types';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

const currencyOptions = ['SEK', 'EUR'];

export default function FXRatesViewer() {
  const [unitCurrency, setUnitCurrency] = useState('SEK');
  const [rates, setRates] = useState<FxRate[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await fetchWithLoading<any>(
          `/api/fxrates?unit_currency=${unitCurrency}`,
          `${SEB_ROUTES.FX_RATES}${unitCurrency}`,
          SEB_PRODUCTS.FX_RATES,
        );
        const ratesList = data?.fx_spot_exchange_rates?.[0]?.fx_spot_mid_exchange_rates || [];
        setRates(ratesList);
      } catch (err) {
        console.error('Error fetching FX rates:', err);
        setError('Failed to fetch exchange rates.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [unitCurrency]);

  const filteredRates = rates.filter((rate) =>
    rate.listed_currency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl p-6 mx-auto mt-6 bg-surface rounded-xl shadow-lg text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-white">Live Foreign Exchange Rates</h2>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <select
            value={unitCurrency}
            onChange={(e) => setUnitCurrency(e.target.value)}
            className="px-3 py-2 bg-[#1C1C1C] border border-gray-700 text-gray-100 rounded-md shadow-sm focus:outline-none"
          >
            {currencyOptions.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter currencies..."
            className="px-3 py-2 bg-[#1C1C1C] border border-gray-700 text-gray-100 rounded-md shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading exchange rates...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-auto rounded-md border border-[#2a2a2a] mb-6">
            <table className="min-w-full text-sm text-left">
              <thead className="text-xs uppercase text-gray-400 table-header">
                <tr>
                  <th className="px-4 py-2">Currency</th>
                  <th className="px-4 py-2">Bid</th>
                  <th className="px-4 py-2">Offer</th>
                  <th className="px-4 py-2">Mid Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((rate) => (
                  <tr key={rate.listed_currency} className="border-t border-[#2a2a2a] table-row-hover">
                    <td className="px-4 py-2 font-semibold">{rate.listed_currency}</td>
                    <td className="px-4 py-2 text-gray-300">{rate.bid_rate.toFixed(4)}</td>
                    <td className="px-4 py-2 text-gray-300">{rate.offer_rate.toFixed(4)}</td>
                    <td className="px-4 py-2 text-primary font-semibold">{rate.exchange_rate.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#1C1C1C] p-4 border border-gray-700 rounded-xl">
            <h3 className="text-white text-lg font-bold mb-4">Exchange Rate Comparison</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={filteredRates.slice(0, 20)}>
                <XAxis dataKey="listed_currency" stroke="#ccc" fontSize={12} />
                <YAxis stroke="#ccc" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: '#555', color: '#fff' }}
                  formatter={(value: number) => `${value.toFixed(4)}`}
                  labelFormatter={(label) => `Currency: ${label}`}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="exchange_rate" fill="rgb(209, 253, 96)" name="Mid Rate" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bid_rate" fill="#3B82F6" name="Bid Rate" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offer_rate" fill="#F97316" name="Offer Rate" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

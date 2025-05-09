'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import QuoteDetails from '@/components/QuoteDetails/QuoteDetails';

export default function QuoteDetailsPage() {
  const params = useParams<{ quoteId: string }>();
  const quoteId = params?.quoteId || '';
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchWithLoading(`/api/fx-transfer/quotes/${quoteId}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setQuote(data as any);
      } catch (err) {
        setError('Failed to load quote details.');
        console.error('Error fetching quote details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (quoteId) fetchDetails();
  }, [quoteId]);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-surface text-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Quote Details</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && quote && <QuoteDetails quote={quote} />}
    </div>
  );
}


'use client';

import { useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

export default function FXTransferPing() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string | null>(null);

  const handlePing = async () => {
    setStatus('loading');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await fetchWithLoading<any>(
        '/api/fx-transfer/ping',
        SEB_ROUTES.TRANSFER_PING,
        SEB_PRODUCTS.FX_RATES,
      );
      setResponse(data.message || 'API is reachable ✅');
      setStatus('success');
    } catch (err) {
      setResponse('Failed to reach API.');
      setStatus('error');
      console.error('Ping error:', err);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg text-gray-100 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📡 Ping FX Transfer API</h2>
      <button
        onClick={handlePing}
        className="button-primary"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Pinging...' : 'Ping API'}
      </button>

      {status !== 'idle' && (
        <p className={`mt-4 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {response}
        </p>
      )}
    </div>
  );
}

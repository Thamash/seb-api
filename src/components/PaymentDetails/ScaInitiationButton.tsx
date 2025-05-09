'use client';

import { useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { updatePayment } from '@/lib/paymentsStorage';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

interface Props {
  paymentId: string;
  paymentProduct: string;
  authenticationMethodId: string | null;
  disabled?: boolean;
  onAuthFinished: () => void;
}

export const ScaInitiationButton = ({
  paymentId,
  paymentProduct,
  authenticationMethodId,
  disabled = false,
  onAuthFinished,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSca = async () => {
    if (!authenticationMethodId) {
      setError('Please select an authentication method.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res: { redirectUrl?: string } = await fetchWithLoading(
        '/api/psd2-payments/sca/start',
        `${SEB_ROUTES.PAYMENT_AUTHENTICATION_BASE_URL}${paymentProduct}/${paymentId}/authorisations`,
        SEB_PRODUCTS.PSD2_PAYMENT_INITIATION,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
            paymentProduct,
            authenticationMethodId,
          }),
        }
      );

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        updatePayment(paymentId, { authStarted: true });
        onAuthFinished();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to start authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleStartSca}
        className="button-primary disabled:opacity-50"
        disabled={disabled || loading}
      >
        {loading ? 'Starting...' : 'Start Authentication'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

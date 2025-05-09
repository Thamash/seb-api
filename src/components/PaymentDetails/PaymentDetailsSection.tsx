'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { ScaInitiationDropdown } from './ScaInitiationDropdown';
import { ScaInitiationButton } from './ScaInitiationButton';
import { getPaymentById, updatePayment } from '@/lib/paymentsStorage';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';
import { TransactionStatusInfo } from '../TransactionInfoStatus/TransactionInfoStatus';

interface Props {
  paymentId: string;
  paymentProduct: string;
}

export const PaymentDetailsSection = ({ paymentId, paymentProduct }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payment, setPayment] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showPollingMessage, setShowPollingMessage] = useState<boolean>(false);

  const paymentProductName = 'swedish-domestic-private-bankgiros';
  useEffect(() => {
    const localPayment = getPaymentById(paymentId);
    setPayment(localPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!paymentId) return;

    fetchWithLoading(
      `/api/psd2-payments/details/${paymentId}`,
      `${SEB_ROUTES.PAYMENT_INITIATION}${paymentProductName}/${paymentId}`,
      SEB_PRODUCTS.PSD2_PAYMENT_INITIATION
    )
      .then((data) => setDetails(data))
      .catch((err) => {
        console.error('Details fetch error:', err);
        setError('Failed to fetch payment details');
      });
  }, [paymentId]);

  useEffect(() => {
    if (!paymentId) return;
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const fetchStatus = async () => {
    await fetchWithLoading(
      `/api/psd2-payments/status/${paymentId}`,
      `${SEB_ROUTES.PAYMENT_INITIATION}${paymentProductName}/${paymentId}/status`,
      SEB_PRODUCTS.PSD2_PAYMENT_INITIATION
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        setStatus(data);
        if (data.transactionStatus !== 'RCVD' && intervalRef.current) {
          clearInterval(intervalRef.current);
          updatePayment(paymentId, { status: data.transactionStatus });
          setShowPollingMessage(false);
          intervalRef.current = null;
          console.log('Stopped polling: status is', data.transactionStatus);
        }
      })
      .catch((err) => {
        console.error('Status fetch error:', err);
        setError('Failed to fetch payment status');
      });
  };

  const handleAuthFinished = () => {
    const localPayment = getPaymentById(paymentId);
    setPayment(localPayment);
    setShowPollingMessage(true);
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        fetchStatus();
      }, 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 bg-surface rounded-xl shadow-lg text-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-white">Payment Details</h2>

      {error && <p className="text-red-500">{error}</p>}

      {details && (
        <section>
          <h3 className="text-xl font-semibold text-white mb-2">Details</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Template:</strong> {details.templateId}
            </p>
            <p>
              <strong>Amount:</strong> {details.instructedAmount.amount}{' '}
              {details.instructedAmount.currency}
            </p>
            <p>
              <strong>Debtor IBAN:</strong> {details.debtorAccount?.iban}
            </p>
            <p>
              <strong>Creditor Account (BGNR):</strong>{' '}
              {details.creditorAccount?.bgnr}
            </p>
            <p>
              <strong>Remittance Info:</strong>{' '}
              {details.remittanceInformationUnstructured}
            </p>
            <p>
              <strong>Execution Date:</strong> {details.requestedExecutionDate}
            </p>
          </div>
        </section>
      )}

      {status && (
        <section>
          <h3 className="text-xl font-semibold text-white mb-2">Status</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Payment ID:</strong> {status.paymentId}
            </p>

            <TransactionStatusInfo status={status.transactionStatus}/>

            {status.tppMessages?.length > 0 && (
              <div>
                <strong>TPP Messages:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {status.tppMessages.map((msg: string, idx: number) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!payment.authStarted &&
            payment.status === 'RCVD' &&
            status.scaMethods && (
              <div className="mt-6 space-y-4">
                <ScaInitiationDropdown
                  scaMethods={status.scaMethods}
                  selectedMethodId={selectedMethod}
                  onChange={setSelectedMethod}
                />

                <ScaInitiationButton
                  paymentId={paymentId}
                  paymentProduct={paymentProduct}
                  authenticationMethodId={selectedMethod}
                  disabled={!selectedMethod}
                  onAuthFinished={handleAuthFinished}
                />
              </div>
            )}
          {showPollingMessage && (
            <p className="text-sm text-gray-400 mt-4">
              Polling for status updates. Please wait...
            </p>
          )}
        </section>
      )}
    </div>
  );
};

'use client';

import { useState } from 'react';
import PaymentStatusViewer from '../PaymentStatusViewer/PaymentStatusViewer';
import { savePayment } from '@/lib/paymentsStorage';
import { useRouter } from 'next/navigation';
import { isAfter, isWeekend, startOfToday } from 'date-fns';
import DatePicker from 'react-datepicker';
import { fetchWithLoading } from '@/lib/fetchWithLoading';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';

export default function SEPAInitiationForm() {
  const IBAN = 'SE3750000000054400047881';
  const CURRENCY = 'SEK';
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    amount: '',
    currency: CURRENCY,
    iban: IBAN,
    name: '',
    remittance: '',
    requestedExecutionDate: getNextWeekdayDate(),
  });

  function getNextWeekdayDate(): Date {
    const today = new Date();
    const day = today.getDay();

    if (day === 6) {
      today.setDate(today.getDate() + 2);
    } else if (day === 0) {
      today.setDate(today.getDate() + 1);
    }

    const newDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return newDate;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any | null>(null);
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      setForm((prev) => ({ ...prev, requestedExecutionDate: normalizedDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    let delayedRedirect = false;

    try {
      const tokenCheck = await fetch('/api/auth/check');
      const authData = await tokenCheck.json();

      if (!authData.authenticated) {
        router.push('/');
        return;
      }
      const data = await fetchWithLoading<{
        paymentId: string;
        templateId: string;
      }>(
        '/api/psd2-payments/initiate',
        `${SEB_ROUTES.PAYMENT_INITIATION}/swedish-domestic-private-bankgiros`,
        SEB_PRODUCTS.PSD2_PAYMENT_INITIATION,
        {
          method: 'POST',
          body: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data?.paymentId) {
        savePayment({ ...data, status: 'RCVD' });
        delayedRedirect = true;

        setTimeout(() => {
          setLoading(false);
          router.push(
            `/payment/${data.paymentId}/details?product=${data.templateId}`
          );
        }, 5000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Payment error:', err);
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Error in payment initiation';
      setError(() => {
        try {
          const parsed = JSON.parse(message);
          return parsed?.error || message;
        } catch {
          return message;
        }
      });
    } finally {
      if (!delayedRedirect) {
        setLoading(false); // csak ha nem megyünk átirányításba
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-surface p-6 rounded-xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Initiate SEPA Credit Transfer</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 text-gray-400">Amount</label>
          <input
            type="number"
            name="amount"
            min={0}
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          >
            <option value={CURRENCY}>{CURRENCY}</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Creditor IBAN</label>
          <select
            name="iban"
            value={form.iban}
            onChange={handleChange}
            required
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          >
            <option value={IBAN}>{IBAN}</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Execution Date</label>
          <DatePicker
            selected={form.requestedExecutionDate}
            onChange={handleDateChange}
            filterDate={(date: Date) =>
              !isWeekend(date) &&
              (isAfter(date, startOfToday()) ||
                date.toDateString() === new Date().toDateString())
            }
            minDate={new Date()}
            placeholderText="Select a date"
            dateFormat="yyyy-MM-dd"
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Creditor Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Remittance Info</label>
          <input
            type="text"
            name="remittance"
            value={form.remittance}
            onChange={handleChange}
            className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Initiate Payment'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result?.paymentId && (
        <div className="mt-6">
          <PaymentStatusViewer paymentId={result.paymentId} />
        </div>
      )}
    </div>
  );
}

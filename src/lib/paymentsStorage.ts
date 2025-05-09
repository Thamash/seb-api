/* eslint-disable @typescript-eslint/no-explicit-any */
export const SAVED_PAYMENTS_STORAGE_KEY = 'savedPayments';

export function savePayment(payment: any) {
  const existing = JSON.parse(
    localStorage.getItem(SAVED_PAYMENTS_STORAGE_KEY) || '[]'
  );
  const updated = [...existing, { ...payment, authStarted: false }];
  localStorage.setItem(SAVED_PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedPayments() {
  return JSON.parse(localStorage.getItem(SAVED_PAYMENTS_STORAGE_KEY) || '[]');
}

export function getPaymentById(paymentId: string) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(SAVED_PAYMENTS_STORAGE_KEY);
  if (!stored) return null;
  const payments = JSON.parse(stored);
  const payment = payments.find((p: any) => p.paymentId === paymentId);
  if (!payment) return null;
  return payment;
}

export function updatePayment(paymentId: string, updatedPayment: any) {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(SAVED_PAYMENTS_STORAGE_KEY);
  if (!stored) return;

  try {
    const payments = JSON.parse(stored);
    if (!Array.isArray(payments)) return;

    const updatedPayments = payments.map((payment: any) =>
      payment.paymentId === paymentId
        ? { ...payment, ...updatedPayment }
        : payment
    );

    localStorage.setItem(
      SAVED_PAYMENTS_STORAGE_KEY,
      JSON.stringify(updatedPayments)
    );
  } catch (err) {
    console.error('Failed to update authStarted in localStorage:', err);
  }
}

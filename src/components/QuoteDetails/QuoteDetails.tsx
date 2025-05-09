'use client';

interface QuoteDetailsProps {
  quote: {
    quote_id: string;
    customer_id: string;
    status: string;
    valid_until: string;
    debit_amount: { amount: number; currency: string };
    credit_amount: { amount: number; currency: string };
    exchange_rate: { rate: number; rate_currency: string; quotedCurrency: string };
  };
}

export default function QuoteDetails({ quote }: QuoteDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <p><span className="text-gray-400">Quote ID:</span> {quote.quote_id}</p>
      <p><span className="text-gray-400">Status:</span> {quote.status}</p>
      <p><span className="text-gray-400">Valid Until:</span> {new Date(quote.valid_until).toLocaleString()}</p>
      <p><span className="text-gray-400">Exchange Rate:</span> {quote.exchange_rate.rate.toFixed(4)} {quote.exchange_rate.rate_currency}</p>
      <p><span className="text-gray-400">Debit:</span> {quote.debit_amount.amount} {quote.debit_amount.currency}</p>
      <p><span className="text-gray-400">Credit:</span> {quote.credit_amount.amount.toFixed(2)} {quote.credit_amount.currency}</p>
      <p><span className="text-gray-400">Customer ID:</span> {quote.customer_id}</p>
    </div>
  );
}

'use client'

import React from 'react';
import { QuoteResultProps } from './QuoteResult.types';
//import Link from 'next/link';

export const QuoteResult: React.FC<QuoteResultProps> = ({ quote }) => {
  if (!quote) return null;

  return (
    <div className="mt-6 p-4 bg-surface border border-primary rounded-xl text-sm text-gray-100 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-3">Quote Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
        <p><span className="text-gray-400">Quote ID:</span> {quote.quote_id}</p>
        <p><span className="text-gray-400">Status:</span> {quote.status}</p>
        <p><span className="text-gray-400">Valid Until:</span> {new Date(quote.valid_until).toLocaleString()}</p>
        <p><span className="text-gray-400">Customer ID:</span> {quote.customer_id}</p>
        <p>
          <span className="text-gray-400">Exchange Rate:</span> {quote.exchange_rate.rate} {quote.exchange_rate.rate_currency} → {quote.exchange_rate.quoted_currency}
        </p>
        <p>
          <span className="text-gray-400">Debit Amount:</span> {quote.debit_amount.amount} {quote.debit_amount.currency}
        </p>
        <p>
          <span className="text-gray-400">Credit Amount:</span> {quote.credit_amount.amount.toFixed(2)} {quote.credit_amount.currency}
        </p>
      </div>
      {/* <Link href={`/fx-transfer/quote/${quote.quote_id}`}>
        <button className="button-primary mt-4">View Details</button>
      </Link> */}
    </div>
  );
};

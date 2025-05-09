'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  DollarSign,
  User,
  ArrowDownLeft,
  ChevronDown,
} from 'lucide-react';
import React, { useState } from 'react';
import { TransactionRowProps } from './TransactionRow.types';

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  expanded,
  fetchTransactionDetails,
}) => {
  const isNegative = parseFloat(transaction.transactionAmount?.amount) < 0;
  const details = expanded[transaction.transactionId];
  const isExpanded = Boolean(details);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchTransactionDetails = async (transactionId: string) => {
    setLoading(true);
    await fetchTransactionDetails(transactionId)
    setLoading(false);
  }

  const renderBadge = () => (
    <span
      className={`group relative inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
        isNegative
          ? 'bg-red-500/20 text-red-400'
          : 'bg-green-500/20 text-green-400'
      }`}
    >
      {isNegative ? 'Outgoing' : 'Incoming'}
      <span className="absolute z-10 hidden px-2 py-1 mt-1 text-xs text-white -translate-x-1/2 bg-gray-800 rounded w-max top-full left-1/2 group-hover:block whitespace-nowrap">
        {isNegative ? 'Money sent from your account' : 'Money received'}
      </span>
    </span>
  );

  return (
    <>
      <tr
        key={transaction.transactionId}
        className="transition-colors cursor-pointer hover:bg-[#2A2A2A] border-t border-[#333]"
        onClick={() => handleFetchTransactionDetails(transaction.transactionId)}
      >
        <td className="p-4 text-gray-300 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
            {transaction.bookingDate}
          </div>
        </td>
        <td
          className={`p-4 font-semibold whitespace-nowrap ${
            isNegative ? 'text-red-400' : 'text-primary'
          }`}
        >
          {transaction.transactionAmount?.amount}
        </td>
        <td className="p-4 text-gray-300 whitespace-nowrap">
          {transaction.transactionAmount?.currency}
        </td>
        <td className="p-4 text-gray-300">

            {transaction.descriptiveText}

        </td>
        <td className="p-4 text-gray-400 whitespace-nowrap">
          {transaction.proprietaryBankTransactionCodeText}
        </td>
      </tr>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="bg-[#2A2A2A] px-6 pb-6 pt-2">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="max-w-4xl px-2 mx-auto mt-2 text-sm text-gray-300">
                  {loading ? (
                    <SkeletonLoader />
                  ) : details.data ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Detail icon={<DollarSign size={16} />} label="Amount">
                          <div className="flex items-center gap-2">
                            <span>
                              {details.data.transactionAmount?.amount}{' '}
                              {details.data.transactionAmount?.currency}
                            </span>
                            {renderBadge()}
                          </div>
                        </Detail>

                        <Detail icon={<ArrowDownLeft size={16} />} label="Type">
                          {details.data.proprietaryBankTransactionCodeText}
                        </Detail>

                        <Detail icon={<CalendarDays size={16} />} label="Booking Date">
                          {details.data.bookingDate}
                        </Detail>

                        <Detail icon={<CalendarDays size={16} />} label="Value Date">
                          {details.data.valueDate}
                        </Detail>

                        <Detail icon={<User size={16} />} label="Debtor BBAN">
                          {details.data.debtorAccount?.bban}
                        </Detail>

                        <Detail icon={<User size={16} />} label="Creditor BBAN">
                          {details.data.creditorAccount?.bban}
                        </Detail>

                        {details.data?.debtorReference && (
                          <Detail label="Debtor Reference">
                            {details.data.debtorReference}
                          </Detail>
                        )}

                        {details.data?.remittanceInformationUnstructuredArray && (
                          <div className="md:col-span-2">
                            <div className="mb-1 text-xs text-gray-400 uppercase">
                              Remittance Info
                            </div>
                            <ul className="space-y-1 text-gray-300 list-disc list-inside">
                              {details.data.remittanceInformationUnstructuredArray.map(
                                (item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : details.error ? (
                    <div className="mt-4 font-semibold text-center text-red-500">
                      No data found for this transaction.
                    </div>
                  ) : (
                    <div className="mt-4 italic text-center text-gray-500">
                      No detail available.
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const Detail = ({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1 text-xs tracking-wide text-gray-400 uppercase">
      {icon && <span className="opacity-80">{icon}</span>}
      {label}
    </div>
    <div className="font-medium text-gray-100">{children}</div>
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="w-1/3 h-4 bg-gray-700 rounded" />
    <div className="w-2/3 h-4 bg-gray-700 rounded" />
    <div className="w-1/4 h-4 bg-gray-700 rounded" />
    <div className="w-1/2 h-4 bg-gray-700 rounded" />
  </div>
);

export default TransactionRow;

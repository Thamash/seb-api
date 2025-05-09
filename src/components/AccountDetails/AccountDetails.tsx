'use client';

import React, { useEffect, useState } from 'react';
import { Account, AccountDetailsProps } from './AccountDetails.types';
import { getUrlWithoutParams } from '@/lib/helpers';
import { SEB_ROUTES } from '@/config/routes';
import { SEB_PRODUCTS } from '@/config/products';
import { fetchWithLoading } from '@/lib/fetchWithLoading';

const AccountDetails =  ({ account, token, id }: AccountDetailsProps) => {
const [accountDetails, setAccountDetails] = useState<Account | null>(null);


  useEffect(() => {
    if(!id) return;
    const cookieHeader = `access_token=${token}`;
      fetchWithLoading<{account: Account}>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/${id}`,
        `${SEB_ROUTES.ACCOUNTS}/${id}?withBalance=true`,
        SEB_PRODUCTS.PSD2_ACCOUNT_INFORMATION,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: cookieHeader
          },
        }
      )
        .then(response => response)
        .then(data => {
          if (data.account) {
            setAccountDetails(data.account);
          }
        })
        .catch(error => {
          console.error('Failed to save code:', error);
        });
    }, [account, id, token]);



  return (
    <div className="w-full max-w-3xl p-6 mx-auto mt-6 text-gray-100 shadow-lg rounded-2xl bg-surface">
      {accountDetails && (<>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{accountDetails?.name}</h2>
          <p className="text-sm text-gray-400">{accountDetails?.product}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <span className="font-medium text-gray-400">IBAN:</span>{' '}
            {accountDetails?.iban}
          </div>
          <div>
            <span className="font-medium text-gray-400">BBAN:</span>{' '}
            {accountDetails?.bban}
          </div>
          <div>
            <span className="font-medium text-gray-400">Owner:</span>{' '}
            {accountDetails?.ownerName}
          </div>
          <div>
            <span className="font-medium text-gray-400">Status:</span>{' '}
            {accountDetails?.status}
          </div>
          <div>
            <span className="font-medium text-gray-400">Currency:</span>{' '}
            {accountDetails?.currency}
          </div>
          <div>
            <span className="font-medium text-gray-400">BIC:</span> {accountDetails?.bic}
          </div>
          <div>
            <span className="font-medium text-gray-400">BIC Address:</span>{' '}
            {accountDetails?.bicAddress}
          </div>
          <div>
            <span className="font-medium text-gray-400">Interest Rate:</span>{' '}
            {accountDetails?.accountInterest}%
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold text-white">Balances</h3>
          <div className="overflow-hidden border rounded-md border-primary">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs text-gray-400 uppercase table-header">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Credit Limit Included?</th>
                </tr>
              </thead>
              <tbody>
                {accountDetails?.balances.map((balance, index) => (
                  <tr
                    key={index}
                    className="border-t border-[#333] table-row-hover transition"
                  >
                    <td className="p-3">{balance.balanceType}</td>
                    <td className="p-3">{balance.balanceAmount.amount}</td>
                    <td className="p-3">{balance.balanceAmount.currency}</td>
                    <td className="p-3">
                      {balance.creditLimitIncluded ? '✔️' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <a
            href={accountDetails?._links.transactions.href}
            className="text-sm button-primary"
          >
            View Transactions →
          </a>

          {accountDetails?._links.transactions.href && (<a
            href={`${getUrlWithoutParams(
              accountDetails?._links.transactions.href
            )}/timeline`}
            className="text-sm button-primary"
          >
            View Timeline →
          </a>)}
        </div>
        </>)}
    </div>
  );
};

export default AccountDetails;

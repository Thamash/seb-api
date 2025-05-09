'use client';

import Link from 'next/link';
import { AccountCardProps } from './AccountCard.types';

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  return (
    <Link href={`/accounts/${account.resourceId}`} className="block group">
      <div className="card-dark p-5 transition-transform duration-300 ease-in-out rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:border-primary">
        <h2 className="mb-1 text-lg font-semibold text-white transition group-hover:text-primary">
          {account.ownerName}
        </h2>
        <p className="mb-4 text-sm text-gray-400">{account.name}</p>

        <div className="space-y-1 text-sm text-gray-300">
          <p>
            <span className="font-medium text-gray-400">Resource ID:</span>{' '}
            {account.resourceId}
          </p>
          <p>
            <span className="font-medium text-gray-400">IBAN:</span>{' '}
            {account.iban}
          </p>
          <p>
            <span className="font-medium text-gray-400">BBAN:</span>{' '}
            {account.bban}
          </p>
          <p>
            <span className="font-medium text-gray-400">Status:</span>{' '}
            {account.status}
          </p>
          <p>
            <span className="font-medium text-gray-400">Currency:</span>{' '}
            {account.currency}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;

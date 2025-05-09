import { useState } from 'react';
import { Info } from 'lucide-react';

export const TransactionStatusInfo = ({ status }: { status: string }) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RCVD':
        return 'bg-yellow-600 text-yellow-100';
      case 'ACTC':
        return 'bg-blue-600 text-blue-100';
      case 'ACSC':
        return 'bg-green-600 text-green-100';
      case 'CANC':
        return 'bg-gray-600 text-gray-100';
      case 'RJCT':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <>
      <p className="flex items-center gap-2">
        <strong>Transaction Status:</strong>
        <Info
          className="w-4 h-4 text-gray-400 cursor-pointer"
          onClick={() => setOpen(true)}
        />
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      </p>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface max-w-xl w-full p-6 rounded-lg shadow-xl text-sm relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4 text-white">
              Transaction Status Guide
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong>RCVD</strong> – Received: The payment has been received by SEB. To determine if payment is ready for signing, check the links block. Recommended polling interval is 5 seconds.
              </p>
              <p>
                <strong>RCVD + link</strong> – Received: If &quot;startAuthorisationWithAuthenticationMethodSelection&quot; link is shown, the payment system has validated the payment. Please post authenticationMethodId to suitable authorisations endpoint.
              </p>
              <p>
                <strong>ACTC</strong> – AcceptedTechnicalValidation: The payment initiation is signed and stored for execution.
              </p>
              <p>
                <strong>ACSC</strong> – AcceptedSettlementCompleted: The payment has been executed on the desired date.
              </p>
              <p>
                <strong>CANC</strong> – Cancelled: The payment has been cancelled and will not be executed.
              </p>
              <p>
                <strong>RJCT</strong> – Rejected: The payment initiation failed. It must be re-posted as a new payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

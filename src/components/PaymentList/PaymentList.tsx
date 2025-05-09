'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SAVED_PAYMENTS_STORAGE_KEY } from '@/lib/paymentsStorage'

interface PaymentData {
  paymentId: string
  templateId: string
  instructionId: string
  instructedAmount: {
    amount: string
    currency: string
  }
  creditorName: string
  requestedExecutionDate: string
  status: string
}

export default function PaymentList() {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem(SAVED_PAYMENTS_STORAGE_KEY)
    if (stored) {
      try {
        setPayments(JSON.parse(stored))
      } catch {
        console.warn('Failed to parse stored payments')
      }
    }
  }, [])

  const handleNavigate = (paymentId: string, templateId: string) => {
    router.push(`/payment/${paymentId}/details?product=${templateId}`)
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-surface p-6 rounded-xl shadow-lg text-gray-100">
      {payments.length === 0 ? (
        <p className="text-gray-400">No saved payments.</p>
      ) : (
        <table className="min-w-full text-sm text-left border border-[#2a2a2a] rounded">
          <thead className="text-xs uppercase text-gray-400 bg-[#1C1C1C]">
            <tr>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Creditor</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId} className="border-t border-[#2a2a2a] hover:bg-[#2a2a2a]">
                <td className="px-4 py-2 font-medium">{payment.paymentId}</td>
                <td className="px-4 py-2">{payment.instructedAmount.amount} {payment.instructedAmount.currency}</td>
                <td className="px-4 py-2">{payment.creditorName}</td>
                <td className="px-4 py-2">{payment.requestedExecutionDate}</td>
                <td className="px-4 py-2">{payment.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleNavigate(payment.paymentId, payment.templateId)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

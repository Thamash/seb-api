'use client'

import { useEffect, useState } from 'react'
import { fetchWithLoading } from '@/lib/fetchWithLoading'

interface PaymentStatusProps {
  paymentId: string
  paymentProduct: string
}

export default function PaymentStatus({ paymentId, paymentProduct }: PaymentStatusProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statusData, setStatusData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true)
      try {
        const res = await fetchWithLoading(
          `/api/psd2-payments/status?paymentId=${paymentId}&paymentProduct=${paymentProduct}`
        )
        setStatusData(res)
      } catch (err) {
        setError('Failed to fetch payment status.')
        console.error('Error fetching payment status:', err)
      } finally {
        setLoading(false)
      }
    }

    if (paymentId && paymentProduct) {
      fetchStatus()
    }
  }, [paymentId, paymentProduct])

  return (
    <div className="mt-6 bg-surface p-6 rounded-xl shadow-lg text-gray-100">
      <h3 className="text-xl font-bold mb-4 text-white">Payment Status</h3>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {statusData && (
        <pre className="bg-[#1C1C1C] p-4 rounded text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify(statusData, null, 2)}
        </pre>
      )}
    </div>
  )
}

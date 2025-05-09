'use client'

import { useEffect, useState } from 'react'
import { fetchWithLoading } from '@/lib/fetchWithLoading'

interface Props {
  paymentId: string
}

export default function PaymentStatusViewer({ paymentId }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchWithLoading(`/api/psd2-payments/status/${paymentId}`) as { transactionStatus?: string }
        setStatus(data.transactionStatus || 'Unknown')
      } catch (err) {
        console.error('Status error:', err)
        setError('Failed to fetch payment status')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [paymentId])

  return (
    <div className="bg-[#1C1C1C] border border-[#2a2a2a] rounded-lg p-4 text-sm">
      <h4 className="text-lg font-semibold text-white mb-2">Payment Status</h4>

      {loading && <p className="text-gray-400">Checking status...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && status && (
        <p className="text-primary font-semibold">Status: {status}</p>
      )}
    </div>
  )
}

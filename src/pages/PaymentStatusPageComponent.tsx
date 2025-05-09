'use client'

import { useParams } from 'next/navigation'
import PaymentStatus from '@/components/PaymentStatus/PaymentStatus'

export default function PaymentStatusPageComponent() {
  const params = useParams<{ paymentId: string }>()
  const paymentId = params?.paymentId

  if (!paymentId) {
    return <p className="text-red-500">Missing payment ID in URL.</p>
  }

  const savedPayments = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('savedPayments') || '[]')
    : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payment = savedPayments.find((p: any) => p.paymentId === paymentId)

  if (!payment) {
    return <p className="text-red-500">Payment not found in saved list.</p>
  }

  return <PaymentStatus paymentId={payment.paymentId} paymentProduct={payment.templateId} />
}

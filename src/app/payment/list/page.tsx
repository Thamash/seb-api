'use client'

import PaymentList from '@/components/PaymentList/PaymentList'

export default function PaymentListPage() {
  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-surface rounded-xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-white">Initiated Payments</h2>
      <PaymentList />
    </div>
  )
}

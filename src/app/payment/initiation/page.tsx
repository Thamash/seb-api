'use client'

import SEPAInitiationForm from '@/components/SEPAInitiationForm/SEPAInitiationForm'

export default function PaymentInitiationPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-surface rounded-xl shadow-lg text-gray-100">
      <SEPAInitiationForm />
    </div>
  )
}

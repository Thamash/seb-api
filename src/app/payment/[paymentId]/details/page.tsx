import { notFound } from 'next/navigation'
import { PaymentDetailsSection } from '@/components/PaymentDetails/PaymentDetailsSection'

export default async function PaymentDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ paymentId: string }>
  searchParams: Promise<{ product?: string }>
}) {
  const { paymentId } = await params
  const { product: paymentProduct } = await searchParams

  if (!paymentProduct) {
    return notFound()
  }

  return (
    <PaymentDetailsSection
      paymentId={paymentId}
      paymentProduct={paymentProduct}
    />
  )
}

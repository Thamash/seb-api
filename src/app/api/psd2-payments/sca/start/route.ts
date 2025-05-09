import { SEB_ROUTES } from '@/config/routes'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { paymentId, paymentProduct, authenticationMethodId } = await req.json()

  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Access token missing' }), { status: 401 })
  }

  const res = await fetch(`${SEB_ROUTES.PAYMENT_AUTHENTICATION_BASE_URL}${paymentProduct}/${paymentId}/authorisations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Request-ID': crypto.randomUUID(),
      'PSU-IP-Address': '127.0.0.1',
      'PSU-ID': '9311219639',
      'TPP-Redirect-URI': 'https://localhost:3000/payment/success'
    },
    body: JSON.stringify({
      authenticationMethodId
    })
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('SCA initiation failed:', err)
    return new Response(JSON.stringify({ error: 'SCA initiation failed', detail: err }), {
      status: res.status,
    })
  }

  const data = await res.json()

  return new Response(JSON.stringify({ redirectUrl: data._links?.scaRedirect?.href || null }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
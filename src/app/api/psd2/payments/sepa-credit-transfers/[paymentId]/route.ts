import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ paymentId: string; }>;
  }
): Promise<Response> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Missing access token' }), {
      status: 401,
    })
  }

  //const  paymentId = params.paymentId
  const { paymentId } = await params;

  const response = await fetch(`https://api.sbx.sebgroup.com/psd2/v1/payments/sepa-credit-transfers/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'X-Request-ID': crypto.randomUUID(),
      'Consent-ID': 'demo-consent-id'
    },
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(JSON.stringify({ error: `Status fetch failed: ${error}` }), {
      status: response.status,
    })
  }

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Access token missing' }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { paymentProduct, paymentId, authenticationMethodId } = body;

  if (!paymentProduct || !paymentId || !authenticationMethodId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  const res = await fetch(
    `https://api.sbx.sebgroup.com/pis/v8/identified2/payments/${paymentProduct}/${paymentId}/authorisations`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
        'PSU-IP-Address': '127.0.0.1',
        'PSU-ID': '9311219639',
      },
      body: JSON.stringify({
        authenticationMethodId,
      }),
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

import { cookies } from 'next/headers';

export async function GET(
  _req: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Access token missing' }), {
      status: 401,
    });
  }

  const paymentProduct = 'swedish-domestic-private-bankgiros'; // mock

  const res = await fetch(
    `https://api-sandbox.sebgroup.com/pis/v8/identified2/payments/${paymentProduct}/${paymentId}/authorisations`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      },
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

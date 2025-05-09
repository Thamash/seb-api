import { SEB_ROUTES } from '@/config/routes';

export async function POST(req: Request) {
  try {
    const { amount, debitCurrency, creditCurrency } = await req.json();

    const tokenRes = await fetch(SEB_ROUTES.TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SEB_AUTH_CLIENT_ID || '',
        client_secret: process.env.SEB_AUTH_CLIENT_SECRET || '',
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      throw new Error(`Token fetch failed: ${errorText}`);
    }

    const { access_token } = await tokenRes.json();

    const quoteRes = await fetch(SEB_ROUTES.FX_TRANSFER_QUOTES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        amount: {
          amount,
          currency: debitCurrency,
        },
        credit_currency: creditCurrency,
        customer_id: '5999500803',
        debit_currency: debitCurrency,
      }),
    });

    if (!quoteRes.ok) {
      const errorText = await quoteRes.text();
      throw new Error(`Quote fetch failed: ${errorText}`);
    }

    const data = await quoteRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Quote error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch quote' }), {
      status: 500,
    });
  }
}

import { SEB_ROUTES } from '@/config/routes';

export async function GET() {
  try {
    const tokenRes = await fetch(SEB_ROUTES.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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

    const tradeRequestBody = {
      customerId: "59995008030004",
      legs: [
        {
          amount: {
            amount: 1000,
            currency: "USD"
          },
          creditCurrency: "EUR",
          debitCurrency: "USD",
          customerId: "59995008030004",
          tenor: "SPOT"
        }
      ]
    };

    const tradeRes = await fetch('https://api.sbx.sebgroup.com/s2s-ext/fx-marketorder/v2/trades', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-request-id': crypto.randomUUID(),
      },
      body: JSON.stringify(tradeRequestBody),
    });

    if (!tradeRes.ok) {
      const errorText = await tradeRes.text();
      throw new Error(`Trade request failed: ${errorText}`);
    }

    const data = await tradeRes.json();

    console.dir('resp: ', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Alternative Investment API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch alternative investments' }), {
      status: 500,
    });
  }
}
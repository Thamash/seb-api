import { SEB_ROUTES } from '@/config/routes';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
): Promise<Response> {
  try {
    const { quoteId } = await params;

    const tokenRes = await fetch(
      SEB_ROUTES.TOKEN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.SEB_AUTH_CLIENT_ID || '',
          client_secret: process.env.SEB_AUTH_CLIENT_SECRET || '',
        }),
      }
    );

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      throw new Error(`Token fetch failed: ${errorText}`);
    }

    const { access_token } = await tokenRes.json();

    const quoteRes = await fetch(
      `https://api.sbx.sebgroup.com/cvp/fx-currency-exchange-service/v1/quotes/${quoteId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!quoteRes.ok) {
      const error = await quoteRes.text();
      throw new Error(`Quote details fetch failed: ${error}`);
    }

    const data = await quoteRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Quote details error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch quote details.' }),
      { status: 500 }
    );
  }
}

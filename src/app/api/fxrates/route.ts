import { SEB_ROUTES } from '@/config/routes';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const unitCurrency = searchParams.get('unit_currency') || 'SEK';

  const res = await fetch(`${SEB_ROUTES.FX_RATES}${unitCurrency}`, {
    method: 'GET',
    headers: {
      'apikey': process.env.SEB_API_KEY!,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

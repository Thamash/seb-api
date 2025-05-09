import { SEB_ROUTES } from '@/config/routes';

export async function GET() {
  try {
    const res = await fetch(SEB_ROUTES.TRANSFER_PING);

    if (!res.ok) {
      throw new Error(`Ping failed with status ${res.status}`);
    }

    return new Response(JSON.stringify({ status: 'ok', message: 'API is reachable ✅' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Ping error:', error);
    return new Response(JSON.stringify({ error: 'Ping failed ❌' }), {
      status: 500,
    });
  }
}

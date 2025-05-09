import { SEB_ROUTES } from '@/config/routes';
import { getRandomIpAddress } from '@/lib/helpers';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
): Promise<Response> {
  try {
    const { accountId } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const requestId = randomUUID();
    const sebResponse = await fetch(`${SEB_ROUTES.ACCOUNTS}/${accountId}?withBalance=true`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Request-ID': requestId,
        'PSU-IP-Address': getRandomIpAddress(),
        Accept: 'application/json',
      },
    });

    if (!sebResponse.ok) {
      const error = await sebResponse.text();
      return NextResponse.json({ error }, { status: sebResponse.status });
    }

    const account = await sebResponse.json();

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

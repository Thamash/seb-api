import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SEB_ROUTES } from '@/config/routes';
import { getRandomIpAddress } from '@/lib/helpers';
import { randomUUID } from 'crypto';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ accountId: string; transactionId: string }>;
  }
): Promise<Response> {
  const cookieStorage = await cookies();
  const token = cookieStorage.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }

  const { accountId, transactionId } = await params;
  const requestId = randomUUID();
  const url = `${SEB_ROUTES.ACCOUNTS}/${accountId}/transactions/${transactionId}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Request-ID': requestId,
        'PSU-IP-Address': getRandomIpAddress(),
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

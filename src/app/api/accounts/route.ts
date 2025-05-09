import { SEB_ROUTES } from '@/config/routes';
import { getRandomIpAddress } from '@/lib/helpers';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing access token' },
        { status: 401 }
      );
    }

    const requestId = randomUUID();
    const response = await fetch(SEB_ROUTES.ACCOUNTS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Request-ID': requestId,
        'PSU-IP-Address': getRandomIpAddress(),
        Accept: '*/*',
      },
    });

    const accountsResponse = await response.json();

    return NextResponse.json({
      success: true,
      accounts: accountsResponse.accounts ?? [],
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}

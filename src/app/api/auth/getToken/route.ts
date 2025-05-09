import { SEB_ROUTES } from '@/config/routes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStorage = await cookies();
    const authCode = cookieStorage.get('auth_code')?.value;

    if (!authCode) {
      return NextResponse.json(
        { success: false, error: 'Missing auth code' },
        { status: 401 }
      );
    }

    const tokenResponse = await fetch(SEB_ROUTES.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SEB_CLIENT_ID2}:${process.env.SEB_CLIENT_SECRET2}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: process.env.REDIRECT_URL ?? '',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    cookieStorage.set('access_token', tokenData.access_token);

    return NextResponse.json({
      success: true,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
    });
  } catch (error) {
    console.error('Error during token request:', error);
    return NextResponse.json(
      { success: false, error: 'Error during token request' },
      { status: 500 }
    );
  }
}

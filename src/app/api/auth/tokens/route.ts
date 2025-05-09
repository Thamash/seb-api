import { SEB_ROUTES } from '@/config/routes';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const clientId = process.env.SEB_CLIENT_ID;
    const clientSecret = process.env.SEB_CLIENT_SECRET;

    const body = await request.json();
    const { authReqId } = body;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'MISSING CLIENT ID' },
        { status: 401 }
      );
    }

    const response = await fetch(SEB_ROUTES.TOKENS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        auth_req_id: authReqId,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URL ?? '',
      }),
    });

    const tokenResponse = await response.json();

    if (!tokenResponse.access_token) {
      return NextResponse.json(
        { success: false, error: 'Missing access token' },
        { status: 401 }
      );
    }

    const responseWithCookie = NextResponse.json({
      success: true,
      scope: tokenResponse.scope,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
      tokenType: tokenResponse.token_type,
    });

    responseWithCookie.cookies.set('access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenResponse.expires_in || 3600,
    });

    return responseWithCookie;
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}

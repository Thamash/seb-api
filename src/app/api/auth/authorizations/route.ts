import { SEB_ROUTES } from '@/config/routes';

import { NextResponse } from 'next/server';

export async function POST(): Promise<Response> {
  try {
    const clientId = process.env.SEB_CLIENT_ID;
    const scope = 'psd2_accounts psd2_payments'

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'MISSING CLIENT ID' },
        { status: 401 }
      );
    }

    const response = await fetch(SEB_ROUTES.AUTHORIZATIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        lang: 'en',
        scope,
        start_mode: "ast"
      })
    });

    const authResponse = await response.json();

    return NextResponse.json({
      success: true,
      authReqId: authResponse.auth_req_id,
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}

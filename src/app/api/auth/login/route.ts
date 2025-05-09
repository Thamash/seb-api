import { SEB_ROUTES } from '@/config/routes';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const personalIdentityNumber = process.env.SEB_PERSONAL_IDENTITY_NUMBER;

    const body = await request.json();
    const { start_token } = body;


    if (!personalIdentityNumber) {
      return NextResponse.json(
        { success: false, error: 'MISSING PERSONAL IDENTITY ID' },
        { status: 401 }
      );
    }

    await fetch(SEB_ROUTES.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personal_identity_number: personalIdentityNumber,
        start_token
      })
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}
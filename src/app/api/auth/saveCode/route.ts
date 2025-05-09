import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    (await
      cookies()).set({
      name: 'auth_code',
      value: code,
      maxAge: 60 * 5, // 5 mins
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during save code:', error);
    return NextResponse.json(
      { success: false, error: 'Error during save code' },
      { status: 500 }
    );
  }
}
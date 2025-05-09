import { SEB_ROUTES } from '@/config/routes';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING AUTH REQ ID' },
        { status: 401 }
      );
    }

    const response = await fetch(`${SEB_ROUTES.AUTHORIZATIONS}/${id}`);

    const authResponse = await response.json();

    return NextResponse.json({
      success: true,
      autostartToken: authResponse.autostart_token ?? null,
      status: authResponse.status,
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}
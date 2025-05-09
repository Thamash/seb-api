import { NextResponse } from 'next/server';
import { login } from '@/lib/seb';

export async function POST() {
  try {
    const res = await login();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch rates' },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

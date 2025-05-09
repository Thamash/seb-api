import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/seb';

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const res = await fetch("https://api.sandbox.sebgroup.com/forex/rates?buyCurrency=EUR&sellCurrency=USD", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { SEB_ROUTES } from '@/config/routes'
import { NextRequest } from 'next/server'

export async function GET(_request: NextRequest): Promise<Response> {
  try {
    const tokenRes = await fetch(SEB_ROUTES.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SEB_AUTH_CLIENT_ID || '',
        client_secret: process.env.SEB_AUTH_CLIENT_SECRET || '',
      }),
    })

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text()
      throw new Error(`Token fetch failed: ${errorText}`)
    }

    const { access_token } = await tokenRes.json()

    const statusRes = await fetch('https://api.sbx.sebgroup.com/cvp/psd2/v1/payments/status', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    })

    if (!statusRes.ok) {
      const errorText = await statusRes.text()
      throw new Error(`Status fetch failed: ${errorText}`)
    }

    const data = await statusRes.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Payment status fetch error:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch payment status' }), {
      status: 500,
    })
  }
}

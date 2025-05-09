import { SEB_ROUTES } from '@/config/routes';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = new Date(body.requestedExecutionDate);
    const utcDate = new Date(
      Date.UTC(raw.getFullYear(), raw.getMonth(), raw.getDate())
    );
    const utcBaseDate = utcDate.toISOString().split('T')[0];

    const cookieStorage = await cookies();
    const access_token = cookieStorage.get('access_token')?.value;
    if (!access_token) {
      return new Response(JSON.stringify({ error: 'Access token missing' }), {
        status: 401,
      });
    }
    const paymentProduct = 'swedish-domestic-private-bankgiros';

    const paymentRes = await fetch(`${SEB_ROUTES.PAYMENT_INITIATION}${paymentProduct}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Request-ID': crypto.randomUUID(),
        'PSU-IP-Address': '127.0.0.1',
        'PSU-ID': '9311219639',
      },
      body: JSON.stringify({
        debtorAccount: {
          iban: body.iban,
        },
        creditorAccount: {
          bgnr: '1234567', // Sandbox creditor IBAN
        },
        instructedAmount: {
          amount: body.amount,
          currency: body.currency,
        },
        creditorName: body.creditorName,
        remittanceInformationUnstructured: 'Liten drake',
        requestedExecutionDate: utcBaseDate,
        instructionId: 'Payment info',
        debtorAgentBic: 'DEUTDEFFXXX',
        creditorAgentBic: 'ESSESSESSXXX',
        intermediaryAgentBic: 'DEUTDEFFXXX',
        chargeBearer: 'DEBT',
        templateId: paymentProduct,
      }),
    });

    if (!paymentRes.ok) {
      const error = await paymentRes.text();
      throw new Error(`Payment initiation failed: ${error}`);
    }

    const data = await paymentRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initiate payment' }),
      { status: 500 }
    );
  }
}

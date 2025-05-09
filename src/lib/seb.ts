export const getAccessToken = async () => {
  const clientId = process.env.SEB_CLIENT_ID!;
  const clientSecret = process.env.SEB_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(
    'https://api.sandbox.sebgroup.com/sandbox-authentication/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    }
  );

  if (!res.ok) throw new Error('Failed to authenticate with SEB');

  return res.json(); // { access_token: "...", ... }
};

export const login = async () => {
  const clientId = process.env.SEB_CLIENT_ID!;
  //const clientSecret = process.env.SEB_CLIENT_SECRET!;
  //const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(
    'https://api-sandbox.sebgroup.com/mga/sps/oauth/oauth20/authorize',
    {
      method: 'POST',
      headers: {
        //Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        scope: 'psd2_accounts psd2_payments',
        response_type: 'code',
        redirect_uri: 'http://localhost:3021',
        client_id: clientId,
      }),
    }
  );

  if (!res.ok) throw new Error('Failed to authenticate with SEB');

  return res.json();
};

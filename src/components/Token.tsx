'use client';

import { useState } from 'react';

export default function TokenHandler() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/getToken');
      const data = await response.json();

      if (data.success && data.accessToken) {
        window.location.reload()
        setToken(data.accessToken);
      } else {
        console.error('Failed to retrieve token:', data.error);
      }
    } catch (error) {
      console.error('Failed to retrieve token:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGetToken} disabled={loading} className="px-3 py-2 border border-white rounded-md shadow-sm cursor-pointer scaler-button border-light-green">
        {loading ? 'Loading...' : 'Get Token'}
      </button>
      {token && <p>Token: {token}</p>}
    </div>
  );
}
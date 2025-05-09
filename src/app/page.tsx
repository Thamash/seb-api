'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { SEB_ROUTES } from '@/config/routes';
import { useAuth } from '@/hook/auth/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rate, setRate] = useState<number | null>(null);
  const setLoading = useUIStore.getState().setLoading;
  const loading = useUIStore((state) => state.isLoading);

  const { authenticated, checkAuth } = useAuthStore();
  const { loading: authLoading, startAuthentication } = useAuth();

  const getStatus = useCallback(() => {
    return loading ? 'Checking status...' : authenticated ? 'Authenticated' : 'Not authenticated';
  }, [loading, authenticated]);

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    setRate(10);
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth, setLoading]);

  const handleLogin = async () => {
    try {
      await startAuthentication();
      window.location.reload();
    } catch (err) {
      console.error('ERROR:', err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen gap-8 p-6 text-gray-100 bg-surface">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="card-dark w-[300px] p-4 flex flex-col gap-4 items-center">
          <h1 className="text-xl font-bold">Redirect Authorization</h1>
          <Link
            target="_blank"
            href={`${SEB_ROUTES.REDIRECT_LOGIN}?scope=psd2_accounts%20psd2_payments&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}&client_id=${process.env.NEXT_PUBLIC_SEB_CLIENT_ID2}`}
            rel="noopener noreferrer"
            legacyBehavior
          >
            <span className="button-primary">Login</span>
          </Link>
          <p className="text-sm text-gray-400">
            Client ID: <span className="font-mono text-white">9311219639</span>
          </p>
        </div>

        {/* Decoupled Auth */}
        <div className="card-dark w-[300px] p-4 flex flex-col gap-4 items-center">
          <h1 className="text-xl font-bold">Decoupled Authorization</h1>
          <button
            onClick={handleLogin}
            disabled={authLoading}
            className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        AUTH status: <span className="text-white">{getStatus()}</span>
      </div>
    </main>
  );
}

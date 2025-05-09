import { useCallback, useState } from 'react';
import { AuthResponse, AuthResult, LoginResponse, StatusResponse, UseAuthReturn } from './useAuth.types';
import { useUIStore } from '@/stores/uiStore';

export const useAuth = (): UseAuthReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [authStatus, setAuthStatus] = useState<StatusResponse | null>(null);
  const setLoading = useUIStore.getState().setLoading;
  const loading = useUIStore.getState().isLoading;
  const pollAuthStatus = useCallback(async (
    authReqId: string,
    maxAttempts: number = 3,
    interval: number = 2000
  ): Promise<StatusResponse> => {
    let attempts = 0;

    const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Status checking (${attempts}/${maxAttempts})...`);

      try {

        const statusResponse = await fetch(`/api/auth/authorizations/${authReqId}`)

        if (!statusResponse.ok) {
          throw new Error(`Status check failed with status: ${statusResponse.status}`);
        }

        const statusData: StatusResponse = await statusResponse.json();
        console.log('Status response:', statusData);

        if (statusData.status === 'COMPLETE') {
          console.log('Authentication completed successfully!');
          setAuthStatus(statusData);
          return statusData;
        }

        if (statusData.status === 'ERROR') {
          const errorMsg = `Authentication failed with error: ${statusData.error || 'Unknown error'}`;
          setError(new Error(errorMsg));
          throw new Error(errorMsg);
        }

        await wait(interval);
      } catch (error) {
        console.error(`Polling attempt ${attempts} failed:`, error);

        await wait(interval);
      }
    }

    if (attempts === maxAttempts) {
      const timeoutError = new Error(`Authentication polling timed out after ${maxAttempts} attempts`);
      setError(timeoutError);
      throw timeoutError;
    } else {
      console.log('SUCCESSFUL LOGIN')
      return { status: 'COMPLETE' };
    }
  }, []);


  const startAuthentication = useCallback(async (): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    setAuthStatus(null);

    try {
      const authResponse = await fetch("/api/auth/authorizations", {
        method: "POST"
      });

      if (!authResponse.ok) {
        throw new Error(`Authorization request failed with status: ${authResponse.status}`);
      }

      const { authReqId }: AuthResponse = await authResponse.json();
      console.log('Authorization ID:', authReqId);

      //Status check POST 1
      const statusCheckResponse1 = await fetch(`/api/auth/authorizations/${authReqId}`);

      if (!statusCheckResponse1.ok) {
        throw new Error(`Login request failed with status: ${statusCheckResponse1.status}`);
      }

      const statusCheckResult1: LoginResponse = await statusCheckResponse1.json();
      console.log('statusCheckResult response:', statusCheckResult1);


      //Login POST
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_token: statusCheckResult1.autostartToken
        })
      });

      if (!loginResponse.ok) {
        throw new Error(`Login request failed with status: ${loginResponse.status}`);
      }

      const loginResult: LoginResponse = await loginResponse.json();
      console.log('Login response:', loginResult);


      //Status check POST 2
      const statusCheckResponse = await fetch(`/api/auth/authorizations/${authReqId}`);

      if (!statusCheckResponse.ok) {
        throw new Error(`Login request failed with status: ${statusCheckResponse.status}`);
      }

      const statusCheckResult: LoginResponse = await statusCheckResponse.json();
      console.log('statusCheckResult response:', statusCheckResult);

      const status = await pollAuthStatus(authReqId);

      const tokensResponse = await fetch("/api/auth/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authReqId
        })
      });

      if (!tokensResponse.ok) {
        throw new Error(`Login request failed with status: ${tokensResponse.status}`);
      }

      //FIXME
      const tokensResult: LoginResponse = await tokensResponse.json();
      console.log('Login response:', tokensResult);



      setLoading(false);
      return { authReqId, authStatus: status ?? 'COMPLETE' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error : new Error(error?.message || 'Unknown error'));
      setLoading(false);
      throw error;
    }
  }, [pollAuthStatus, setLoading]);

  return {
    loading,
    error,
    authStatus,
    startAuthentication,
    pollAuthStatus
  };
};
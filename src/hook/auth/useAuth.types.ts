export interface AuthResponse {
  authReqId: string;
}

export interface LoginResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autostartToken: any;
  success: boolean;
}

export interface StatusResponse {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETE' | 'ERROR';
  error?: string;
}

export interface AuthResult {
  authReqId: string;
  authStatus: StatusResponse;
}

export interface UseAuthReturn {
  loading: boolean;
  error: Error | null;
  authStatus: StatusResponse | null;
  startAuthentication: () => Promise<AuthResult>;
  pollAuthStatus: (authReqId: string, maxAttempts?: number, interval?: number) => Promise<StatusResponse>;
}
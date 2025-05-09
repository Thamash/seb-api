/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUIStore } from '@/stores/uiStore';
import { useDebugStore } from '@/stores/debugStore';

export async function fetchWithLoading<T>(
  input: RequestInfo,
  apiUrl?: string,
  product?: string,
  init?: RequestInit
): Promise<T> {
  const setLoading = useUIStore.getState().setLoading;
  const addLog = useDebugStore.getState().addLog;

  const method = init?.method || 'GET';
  const url = typeof input === 'string' ? input : input.toString();
  const requestBody = init?.body ? tryParseJson(init.body) : undefined;
  const timestamp = new Date().toISOString();

  let responseStatus: number | undefined;
  let responseBody: unknown;

  try {
    setLoading(true);
    const res = await fetch(input, init);
    responseStatus = res.status;
    const json = await res.json();
    responseBody = json;

    addLog({
      apiUrl,
      product,
      timestamp,
      method,
      url,
      requestBody,
      responseStatus,
      responseBody,
    });

    if (!res.ok && json?.error?.code !== 'RESOURCE_UNKNOWN') {
      throw new Error('Request failed');
    }

    return json;
  } catch (err) {
    addLog({
      apiUrl,
      product,
      timestamp,
      method,
      url,
      requestBody,
      responseStatus,
      responseBody: err instanceof Error ? err.message : err,
    });
    throw err;
  } finally {
    setLoading(false);
  }
}

function tryParseJson(input: any): unknown {
  try {
    return typeof input === 'string' ? JSON.parse(input) : input;
  } catch {
    return input;
  }
}

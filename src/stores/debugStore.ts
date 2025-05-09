import { create } from 'zustand';

type DebugLog = {
  timestamp: string;
  method: string;
  url: string;
  requestBody?: unknown;
  responseStatus?: number;
  responseBody?: unknown;
  apiUrl?: string;
  product?: string;
};

type DebugStore = {
  logs: DebugLog[];
  addLog: (log: DebugLog) => void;
  clearLogs: () => void;
};

export const useDebugStore = create<DebugStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  clearLogs: () => set({ logs: [] }),
}));

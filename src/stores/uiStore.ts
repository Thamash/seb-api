import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));

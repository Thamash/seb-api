import { create } from 'zustand';

interface AuthState {
  authenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,

  checkAuth: async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      set({ authenticated: data.authenticated });
    } catch (err) {
      console.error('Auth check failed', err);
      set({ authenticated: false });
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ authenticated: false });
      window.location.href = '/'; // redirect to main page
    } catch (err) {
      console.error('Logout failed', err);
    }
  },
}));

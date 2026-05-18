import { create } from 'zustand';
import type { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, 'token'> | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const stored = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: stored ? JSON.parse(stored) : null,

  login: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role, userId: data.userId }));
    set({ token: data.token, user: { username: data.username, role: data.role, userId: data.userId } });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  isAdmin: () => get().user?.role === 'Admin',
}));

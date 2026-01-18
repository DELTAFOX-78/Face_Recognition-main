import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userRole: 'student' | 'teacher' | null;
  user: User | null;
  token: string | null;
  setAuth: (auth: Omit<AuthState, 'setAuth' | 'clearAuth'>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userRole: null,
      user: null,
      token: null,
      setAuth: (auth) => set(auth),
      clearAuth: () => set({
        isAuthenticated: false,
        userRole: null,
        user: null,
        token: null
      })
    }),
    {
      name: 'auth-storage'
    }
  )
);
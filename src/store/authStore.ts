// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import Cookies from 'js-cookie';
// import { authApi } from '@/lib/api';
// import type { User, LoginCredentials, RegisterCredentials } from '@/types';

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;

//   login: (credentials: LoginCredentials) => Promise<void>;
//   register: (credentials: RegisterCredentials) => Promise<void>;
//   logout: () => Promise<void>;
//   fetchMe: () => Promise<void>;
//   clearError: () => void;
//   setUser: (user: User) => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       login: async (credentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await authApi.login(credentials);
//           set({ user: response.user, isAuthenticated: true, isLoading: false });
//         } catch (err: unknown) {
//           const msg = err instanceof Error ? err.message : 'Login failed';
//           set({ error: msg, isLoading: false });
//           throw err;
//         }
//       },

//       register: async (credentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await authApi.register(credentials);
//           set({ user: response.user, isAuthenticated: true, isLoading: false });
//         } catch (err: unknown) {
//           const msg = err instanceof Error ? err.message : 'Registration failed';
//           set({ error: msg, isLoading: false });
//           throw err;
//         }
//       },

//       logout: async () => {
//         set({ isLoading: true });
//         try {
//           await authApi.logout();
//         } finally {
//           Cookies.remove('wn_token');
//           Cookies.remove('wn_refresh_token');
//           set({ user: null, isAuthenticated: false, isLoading: false });
//         }
//       },

//       fetchMe: async () => {
//         set({ isLoading: true });
//         try {
//           const user = await authApi.getMe();
//           set({ user, isAuthenticated: true, isLoading: false });
//         } catch {
//           set({ user: null, isAuthenticated: false, isLoading: false });
//         }
//       },

//       clearError: () => set({ error: null }),
//       setUser: (user) => set({ user }),
//     }),
//     {
//       name: 'wn-auth',
//       partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
//     }
//   )
// );
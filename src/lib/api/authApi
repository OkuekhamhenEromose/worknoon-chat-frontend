import Cookies from 'js-cookie';
import httpClient from './httpClient';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiResponse,
} from '@/types';

const COOKIE_OPTIONS = { expires: 1, secure: true, sameSite: 'strict' as const };
const REFRESH_OPTIONS = { expires: 7, secure: true, sameSite: 'strict' as const };

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>('/auth/register', credentials);
    Cookies.set('wn_token', data.token, COOKIE_OPTIONS);
    Cookies.set('wn_refresh_token', data.refreshToken, REFRESH_OPTIONS);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', credentials);
    Cookies.set('wn_token', data.token, COOKIE_OPTIONS);
    Cookies.set('wn_refresh_token', data.refreshToken, REFRESH_OPTIONS);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      Cookies.remove('wn_token');
      Cookies.remove('wn_refresh_token');
    }
  },

  getMe: async (): Promise<User> => {
    const { data } = await httpClient.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const { data } = await httpClient.post<{ token: string }>('/auth/refresh', { refreshToken });
    return data;
  },
};
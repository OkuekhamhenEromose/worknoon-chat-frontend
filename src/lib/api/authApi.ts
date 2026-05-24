import Cookies from 'js-cookie';
import httpClient from './httpClient';
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiResponse,
} from '@/types';

const COOKIE_OPTIONS = { expires: 1, secure: false, sameSite: 'strict' as const };
const REFRESH_OPTIONS = { expires: 7, secure: false, sameSite: 'strict' as const };

// ─── Match the actual backend response shape ───────────────────────────────────
// Backend returns: { success, message, data: { accessToken, refreshToken?, user } }

interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  };
}

// Normalised shape the rest of the frontend expects
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
}

function normalise(res: BackendAuthResponse): AuthResponse {
  return {
    success: res.success,
    user: res.data.user,
    token: res.data.accessToken,
    refreshToken: res.data.refreshToken ?? '',
  };
}

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await httpClient.post<BackendAuthResponse>('/auth/register', credentials);
    const normalised = normalise(data);
    Cookies.set('wn_token', normalised.token, COOKIE_OPTIONS);
    if (normalised.refreshToken) {
      Cookies.set('wn_refresh_token', normalised.refreshToken, REFRESH_OPTIONS);
    }
    return normalised;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await httpClient.post<BackendAuthResponse>('/auth/login', credentials);
    const normalised = normalise(data);
    Cookies.set('wn_token', normalised.token, COOKIE_OPTIONS);
    if (normalised.refreshToken) {
      Cookies.set('wn_refresh_token', normalised.refreshToken, REFRESH_OPTIONS);
    }
    return normalised;
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
    const { data } = await httpClient.post<BackendAuthResponse>('/auth/refresh', { refreshToken });
    return { token: data.data.accessToken };
  },
};
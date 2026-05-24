import httpClient from './httpClient';
import type { User, ApiResponse, PaginatedResponse } from '@/types';

export const usersApi = {
  getAll: async (page = 1, limit = 20, role?: string): Promise<PaginatedResponse<User>> => {
    const { data } = await httpClient.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, ...(role && { role }) },
    });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await httpClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await httpClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data.data;
  },

  updateAvatar: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const { data } = await httpClient.put<ApiResponse<User>>(
      `/users/${id}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  search: async (query: string): Promise<User[]> => {
    const { data } = await httpClient.get<ApiResponse<User[]>>('/users/search', {
      params: { q: query },
    });
    return data.data;
  },
};
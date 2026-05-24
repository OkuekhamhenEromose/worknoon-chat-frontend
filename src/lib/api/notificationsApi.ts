import httpClient from './httpClient';
import type { Notification, ApiResponse, PaginatedResponse } from '@/types';

export const notificationsApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Notification>> => {
    const { data } = await httpClient.get<PaginatedResponse<Notification>>('/notifications', {
      params: { page, limit },
    });
    return data;
  },

  markRead: async (id: string): Promise<Notification> => {
    const { data } = await httpClient.put<ApiResponse<Notification>>(
      `/notifications/${id}`
    );
    return data.data;
  },

  markAllRead: async (): Promise<void> => {
    await httpClient.put('/notifications/read-all');
  },
};
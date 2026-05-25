import httpClient from './httpClient';
import type {
  Conversation,
  ApiResponse,
  PaginatedResponse,
  ConversationType,
} from '@/types';

export const conversationsApi = {
  create: async (participantId: string, conversationType: ConversationType): Promise<Conversation> => {
    const { data } = await httpClient.post<ApiResponse<{ conversation: Conversation }>>('/conversations', {
      participantId,
      conversationType, // ← FIX: backend expects 'conversationType', not 'type'
    });
    return (data.data as any).conversation ?? data.data;
  },

  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Conversation>> => {
    const { data } = await httpClient.get<PaginatedResponse<Conversation>>('/conversations', {
      params: { page, limit },
    });
    return data;
  },

  getById: async (id: string): Promise<Conversation> => {
    const { data } = await httpClient.get<ApiResponse<{ conversation: Conversation }>>(`/conversations/${id}`);
    return (data.data as any).conversation ?? data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/conversations/${id}`);
  },
};

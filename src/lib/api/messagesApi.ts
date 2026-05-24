import httpClient from './httpClient';
import type { Message, ApiResponse, PaginatedResponse } from '@/types';

export const messagesApi = {
  send: async (
    conversationId: string,
    content: string,
    attachments?: File[]
  ): Promise<Message> => {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('content', content);
    if (attachments?.length) {
      attachments.forEach((file) => formData.append('attachments', file));
    }
    const { data } = await httpClient.post<ApiResponse<Message>>('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  getByConversation: async (
    conversationId: string,
    page = 1,
    limit = 40
  ): Promise<PaginatedResponse<Message>> => {
    const { data } = await httpClient.get<PaginatedResponse<Message>>(
      `/messages/${conversationId}`,
      { params: { page, limit } }
    );
    return data;
  },

  markRead: async (messageId: string): Promise<Message> => {
    const { data } = await httpClient.put<ApiResponse<Message>>(
      `/messages/${messageId}/read`
    );
    return data.data;
  },

  delete: async (messageId: string): Promise<void> => {
    await httpClient.delete(`/messages/${messageId}`);
  },
};
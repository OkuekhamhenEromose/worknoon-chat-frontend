import { create } from 'zustand';
import { conversationsApi, messagesApi } from '@/lib/api';
import type { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, { userId: string; userName: string }[]>;
  onlineUsers: Set<string>;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;

  // Conversations
  fetchConversations: () => Promise<void>;
  setActiveConversation: (id: string) => void;

  // Messages
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, conversationId: string, status: Message['status']) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;

  // Typing
  setTyping: (conversationId: string, userId: string, userName: string) => void;
  clearTyping: (conversationId: string, userId: string) => void;

  // Presence
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;

  // Helpers
  getActiveConversation: () => Conversation | undefined;
  getActiveMessages: () => Message[];
  getTypingInConversation: (conversationId: string) => { userId: string; userName: string }[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  isLoadingConversations: false,
  isLoadingMessages: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await conversationsApi.getAll();
      set({ conversations: res.data, isLoadingConversations: false });
    } catch {
      set({ isLoadingConversations: false });
    }
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await messagesApi.getByConversation(conversationId);
      set((state) => ({
        messages: { ...state.messages, [conversationId]: res.data },
        isLoadingMessages: false,
      }));
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    const { conversationId } = message;
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      // Avoid duplicates
      if (existing.some((m) => m._id === message._id)) return state;

      const updated = [...existing, message];
      const updatedConvs = state.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastMessage: message } : c
      );
      return {
        messages: { ...state.messages, [conversationId]: updated },
        conversations: updatedConvs,
      };
    });
  },

  updateMessageStatus: (messageId, conversationId, status) => {
    set((state) => {
      const msgs = state.messages[conversationId] ?? [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: msgs.map((m) =>
            m._id === messageId ? { ...m, status } : m
          ),
        },
      };
    });
  },

  prependMessages: (conversationId, newMessages) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...newMessages, ...existing],
        },
      };
    });
  },

  setTyping: (conversationId, userId, userName) => {
    set((state) => {
      const current = state.typingUsers[conversationId] ?? [];
      const filtered = current.filter((u) => u.userId !== userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...filtered, { userId, userName }],
        },
      };
    });
  },

  clearTyping: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsers[conversationId] ?? [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((u) => u.userId !== userId),
        },
      };
    });
  },

  setUserOnline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return { onlineUsers: next };
    });
  },

  setOnlineUsers: (userIds) => {
    set({ onlineUsers: new Set(userIds) });
  },

  getActiveConversation: () => {
    const { conversations, activeConversationId } = get();
    return conversations.find((c) => c._id === activeConversationId);
  },

  getActiveMessages: () => {
    const { messages, activeConversationId } = get();
    if (!activeConversationId) return [];
    return messages[activeConversationId] ?? [];
  },

  getTypingInConversation: (conversationId) => {
    return get().typingUsers[conversationId] ?? [];
  },
}));
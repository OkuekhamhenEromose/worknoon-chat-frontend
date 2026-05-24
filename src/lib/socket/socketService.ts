import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import type {
  Message,
  TypingPayload,
  OnlineStatusPayload,
  MessageReadPayload,
} from '@/types';

// ─── Event name constants ─────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Rooms
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',

  // Messaging
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',
  MESSAGES_READ: 'messages_read',

  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',

  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  GET_ONLINE_USERS: 'get_online_users',
  ONLINE_USERS: 'online_users',
} as const;

// ─── Listener map type ────────────────────────────────────────────────────────

type EventListeners = {
  onNewMessage?: (msg: Message) => void;
  onMessageDelivered?: (payload: { messageId: string }) => void;
  onMessageRead?: (payload: MessageReadPayload) => void;
  onUserTyping?: (payload: TypingPayload) => void;
  onUserStoppedTyping?: (payload: TypingPayload) => void;
  onUserOnline?: (payload: OnlineStatusPayload) => void;
  onUserOffline?: (payload: OnlineStatusPayload) => void;
  onOnlineUsers?: (userIds: string[]) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (err: Error) => void;
};

// ─── Socket Manager (Singleton) ───────────────────────────────────────────────

class SocketService {
  private socket: Socket | null = null;
  private listeners: EventListeners = {};
  private typingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    const token = Cookies.get('wn_token');
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.bindCoreEvents();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  private bindCoreEvents(): void {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.info('[Socket] Connected:', this.socket?.id);
      this.listeners.onConnect?.();
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      console.warn('[Socket] Disconnected:', reason);
      this.listeners.onDisconnect?.(reason);
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err: Error) => {
      console.error('[Socket] Connection error:', err.message);
      this.listeners.onError?.(err);
    });

    this.socket.on(SOCKET_EVENTS.NEW_MESSAGE, (msg: Message) => {
      this.listeners.onNewMessage?.(msg);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, (payload: { messageId: string }) => {
      this.listeners.onMessageDelivered?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_READ, (payload: MessageReadPayload) => {
      this.listeners.onMessageRead?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.USER_TYPING, (payload: TypingPayload) => {
      this.listeners.onUserTyping?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.USER_STOPPED_TYPING, (payload: TypingPayload) => {
      this.listeners.onUserStoppedTyping?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.USER_ONLINE, (payload: OnlineStatusPayload) => {
      this.listeners.onUserOnline?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.USER_OFFLINE, (payload: OnlineStatusPayload) => {
      this.listeners.onUserOffline?.(payload);
    });

    this.socket.on(SOCKET_EVENTS.ONLINE_USERS, (userIds: string[]) => {
      this.listeners.onOnlineUsers?.(userIds);
    });
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  setListeners(listeners: EventListeners): void {
    this.listeners = { ...this.listeners, ...listeners };
  }

  clearListeners(): void {
    this.listeners = {};
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  }

  sendMessage(conversationId: string, content: string, tempId: string): void {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, { conversationId, content, tempId });
  }

  markRead(conversationId: string, messageId: string): void {
    this.socket?.emit(SOCKET_EVENTS.MESSAGE_READ, { conversationId, messageId });
  }

  startTyping(conversationId: string, userId: string, userName: string): void {
    this.socket?.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId, userName });

    // Auto-stop after 3 seconds (debounce guard)
    const key = `${conversationId}:${userId}`;
    const existing = this.typingTimers.get(key);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this.stopTyping(conversationId, userId, userName);
    }, 3000);
    this.typingTimers.set(key, timer);
  }

  stopTyping(conversationId: string, userId: string, userName: string): void {
    const key = `${conversationId}:${userId}`;
    const timer = this.typingTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.typingTimers.delete(key);
    }
    this.socket?.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId, userName });
  }

  getOnlineUsers(): void {
    this.socket?.emit(SOCKET_EVENTS.GET_ONLINE_USERS);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton
const socketService = new SocketService();
export default socketService;
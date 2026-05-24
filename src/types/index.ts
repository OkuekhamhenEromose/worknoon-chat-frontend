// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'agent' | 'customer' | 'designer' | 'merchant';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
}

// ─── Conversations ───────────────────────────────────────────────────────────

export type ConversationType =
  | 'buyer_designer'
  | 'buyer_merchant'
  | 'buyer_agent'
  | 'merchant_agent'
  | 'admin_any';

export interface Conversation {
  _id: string;
  participants: User[];
  type: ConversationType;
  createdBy: string;
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Messages ────────────────────────────────────────────────────────────────

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Attachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  receiver: string;
  content: string;
  attachments?: Attachment[];
  status: MessageStatus;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'message' | 'mention' | 'system' | 'file';
export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  _id: string;
  recipient: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Socket Events ───────────────────────────────────────────────────────────

export interface SocketMessage {
  conversationId: string;
  message: Message;
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface OnlineStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface MessageReadPayload {
  messageId: string;
  conversationId: string;
  readBy: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  onlineUsers: number;
  avgResponseTime: string;
  satisfactionRating: number;
  messagesThisWeek: number[];
}

export interface ActivityItem {
  _id: string;
  type: 'new_message' | 'new_user' | 'file_upload' | 'escalation';
  description: string;
  actor: User;
  createdAt: string;
}
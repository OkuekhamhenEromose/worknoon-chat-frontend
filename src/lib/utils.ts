import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import type { UserRole } from '@/types';

// ─── Tailwind class merger ─────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date / time ───────────────────────────────────────────────────────────

export function formatMessageTime(dateStr: string): string {
  return format(new Date(dateStr), 'h:mm a');
}

export function formatConversationTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

export function isSameDay(a: string, b: string): boolean {
  return format(new Date(a), 'yyyy-MM-dd') === format(new Date(b), 'yyyy-MM-dd');
}

// ─── User helpers ──────────────────────────────────────────────────────────

export function getInitials(name: string | undefined | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// ─── Role styling ──────────────────────────────────────────────────────────

export const ROLE_STYLES: Record<UserRole, { bg: string; color: string; label: string }> = {
  admin:    { bg: '#2f2a18', color: '#f59e0b', label: 'Admin' },
  agent:    { bg: '#1a2f3a', color: '#38bdf8', label: 'Agent' },
  customer: { bg: '#201a2f', color: '#a78bfa', label: 'Customer' },
  designer: { bg: '#2a1f30', color: '#f472b6', label: 'Designer' },
  merchant: { bg: '#1f2a1a', color: '#22d3a4', label: 'Merchant' },
};

export function getRoleStyle(role: UserRole) {
  return ROLE_STYLES[role] ?? ROLE_STYLES.customer;
}

// ─── File helpers ──────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  return '📎';
}
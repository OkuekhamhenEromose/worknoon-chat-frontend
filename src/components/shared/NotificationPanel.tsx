'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, X, MessageSquare, UserPlus, Settings, FileText } from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Notification } from '@/types';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<Notification['type'], React.ReactNode> = {
  message: <MessageSquare size={15} />,
  mention: <Bell size={15} />,
  system: <Settings size={15} />,
  file: <FileText size={15} />,
};

const TYPE_COLORS: Record<Notification['type'], string> = {
  message: 'var(--accent-2)',
  mention: 'var(--amber)',
  system: 'var(--accent-3)',
  file: 'var(--green)',
};

const TYPE_BG: Record<Notification['type'], string> = {
  message: '#201a2f',
  mention: '#2a1f00',
  system: '#0e1a2a',
  file: '#0e2a23',
};

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.getAll()
      .then((res) => setNotifications(res.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, status: 'read' } : n)
      );
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' as const })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all read');
    }
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <div style={{ overflowY: 'auto', height: '100%', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22 }}>
            Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 10, background: 'var(--accent)', color: '#fff',
                  fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                }}
              >
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            Stay up to date with your conversations
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
              background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: 8, color: 'var(--text-1)', fontSize: 13, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div
        style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, marginTop: 20, overflow: 'hidden' }}
        role="list"
        aria-label="Notifications"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <Skeleton style={{ width: 36, height: 36, borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ height: 13, width: '70%', marginBottom: 8 }} />
                <Skeleton style={{ height: 11, width: '30%' }} />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
            <Bell size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = notif.status === 'unread';
            return (
              <div
                key={notif._id}
                role="listitem"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderBottom: '1px solid var(--border)',
                  background: isUnread ? 'rgba(108,99,255,0.04)' : 'transparent',
                  transition: 'background .15s',
                }}
              >
                {/* Unread dot */}
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isUnread ? 'var(--accent)' : 'transparent', marginTop: 6, flexShrink: 0 }} />

                {/* Icon */}
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: TYPE_BG[notif.type], color: TYPE_COLORS[notif.type],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  {TYPE_ICONS[notif.type]}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: isUnread ? 'var(--text-1)' : 'var(--text-2)', fontWeight: isUnread ? 500 : 400 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, display: 'block' }}>
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(notif._id)}
                      title="Mark as read"
                      className="btn-icon"
                      aria-label="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(notif._id)}
                    title="Dismiss"
                    className="btn-icon"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

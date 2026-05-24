'use client';

import { FileText, Image as ImageIcon, Mail, Clock, MessageSquare, Star } from 'lucide-react';
import { useChatStore, useAuthStore } from '@/store';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import { formatRelativeTime } from '@/lib/utils';

export function ConversationInfoPanel() {
  const { user } = useAuthStore();
  const { getActiveConversation, onlineUsers } = useChatStore();
  const conversation = getActiveConversation();

  if (!conversation) return null;

  const other = conversation.participants.find((p) => p._id !== user?._id);
  if (!other) return null;

  const isOnline = onlineUsers.has(other._id);

  const infoRows = [
    { icon: <Mail size={13} />, label: 'Email', value: other.email },
    {
      icon: <Clock size={13} />,
      label: 'Member since',
      value: formatRelativeTime(other.createdAt),
    },
    { icon: <MessageSquare size={13} />, label: 'Role', value: other.role },
    { icon: <Star size={13} />, label: 'Status', value: isOnline ? 'Online' : 'Offline' },
  ];

  return (
    <aside
      style={{ width: 260, background: 'var(--bg-1)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
      aria-label="Conversation information"
    >
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14 }}>Info</h3>
      </div>

      {/* User card */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <UserAvatar user={other} size="lg" isOnline={isOnline} />
        </div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{other.name}</div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
          <RoleBadge role={other.role} />
        </div>
        <div style={{ marginTop: 8 }}>
          <OnlineStatus isOnline={isOnline} lastSeen={other.lastSeen} />
        </div>
      </div>

      {/* Info rows */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {infoRows.map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-3)', flexShrink: 0 }}>
              {icon} {label}
            </span>
            <span style={{ color: 'var(--text-1)', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Shared files (placeholder) */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-3)', marginBottom: 10 }}>
          Shared Files
        </div>
        {[
          { name: 'Brief_v2.pdf', size: '2.1 MB', Icon: FileText, color: 'var(--accent-2)' },
          { name: 'mockup_final.png', size: '4.5 MB', Icon: ImageIcon, color: 'var(--green)' },
        ].map(({ name, size, Icon, color }) => (
          <div
            key={name}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              background: 'var(--bg-2)', borderRadius: 8, marginBottom: 6, cursor: 'pointer', fontSize: 12,
            }}
          >
            <Icon size={14} style={{ color, flexShrink: 0 }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{size}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

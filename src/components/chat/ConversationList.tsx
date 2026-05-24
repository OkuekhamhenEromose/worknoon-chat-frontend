'use client';

import { useState, useMemo } from 'react';
import { Search, Edit } from 'lucide-react';
import { useChatStore } from '@/store';
import { useDebounce } from '@/hooks';
import { formatConversationTime } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { ConversationSkeleton } from '@/components/ui/Skeleton';
import type { Conversation, UserRole } from '@/types';
import { useAuthStore } from '@/store';

type FilterRole = 'all' | UserRole;

const FILTERS: { label: string; value: FilterRole }[] = [
  { label: 'All', value: 'all' },
  { label: 'Agents', value: 'agent' },
  { label: 'Merchants', value: 'merchant' },
  { label: 'Designers', value: 'designer' },
];

interface ConversationListProps {
  onSelect?: (conv: Conversation) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const { user } = useAuthStore();
  const { conversations, activeConversationId, setActiveConversation, fetchMessages, isLoadingConversations } = useChatStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterRole>('all');
  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    return conversations.filter((conv) => {
      const other = conv.participants.find((p) => p._id !== user?._id);
      if (!other) return false;
      const matchesSearch = debouncedSearch
        ? other.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesRole = filter === 'all' ? true : other.role === filter;
      return matchesSearch && matchesRole;
    });
  }, [conversations, debouncedSearch, filter, user]);

  const handleSelect = (conv: Conversation) => {
    setActiveConversation(conv._id);
    fetchMessages(conv._id);
    onSelect?.(conv);
  };

  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{ width: 300, background: 'var(--bg-1)', borderRight: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15 }}>Messages</h2>
          <button
            title="New conversation"
            style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', color: 'var(--text-2)', cursor: 'pointer' }}
          >
            <Edit size={16} />
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 10px',
          }}
        >
          <Search size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, flex: 1, minWidth: 0 }}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: '1px solid',
              borderColor: filter === f.value ? 'var(--accent)' : 'var(--border)',
              background: filter === f.value ? 'var(--accent)' : 'none',
              color: filter === f.value ? '#fff' : 'var(--text-2)',
              transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }} role="list" aria-label="Conversations">
        {isLoadingConversations ? (
          Array.from({ length: 5 }).map((_, i) => <ConversationSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, padding: '40px 16px' }}>
            No conversations found
          </div>
        ) : (
          filtered.map((conv) => {
            const other = conv.participants.find((p) => p._id !== user?._id);
            if (!other) return null;
            const isActive = conv._id === activeConversationId;
            return (
              <div
                key={conv._id}
                role="listitem"
                onClick={() => handleSelect(conv)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 10px', borderRadius: 12, cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-2)' : 'transparent',
                  background: isActive ? 'var(--bg-3)' : 'transparent',
                  transition: 'all .15s', marginBottom: 2,
                }}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(conv)}
                aria-selected={isActive}
              >
                <UserAvatar user={other} size="md" />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {other.name}
                    </span>
                    <RoleBadge role={other.role} size="xs" />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                    {conv.lastMessage?.content ?? 'No messages yet'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  {conv.lastMessage && (
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {formatConversationTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                  {(conv.unreadCount ?? 0) > 0 && (
                    <span
                      aria-label={`${conv.unreadCount} unread`}
                      style={{
                        background: 'var(--accent)', color: '#fff',
                        fontSize: 10, fontWeight: 700, borderRadius: 10,
                        padding: '2px 6px', minWidth: 18, textAlign: 'center',
                      }}
                    >
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

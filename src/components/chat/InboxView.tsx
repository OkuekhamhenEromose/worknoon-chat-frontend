'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { ConversationInfoPanel } from './ConversationInfoPanel';

// Sidebar icon column (re-used layout icons)
const SIDEBAR_ICONS = [
  { emoji: '💬', label: 'Inbox', active: true },
  { emoji: '👥', label: 'Contacts' },
  { emoji: '📎', label: 'Files' },
  { emoji: '🔍', label: 'Search' },
];

export function InboxView() {
  const { fetchConversations } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Mini icon sidebar */}
      <nav
        style={{ width: 56, background: 'var(--bg-1)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4, flexShrink: 0 }}
        aria-label="Chat sections"
      >
        {SIDEBAR_ICONS.map(({ emoji, label, active }) => (
          <button
            key={label}
            title={label}
            aria-label={label}
            style={{
              width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              background: active ? 'var(--bg-4)' : 'none',
              transition: 'background .15s',
            }}
          >
            {emoji}
          </button>
        ))}
      </nav>

      {/* Conversation list */}
      <ConversationList />

      {/* Chat window (fills remaining width) */}
      <ChatWindow />

      {/* Info panel */}
      <ConversationInfoPanel />
    </div>
  );
}

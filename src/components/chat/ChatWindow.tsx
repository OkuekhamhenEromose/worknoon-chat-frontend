'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Phone, Video, Search, MoreVertical, Smile, Image as ImageIcon, AtSign, Send } from 'lucide-react';
import { useChatStore, useAuthStore } from '@/store';
import { useSocket, useScrollToBottom } from '@/hooks';
import { messagesApi } from '@/lib/api';
import { formatDateSeparator, isSameDay } from '@/lib/utils';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { FileUploader } from './FileUploader';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { MessageSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export function ChatWindow() {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    getActiveConversation,
    getActiveMessages,
    getTypingInConversation,
    isLoadingMessages,
    onlineUsers,
  } = useChatStore();

  const { joinConversation, leaveConversation, sendMessage, startTyping, stopTyping, markRead } = useSocket();

  const [text, setText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  const conversation = getActiveConversation();
  const messages = getActiveMessages();
  const typingUsers = activeConversationId ? getTypingInConversation(activeConversationId) : [];
  const otherParticipant = conversation?.participants.find((p) => p._id !== user?._id);
  const isOtherOnline = otherParticipant ? onlineUsers.has(otherParticipant._id) : false;

  const messagesEndRef = useScrollToBottom<HTMLDivElement>(messages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Join/leave socket room on conversation change
  useEffect(() => {
    if (!activeConversationId) return;
    joinConversation(activeConversationId);
    return () => leaveConversation(activeConversationId);
  }, [activeConversationId, joinConversation, leaveConversation]);

  // Mark messages as read
  useEffect(() => {
    if (!activeConversationId || !user) return;
    const unread = messages.filter((m) => m.sender._id !== user._id && m.status !== 'read');
    unread.forEach((m) => markRead(activeConversationId, m._id));
  }, [messages, activeConversationId, user, markRead]);

  // Auto-resize textarea
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);

      // Auto-resize
      const ta = textareaRef.current;
      if (ta) {
        ta.style.height = 'auto';
        ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
      }

      // Typing indicator
      if (!activeConversationId || !user) return;
      startTyping(activeConversationId, user._id, user.name);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        stopTyping(activeConversationId, user._id, user.name);
      }, 2000);
    },
    [activeConversationId, user, startTyping, stopTyping]
  );

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed && pendingFiles.length === 0) return;
    if (!activeConversationId || !user) return;

    setIsSending(true);
    try {
      // If files, use REST (multipart); otherwise emit via socket for speed
      if (pendingFiles.length > 0) {
        await messagesApi.send(activeConversationId, trimmed, pendingFiles);
        setPendingFiles([]);
      } else {
        const tempId = `temp_${Date.now()}`;
        sendMessage(activeConversationId, trimmed, tempId);
      }
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      stopTyping(activeConversationId, user._id, user.name);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [text, pendingFiles, activeConversationId, user, sendMessage, stopTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation || !otherParticipant) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
          💬
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-0)', minWidth: 0 }}>
      {/* Header */}
      <div
        style={{
          height: 60, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}
      >
        <UserAvatar user={otherParticipant} size="md" isOnline={isOtherOnline} />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{otherParticipant.name}</span>
            <RoleBadge role={otherParticipant.role} size="xs" />
          </div>
          <OnlineStatus isOnline={isOtherOnline} lastSeen={otherParticipant.lastSeen} />
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          {[
            { icon: <Phone size={16} />, label: 'Voice call' },
            { icon: <Video size={16} />, label: 'Video call' },
            { icon: <Search size={16} />, label: 'Search in chat' },
            { icon: <MoreVertical size={16} />, label: 'More options' },
          ].map(({ icon, label }) => (
            <button key={label} title={label} className="btn-icon">{icon}</button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px' }}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {isLoadingMessages ? (
          Array.from({ length: 6 }).map((_, i) => <MessageSkeleton key={i} mine={i % 2 === 0} />)
        ) : (
          messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const showDateSep = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
            const prevSameSender = prevMsg && prevMsg.sender._id === msg.sender._id && !showDateSep;
            const isMine = msg.sender._id === user?._id;

            return (
              <div key={msg._id}>
                {showDateSep && (
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', margin: '16px 0', position: 'relative' }}>
                    <span style={{ background: 'var(--bg-0)', padding: '0 10px', position: 'relative', zIndex: 1 }}>
                      {formatDateSeparator(msg.createdAt)}
                    </span>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)', zIndex: 0 }} />
                  </div>
                )}
                <MessageBubble
                  message={msg}
                  isMine={isMine}
                  showAvatar={!isMine}
                  prevSameSender={!!prevSameSender}
                />
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator names={typingUsers.map((u) => u.userName)} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '12px 20px 16px', background: 'var(--bg-1)', borderTop: '1px solid var(--border)', position: 'relative', flexShrink: 0 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 8 }}>
          <FileUploader onFilesChange={setPendingFiles} />
          {[
            { icon: <Smile size={17} />, label: 'Emoji' },
            { icon: <ImageIcon size={17} />, label: 'Image' },
            { icon: <AtSign size={17} />, label: 'Mention' },
          ].map(({ icon, label }) => (
            <button key={label} title={label} className="btn-icon">{icon}</button>
          ))}
        </div>

        {/* Input row */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            background: 'var(--bg-2)', border: '1px solid var(--border-2)',
            borderRadius: 12, padding: '10px 12px', transition: 'border-color .15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-2)')}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a message…"
            rows={1}
            disabled={isSending}
            aria-label="Message input"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              resize: 'none', lineHeight: 1.5, minHeight: 20, maxHeight: 120,
            }}
          />
          <button
            onClick={handleSend}
            disabled={isSending || (!text.trim() && pendingFiles.length === 0)}
            title="Send message"
            aria-label="Send message"
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s', opacity: isSending ? 0.6 : 1,
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, textAlign: 'center' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

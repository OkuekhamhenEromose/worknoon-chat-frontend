'use client';

import { Check, CheckCheck, Clock, Paperclip } from 'lucide-react';
import { formatMessageTime, formatFileSize } from '@/lib/utils';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
  prevSameSender?: boolean;
}

function StatusIcon({ status }: { status: Message['status'] }) {
  if (status === 'sent') return <Clock size={11} style={{ color: 'rgba(255,255,255,0.5)' }} />;
  if (status === 'delivered') return <Check size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />;
  return <CheckCheck size={11} style={{ color: 'var(--accent-3)' }} />;
}

export function MessageBubble({ message, isMine, showAvatar = true, prevSameSender = false }: MessageBubbleProps) {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div
      className={`flex gap-2 items-end mb-1 animate-fade-in ${isMine ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar placeholder — keeps spacing consistent */}
      {!isMine && (
        <div style={{ width: 28, flexShrink: 0 }}>
          {showAvatar && !prevSameSender && (
            <div
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--bg-4)', color: 'var(--text-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
              }}
            >
              {message.sender.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div style={{ maxWidth: '65%' }}>
        {/* Sender name (group messages) */}
        {!isMine && !prevSameSender && (
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 3, paddingLeft: 4 }}>
            {message.sender.name}
          </p>
        )}

        {/* Bubble */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 16,
            borderBottomLeftRadius: isMine ? 16 : 4,
            borderBottomRightRadius: isMine ? 4 : 16,
            background: isMine ? 'var(--accent)' : 'var(--bg-3)',
            color: isMine ? '#fff' : 'var(--text-1)',
            fontSize: 13,
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}
        >
          {message.content}

          {/* Attachments */}
          {hasAttachments && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {message.attachments!.map((att, i) => (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 8,
                    background: isMine ? 'rgba(255,255,255,0.15)' : 'var(--bg-4)',
                    color: isMine ? '#fff' : 'var(--text-1)',
                    textDecoration: 'none', fontSize: 12,
                  }}
                >
                  <Paperclip size={13} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.name}
                  </span>
                  <span style={{ opacity: 0.6, flexShrink: 0 }}>{formatFileSize(att.size)}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Time + status */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, paddingInline: 4,
            justifyContent: isMine ? 'flex-end' : 'flex-start',
          }}
        >
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}

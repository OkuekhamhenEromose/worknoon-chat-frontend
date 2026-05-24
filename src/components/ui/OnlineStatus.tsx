interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: string;
  showText?: boolean;
}

export function OnlineStatus({ isOnline, lastSeen, showText = true }: OnlineStatusProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          background: isOnline ? 'var(--green)' : 'var(--text-3)',
          boxShadow: isOnline ? '0 0 6px var(--green)' : 'none',
          transition: 'all 0.3s',
        }}
      />
      {showText && (
        <span style={{ color: isOnline ? 'var(--green)' : 'var(--text-3)' }}>
          {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
        </span>
      )}
    </span>
  );
}

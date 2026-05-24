interface TypingIndicatorProps {
  names: string[];
}

export function TypingIndicator({ names }: TypingIndicatorProps) {
  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : 'Several people are typing';

  return (
    <div
      className="flex items-center gap-2 px-1 py-2 animate-fade-in"
      aria-live="polite"
      aria-label={label}
    >
      {/* Animated dots bubble */}
      <div
        style={{
          display: 'flex', gap: 4, background: 'var(--bg-3)',
          padding: '9px 13px', borderRadius: 14, borderBottomLeftRadius: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--text-3)',
              display: 'inline-block',
              animation: `bounceDot 0.9s infinite ${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}…</span>
    </div>
  );
}

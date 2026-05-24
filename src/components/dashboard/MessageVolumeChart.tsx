'use client';

interface MessageVolumeChartProps {
  data: number[];
  labels?: string[];
}

const DEFAULT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MessageVolumeChart({ data, labels = DEFAULT_LABELS }: MessageVolumeChartProps) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const chartH = 80;

  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: chartH }}
        role="img"
        aria-label="Message volume bar chart"
      >
        {data.map((val, i) => {
          const barH = Math.max(Math.round((val / max) * chartH), 4);
          const isMax = val === max;
          return (
            <div
              key={i}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}
            >
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{val}</span>
              <div
                title={`${labels[i]}: ${val} messages`}
                style={{
                  width: '100%', height: barH,
                  borderRadius: '4px 4px 0 0',
                  background: isMax ? 'var(--accent)' : 'rgba(108,99,255,0.45)',
                  transition: 'background .2s, height .4s ease',
                  cursor: 'default',
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {labels.map((l) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-3)' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

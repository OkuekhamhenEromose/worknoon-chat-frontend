import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface AnalyticsCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  valueColor?: string;
  label: string;
  delta?: string;
  deltaUp?: boolean;
}

export function AnalyticsCard({
  icon, iconBg, iconColor, value, valueColor, label, delta, deltaUp,
}: AnalyticsCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '18px 20px',
      }}
    >
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, marginBottom: 14,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 26, color: valueColor ?? 'var(--text-1)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, fontWeight: 500, color: deltaUp ? 'var(--green)' : 'var(--red)' }}>
          {deltaUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {delta}
        </div>
      )}
    </div>
  );
}

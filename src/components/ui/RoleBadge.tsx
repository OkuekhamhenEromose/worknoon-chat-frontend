import { getRoleStyle } from '@/lib/utils';
import type { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'xs' | 'sm';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const style = getRoleStyle(role);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: style.bg,
        color: style.color,
        fontSize: size === 'xs' ? 10 : 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        padding: size === 'xs' ? '2px 5px' : '3px 7px',
        borderRadius: 5,
      }}
    >
      {style.label}
    </span>
  );
}

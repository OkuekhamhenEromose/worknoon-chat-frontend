import { cn, getInitials, getRoleStyle } from '@/lib/utils';
import type { User } from '@/types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  isOnline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 32, font: 11, radius: 8, dot: 8, dotBorder: 2 },
  md: { box: 40, font: 13, radius: 10, dot: 9, dotBorder: 2 },
  lg: { box: 64, font: 20, radius: 16, dot: 11, dotBorder: 2 },
};

export function UserAvatar({ user, size = 'md', showOnline = true, isOnline, className }: UserAvatarProps) {
  const style = getRoleStyle(user.role);
  const s = SIZE_MAP[size];
  const online = isOnline ?? user.isOnline;

  return (
    <div className={cn('relative flex-shrink-0', className)} style={{ width: s.box, height: s.box }}>
      {user.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.profileImage}
          alt={user.name}
          style={{ width: s.box, height: s.box, borderRadius: s.radius, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: s.box, height: s.box, borderRadius: s.radius,
            background: style.bg, color: style.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: s.font, fontWeight: 700, letterSpacing: 0.3,
          }}
        >
          {getInitials(user.name)}
        </div>
      )}
      {showOnline && (
        <span
          aria-label={online ? 'Online' : 'Offline'}
          style={{
            position: 'absolute', bottom: -1, right: -1,
            width: s.dot, height: s.dot, borderRadius: '50%',
            background: online ? 'var(--green)' : 'var(--text-3)',
            border: `${s.dotBorder}px solid var(--bg-1)`,
            transition: 'background 0.3s',
          }}
        />
      )}
    </div>
  );
}

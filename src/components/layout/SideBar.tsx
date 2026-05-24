'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, Users, Paperclip, Search,
  Settings, LayoutDashboard, Bell, User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store';

const NAV_ITEMS = [
  { href: '/inbox', icon: MessageSquare, label: 'Inbox' },
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const BOTTOM_ITEMS = [
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/files', icon: Paperclip, label: 'Files' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { conversations } = useChatStore();

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount ?? 0), 0);

  return (
    <nav
      className="flex flex-col items-center py-4 gap-1 flex-shrink-0"
      style={{ width: 72, background: 'var(--bg-1)', borderRight: '1px solid var(--border)' }}
      aria-label="Main navigation"
    >
      {/* Logo mark */}
      <Link href="/inbox" className="flex items-center justify-center mb-3" aria-label="Worknoon home">
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(108,99,255,0.15)',
            border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
        </div>
      </Link>

      <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '4px 0 8px' }} />

      {/* Primary nav */}
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              'relative flex items-center justify-center transition-all duration-150',
              'rounded-xl',
              isActive
                ? 'text-accent-2'
                : 'hover:text-text-1'
            )}
            style={{
              width: 44, height: 44,
              color: isActive ? 'var(--accent-2)' : 'var(--text-3)',
              background: isActive ? 'var(--bg-4)' : 'transparent',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} />
            {label === 'Inbox' && totalUnread > 0 && (
              <span
                aria-label={`${totalUnread} unread messages`}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--red)', border: '2px solid var(--bg-1)',
                }}
              />
            )}
          </Link>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom nav */}
      {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          title={label}
          style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', transition: 'all .15s' }}
          className="hover:text-text-1 hover:bg-bg-3"
        >
          <Icon size={18} />
        </Link>
      ))}
    </nav>
  );
}

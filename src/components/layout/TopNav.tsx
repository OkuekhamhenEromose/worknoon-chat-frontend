'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store';
import { getInitials, getRoleStyle } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PAGE_TITLES: Record<string, string> = {
  '/inbox': 'Inbox',
  '/admin': 'Dashboard',
  '/profile': 'Profile',
  '/notifications': 'Notifications',
};

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? 'Worknoon';
  const roleStyle = user ? getRoleStyle(user.role) : null;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.replace('/login');
  };

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{ height: 56, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Page title */}
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text-1)' }}>
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
          style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', color: 'var(--text-2)', cursor: 'pointer' }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', color: 'var(--text-2)', cursor: 'pointer' }}
        >
          <LogOut size={17} />
        </button>

        {/* Avatar */}
        {user && (
          <Link href="/profile" title="Profile">
            <div
              style={{
                width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: roleStyle?.bg, color: roleStyle?.color, position: 'relative',
              }}
            >
              {getInitials(user.name)}
              {user.isOnline && (
                <span
                  style={{
                    position: 'absolute', bottom: -1, right: -1,
                    width: 9, height: 9, borderRadius: '50%',
                    background: 'var(--green)', border: '2px solid var(--bg-1)',
                  }}
                />
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

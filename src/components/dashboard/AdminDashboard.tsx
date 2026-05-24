'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, Clock, Star, UserPlus, FileUp, AlertCircle } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { useChatStore } from '@/store';
import { AnalyticsCard } from './AnalyticsCard';
import { UserTable } from './UserTable';
import { MessageVolumeChart } from './MessageVolumeChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatRelativeTime } from '@/lib/utils';
import type { User } from '@/types';
import toast from 'react-hot-toast';

const STAT_CARDS = [
  { icon: <MessageSquare size={18} />, iconBg: '#1a2f3a', iconColor: 'var(--accent-3)', value: '1,284', valueColor: 'var(--accent-3)', label: 'Active conversations', delta: '+12% this week', deltaUp: true },
  { icon: <Users size={18} />, iconBg: '#0e2a23', iconColor: 'var(--green)', value: '847', valueColor: 'var(--green)', label: 'Online users', delta: '+5% today', deltaUp: true },
  { icon: <Clock size={18} />, iconBg: '#2a1f00', iconColor: 'var(--amber)', value: '1m 42s', valueColor: 'var(--amber)', label: 'Avg response time', delta: '+8s vs yesterday', deltaUp: false },
  { icon: <Star size={18} />, iconBg: '#1f0e2a', iconColor: 'var(--pink)', value: '4.71', valueColor: 'var(--pink)', label: 'Avg satisfaction', delta: '+0.3 this month', deltaUp: true },
];

const ACTIVITY = [
  { Icon: MessageSquare, bg: '#1a2f3a', color: 'var(--accent-3)', title: 'New conversation', desc: 'Jordan opened support ticket #5821', time: '2m ago' },
  { Icon: UserPlus, bg: '#0e2a23', color: 'var(--green)', title: 'User joined', desc: 'Priya Kapoor registered as Merchant', time: '14m ago' },
  { Icon: FileUp, bg: '#2a1f30', color: 'var(--pink)', title: 'File uploaded', desc: 'Luca Ferri shared mockup_v3.fig', time: '1h ago' },
  { Icon: AlertCircle, bg: '#2a1f00', color: 'var(--amber)', title: 'Escalation', desc: 'Order #4421 flagged for review', time: '2h ago' },
];

const VOLUME = [65, 80, 55, 90, 70, 40, 88];

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useChatStore();

  useEffect(() => {
    usersApi.getAll(1, 10)
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ overflowY: 'auto', height: '100%', padding: 28 }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
        Admin Dashboard
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
        Real-time overview of the Worknoon platform
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {STAT_CARDS.map((card) => (
          <AnalyticsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Volume chart */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
            Message volume (last 7 days)
          </h2>
          <MessageVolumeChart data={VOLUME} />
        </div>

        {/* Activity feed */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
            Recent activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ACTIVITY.map(({ Icon, bg, color, title, desc, time }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>{desc}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User table */}
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14 }}>Team members</h2>
          <button
            style={{
              padding: '7px 14px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <UserPlus size={14} /> Add member
          </button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px' }}>
                <Skeleton style={{ width: 32, height: 32, borderRadius: 8 }} />
                <Skeleton style={{ height: 13, width: '30%' }} />
                <Skeleton style={{ height: 13, width: '15%', marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        ) : (
          <UserTable
            users={users}
            onlineUsers={onlineUsers}
            onMessage={(u) => toast.success(`Opening chat with ${u.name}`)}
            onEdit={(u) => toast(`Edit ${u.name} — coming soon`)}
            onDelete={(u) => toast.error(`Delete ${u.name} — confirmation required`)}
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { MessageSquare, Edit, Trash2 } from 'lucide-react';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import type { User } from '@/types';

interface UserTableProps {
  users: User[];
  onlineUsers: Set<string>;
  onMessage?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserTable({ users, onlineUsers, onMessage, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
        No users found
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Team members">
        <thead>
          <tr>
            {['User', 'Role', 'Status', 'Email', 'Joined', 'Actions'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left', padding: '8px 12px',
                  fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                  textTransform: 'uppercase', color: 'var(--text-3)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isOnline = onlineUsers.has(u._id);
            return (
              <tr
                key={u._id}
                style={{ transition: 'background .15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <UserAvatar user={u} size="sm" isOnline={isOnline} />
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <RoleBadge role={u.role} size="xs" />
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <OnlineStatus isOnline={isOnline} />
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-2)' }}>
                  {u.email}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => onMessage?.(u)} title="Message" className="btn-icon"><MessageSquare size={15} /></button>
                    <button onClick={() => onEdit?.(u)} title="Edit" className="btn-icon"><Edit size={15} /></button>
                    <button onClick={() => onDelete?.(u)} title="Delete" className="btn-icon" style={{ color: 'var(--red)' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import type { User } from '@/types';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';

export function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    usersApi
      .getAll(1, 50)
      .then((res) => setUsers(res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const query = search.toLowerCase();

    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: 900,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 360,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-2)',
            color: 'var(--text-1)',
            fontSize: 14,
          }}
        />
      </div>

      {loading ? (
        <p
          style={{
            color: 'var(--text-3)',
          }}
        >
          Loading...
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {filtered.map((user) => (
            <div
              key={user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Fixed */}
              <UserAvatar user={user} size="md" />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--text-1)',
                  }}
                >
                  {user.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </div>
              </div>

              <RoleBadge role={user.role} />

              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: user.isOnline
                    ? 'var(--green)'
                    : 'var(--border)',
                  flexShrink: 0,
                }}
                title={user.isOnline ? 'Online' : 'Offline'}
              />
            </div>
          ))}

          {filtered.length === 0 && (
            <p
              style={{
                color: 'var(--text-3)',
                textAlign: 'center',
                padding: 40,
              }}
            >
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
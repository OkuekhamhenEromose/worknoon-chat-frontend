// components/shared/SearchView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { usersApi } from '@/lib/api';
import type { User } from '@/types';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useDebounce } from '@/hooks';

export function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const debounced = useDebounce(query, 400);

  // Search whenever debounced query changes
  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    usersApi
      .search(debounced)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [debounced]);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <div
        style={{
          position: 'relative',
          marginBottom: 20,
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-3)',
            pointerEvents: 'none',
          }}
        />

        <input
          autoFocus
          type="search"
          placeholder="Search users, conversations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg-2)',
            color: 'var(--text-1)',
            fontSize: 14,
          }}
        />
      </div>

      {loading && (
        <p
          style={{
            color: 'var(--text-3)',
            fontSize: 14,
          }}
        >
          Searching...
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {results.map((user) => (
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
            {/* Fixed size prop */}
            <UserAvatar user={user} size="md" />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-1)',
                }}
              >
                {user.name}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-3)',
                }}
              >
                {user.email}
              </div>
            </div>

            <RoleBadge role={user.role} />
          </div>
        ))}

        {!loading && debounced && results.length === 0 && (
          <p
            style={{
              color: 'var(--text-3)',
              textAlign: 'center',
              padding: 40,
              fontSize: 14,
            }}
          >
            No results for "{debounced}"
          </p>
        )}
      </div>
    </div>
  );
}
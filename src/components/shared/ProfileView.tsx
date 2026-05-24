'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';
import { usersApi } from '@/lib/api';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { OnlineStatus } from '@/components/ui/OnlineStatus';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const NOTIF_PREFS = [
  { key: 'email', label: 'Email notifications', enabled: true },
  { key: 'push', label: 'Push notifications', enabled: true },
  { key: 'previews', label: 'Message previews', enabled: true },
  { key: 'sound', label: 'Sound alerts', enabled: false },
];

const STATS = [
  { label: 'Total conversations', value: '342' },
  { label: 'Messages sent', value: '4,217' },
  { label: 'Avg response time', value: '1m 12s' },
  { label: 'Satisfaction rating', value: '4.9 ⭐' },
  { label: 'Member since', value: 'Jan 2024' },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

export function ProfileView() {
  const { user, setUser } = useAuthStore();
  const [notifPrefs, setNotifPrefs] = useState(NOTIF_PREFS);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onSaveProfile = async (values: ProfileValues) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const updated = await usersApi.update(user._id, values);
      setUser(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onSavePassword = async (_values: PasswordValues) => {
    setIsSavingPassword(true);
    try {
      // Password update endpoint handled by backend
      await new Promise((r) => setTimeout(r, 800)); // simulate
      toast.success('Password changed!');
      passwordForm.reset();
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const toggleNotif = (key: string) => {
    setNotifPrefs((prev) => prev.map((n) => n.key === key ? { ...n, enabled: !n.enabled } : n));
  };

  if (!user) return null;

  return (
    <div style={{ overflowY: 'auto', height: '100%', padding: 28 }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Profile</h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>Manage your account settings</p>

      {/* Profile header */}
      <div
        style={{
          background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 24,
          padding: 28, display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20,
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <UserAvatar user={user} size="lg" showOnline={false} />
          <button
            title="Change avatar"
            style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              border: '2px solid var(--bg-1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Camera size={12} />
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{user.email}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RoleBadge role={user.role} />
            <OnlineStatus isOnline={user.isOnline} />
          </div>
        </div>

        <button
          style={{
            padding: '8px 18px', background: 'var(--bg-2)', border: '1px solid var(--border-2)',
            borderRadius: 8, color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <Edit size={14} /> Edit
        </button>
      </div>

      {/* 2-col cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Personal info */}
        <Card title="Personal info">
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Full name</label>
                <input {...profileForm.register('name')} className="input-base" />
                {profileForm.formState.errors.name && (
                  <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Email</label>
                <input {...profileForm.register('email')} type="email" className="input-base" />
                {profileForm.formState.errors.email && (
                  <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{profileForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Role</label>
                <input value={user.role} disabled className="input-base" style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <button
                type="submit"
                disabled={isSavingProfile}
                style={{
                  padding: '10px', background: 'var(--accent)', color: '#fff',
                  border: 'none', borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Save size={14} /> {isSavingProfile ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Card>

        {/* Security */}
        <Card title="Security">
          <form onSubmit={passwordForm.handleSubmit(onSavePassword)} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { name: 'currentPassword' as const, label: 'Current password' },
                { name: 'newPassword' as const, label: 'New password' },
                { name: 'confirmPassword' as const, label: 'Confirm password' },
              ]).map(({ name, label }) => (
                <div key={name}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input {...passwordForm.register(name)} type="password" className="input-base" placeholder="••••••••" />
                  {passwordForm.formState.errors[name] && (
                    <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{passwordForm.formState.errors[name]?.message}</p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={isSavingPassword}
                style={{
                  padding: '10px', background: 'var(--bg-3)', color: 'var(--text-1)',
                  border: '1px solid var(--border-2)', borderRadius: 8,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {isSavingPassword ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </Card>

        {/* Notification preferences */}
        <Card title="Notification preferences">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {notifPrefs.map(({ key, label, enabled }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <button
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => toggleNotif(key)}
                  style={{
                    width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: enabled ? 'var(--accent)' : 'var(--bg-4)',
                    position: 'relative', transition: 'background .2s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
                      background: '#fff', transition: 'left .2s',
                      left: enabled ? 21 : 3,
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <Card title="Your stats">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STATS.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

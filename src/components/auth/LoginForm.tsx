'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Github, Mail } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      router.push('/inbox');
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="glass-card p-9">
      {/* Logo */}
      <div className="flex items-center gap-2 justify-center mb-8">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-1)' }}>
          Worknoon
        </span>
      </div>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 6 }}>
        Welcome back
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center', marginBottom: 28 }}>
        Sign in to your workspace
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            className="input-base"
            placeholder="alex@worknoon.com"
          />
          {errors.email && (
            <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.email.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              className="input-base"
              placeholder="••••••••"
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end mb-5">
          <span style={{ fontSize: 12, color: 'var(--accent-2)', cursor: 'pointer' }}>Forgot password?</span>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--text-3)', fontSize: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        or continue with
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: <Mail size={14} />, label: 'Google' },
          { icon: <Github size={14} />, label: 'GitHub' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            style={{ padding: '9px', background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 8, color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)', marginTop: 20 }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--accent-2)', fontWeight: 500 }}>
          Create one
        </Link>
      </p>
    </div>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'designer', label: 'Designer' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'agent', label: 'Support Agent' },
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['customer', 'designer', 'merchant', 'agent'] as const),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { confirmPassword: _, ...payload } = values;
      void _;
      await registerUser(payload);
      toast.success('Account created! Welcome aboard.');
      router.push('/inbox');
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="glass-card p-9">
      <div className="flex items-center gap-2 justify-center mb-8">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-1)' }}>Worknoon</span>
      </div>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 6 }}>Create account</h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center', marginBottom: 28 }}>Join the Worknoon platform</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <div className="mb-4">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Full name</label>
          <input {...register('name')} className="input-base" placeholder="Alex Morgan" />
          {errors.name && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email address</label>
          <input {...register('email')} type="email" className="input-base" placeholder="alex@example.com" />
          {errors.email && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.email.message}</p>}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Role</label>
          <select
            {...register('role')}
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '10px 12px', color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none', width: '100%' }}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value} style={{ background: 'var(--bg-2)' }}>{r.label}</option>
            ))}
          </select>
          {errors.role && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.role.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Password</label>
          <div className="relative">
            <input {...register('password')} type={showPass ? 'text' : 'password'} className="input-base" placeholder="At least 8 characters" style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Confirm password</label>
          <input {...register('confirmPassword')} type="password" className="input-base" placeholder="••••••••" />
          {errors.confirmPassword && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)', marginTop: 20 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent-2)', fontWeight: 500 }}>Sign in</Link>
      </p>
    </div>
  );
}

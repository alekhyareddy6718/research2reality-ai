'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('user@research2reality.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        const data = res.data as any;
        login(data.token, data.user);
        router.push('/dashboard');
      } else {
        setError(res.error?.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <Card glass className="w-full max-w-md bg-darkCard border-darkBorder p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white shadow-glow-purple">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Research2Reality AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your research projects & AI engines</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 text-white placeholder-slate-500 focus:outline-none transition-all"
                placeholder="name@organization.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 text-white placeholder-slate-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button variant="glow" size="lg" className="w-full mt-6" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-brand-400 hover:underline">
            Register now
          </Link>
        </div>
      </Card>
    </div>
  );
}

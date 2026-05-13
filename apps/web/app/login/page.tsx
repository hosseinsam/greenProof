'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';
import { Navbar } from '../../components/navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result: any = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (result.status !== 'success') {
      setMessage(result.message || 'Login failed');
      return;
    }
    saveSession(result.data.accessToken, result.data.user);
    window.location.href = '/';
  }

  return (
    <div>
      <Navbar />
      <main className="container py-10 md:py-14">
        <div className="mx-auto max-w-md rounded-[32px] border border-[color:var(--line)] bg-white/85 p-8 shadow-xl shadow-emerald-950/10 backdrop-blur">
          <span className="eyebrow">Welcome back</span>
          <h1 className="mt-5 text-4xl font-semibold text-[color:var(--foreground)]" style={{ fontFamily: 'var(--font-fraunces)' }}>Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Access verified certificate reporting, project funding, and community evidence workflows.</p>
          {message ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700">{message}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="field-label">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="field-input" type="email" required />
            </label>
            <label className="block">
              <span className="field-label">Password</span>
              <input value={password} onChange={e => setPassword(e.target.value)} className="field-input" type="password" required />
            </label>
            <button type="submit" className="btn-primary w-full">
              Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            New here? <Link href="/register" className="font-semibold text-[color:var(--primary)]">Create an account</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';
import Link from 'next/link';
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
      <main className="container mx-auto py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Access verified certificate reporting and evidence workflows.</p>
          {message ? <p className="mt-4 rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">{message}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full" type="email" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full" type="password" required />
            </label>
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-3 text-white">Login</button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            New here? <Link href="/register" className="text-sky-600">Create an account</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

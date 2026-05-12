'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';
import Link from 'next/link';
import { Navbar } from '../../components/navbar';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'COMPANY'>('USER');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result: any = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, companyName: role === 'COMPANY' ? companyName : undefined })
    });
    if (result.status !== 'success') {
      setMessage(result.message || 'Register failed');
      return;
    }
    const loginResult: any = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (loginResult.status === 'success') {
      saveSession(loginResult.data.accessToken, loginResult.data.user);
      window.location.href = '/';
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Register as a community member or company to access verified impact workflows.</p>
          {message ? <p className="mt-4 rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">{message}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full" type="text" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full" type="email" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full" type="password" required minLength={8} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select value={role} onChange={e => setRole(e.target.value as 'USER' | 'COMPANY')} className="mt-2 w-full">
                <option value="USER">Community user</option>
                <option value="COMPANY">Company</option>
              </select>
            </label>
            {role === 'COMPANY' ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Company name</span>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-2 w-full" type="text" required />
              </label>
            ) : null}
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-3 text-white">Register</button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            Already registered? <Link href="/login" className="text-sky-600">Sign in</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

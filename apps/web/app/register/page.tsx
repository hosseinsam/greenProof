'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';
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
      <main className="container py-10 md:py-14">
        <div className="mx-auto max-w-md rounded-[32px] border border-[color:var(--line)] bg-white/85 p-8 shadow-xl shadow-emerald-950/10 backdrop-blur">
          <span className="eyebrow">Join GreenProof</span>
          <h1 className="mt-5 text-4xl font-semibold text-[color:var(--foreground)]" style={{ fontFamily: 'var(--font-fraunces)' }}>Create account</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Register as a community member or company to access verified impact workflows.</p>
          {message ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700">{message}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="field-label">Name</span>
              <input value={name} onChange={e => setName(e.target.value)} className="field-input" type="text" required />
            </label>
            <label className="block">
              <span className="field-label">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="field-input" type="email" required />
            </label>
            <label className="block">
              <span className="field-label">Password</span>
              <input value={password} onChange={e => setPassword(e.target.value)} className="field-input" type="password" required minLength={8} />
            </label>
            <label className="block">
              <span className="field-label">Role</span>
              <select value={role} onChange={e => setRole(e.target.value as 'USER' | 'COMPANY')} className="field-input">
                <option value="USER">Community user</option>
                <option value="COMPANY">Company</option>
              </select>
            </label>
            {role === 'COMPANY' ? (
              <label className="block">
                <span className="field-label">Company name</span>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="field-input" type="text" required />
              </label>
            ) : null}
            <button type="submit" className="btn-primary w-full">
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Already registered? <Link href="/login" className="font-semibold text-[color:var(--primary)]">Sign in</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

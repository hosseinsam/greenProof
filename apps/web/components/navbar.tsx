'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Leaf, LogOut, Sparkles } from 'lucide-react';
import { clearSession, getSession } from '../lib/auth';

export function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[rgba(244,246,239,0.85)] backdrop-blur-xl">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--primary)] text-white shadow-lg shadow-emerald-950/15">
            <Leaf className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold text-[color:var(--foreground)]">GreenProof</span>
            <span className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Verified local impact</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
          <Link href="/impact-packs" className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[color:var(--foreground)]">Impact Packs</Link>
          <Link href="/certificates/sample" className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[color:var(--foreground)]">Certificate</Link>
          {user ? (
            <>
              <Link
                href={user.role === 'ADMIN' ? '/app/admin' : user.role === 'COMPANY' ? '/app/company' : '/app/user'}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[color:var(--foreground)] shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-[color:var(--primary)]" />
                {user.role === 'ADMIN' ? 'Admin workspace' : user.role === 'COMPANY' ? 'Company workspace' : 'Community workspace'}
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-[color:var(--foreground)] transition hover:bg-slate-50"
                onClick={() => {
                  clearSession();
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Login</Link>
              <Link href="/register" className="btn-primary">
                Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

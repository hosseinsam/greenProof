'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearSession, getSession } from '../lib/auth';

export function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white py-4 shadow-sm">
      <div className="container flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-semibold text-slate-900">GreenProof</Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <Link href="/impact-packs">Impact Packs</Link>
          <Link href="/certificates/sample">Certificate</Link>
          {user ? (
            <>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800">{user.role}</span>
              <button
                type="button"
                className="rounded bg-slate-900 px-3 py-1 text-white"
                onClick={() => {
                  clearSession();
                  window.location.href = '/login';
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100">Login</Link>
              <Link href="/register" className="rounded bg-slate-900 px-3 py-1 text-white">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

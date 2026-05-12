'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

export default function UserDashboardPage() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    apiFetch('/wallet/me').then((data) => setWallet(data?.data));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">User dashboard</h1>
          <p className="mt-2 text-slate-600">View your Green Coin balance and submissions.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">Balance</h2>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{wallet ? wallet.balance : '…'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <Link href="/app/user/submit" className="text-slate-900 hover:text-sky-600">Submit evidence</Link>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <Link href="/app/user/submissions" className="text-slate-900 hover:text-sky-600">My submissions</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

export default function UserWalletPage() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    apiFetch('/wallet/me').then((data) => setWallet(data?.data ?? null));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Green Coin wallet</h1>
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-slate-600">Your rewarded Green Coins support verified nature-impact actions.</p>
          <div className="mt-6 rounded-3xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Balance</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{wallet ? wallet.balance : '…'}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">Ledger</h2>
            <div className="mt-4 space-y-3">
              {wallet?.ledger?.length ? (
                wallet.ledger.map((entry: any) => (
                  <div key={entry.id} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{entry.reason}</p>
                    <p className="text-sm text-slate-600">{entry.amount} coins</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No ledger entries yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

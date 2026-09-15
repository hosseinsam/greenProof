'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function UserWalletPage() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    apiFetch('/wallet/me').then((data: any) => setWallet(data?.data ?? null));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Green Coin wallet</h1>
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-slate-600">
            Green Coins are internal launch rewards for verified nature-impact actions. They are reputation points, not tradable tokens, investments, or money.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Balance" value={wallet ? wallet.balance : '...'} />
            <Stat label="Coins earned" value={wallet?.stats?.totalCoinsEarned ?? '...'} />
            <Stat label="Verified trees" value={wallet?.stats?.verifiedTrees ?? '...'} />
            <Stat label="Projects helped" value={wallet?.stats?.projectsHelped ?? '...'} />
          </div>
          <div className="mt-8 rounded-3xl bg-emerald-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Reward rules</h2>
            <p className="mt-2 text-sm text-slate-600">{wallet?.rules?.summary ?? 'Coins reward verified actions inside GreenProof.'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {wallet?.rules?.rewards ? wallet.rules.rewards.map((reward: any) => (
                <div key={reward.type} className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">{reward.type.replace(/_/g, ' ')}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{reward.amount}</p>
                  <p className="mt-1 text-xs text-slate-500">{reward.trigger}</p>
                </div>
              )) : null}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">{wallet?.rules?.launchMode ?? 'Internal reward coin only for first launch.'}</p>
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function CompanyMarketplacePage() {
  const [packs, setPacks] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/impact-packs').then((data: any) => setPacks(data?.data?.packs ?? []));
  }, []);

  async function buyPack(id: string) {
    const result: any = await apiFetch('/company/purchases', { method: 'POST', body: JSON.stringify({ impactPackId: id }) });
    if (result.status === 'success') {
      setMessage(result.data?.requiresManualPaymentConfirmation ? 'Purchase created. Admin payment confirmation is required before certificate retirement.' : 'Pack purchased and certificate retired successfully.');
      return;
    }
    setMessage(result.message || 'Purchase failed.');
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Company marketplace</h1>
        <p className="mt-2 text-slate-600">Fund verified local nature-impact packs for transparent reporting.</p>
        {message ? <p className="mt-6 rounded border border-slate-200 bg-slate-50 p-4 text-slate-700">{message}</p> : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {packs.map(pack => (
            <div key={pack.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{pack.name}</h2>
              <p className="mt-2 text-slate-600">{pack.project?.name}</p>
              <p className="mt-4 text-slate-700">EUR {(pack.priceCents / 100).toFixed(0)} - {pack.treesPlanted} trees</p>
              <button onClick={() => buyPack(pack.id)} className="mt-6 rounded bg-slate-900 px-4 py-2 text-white">Fund pack</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

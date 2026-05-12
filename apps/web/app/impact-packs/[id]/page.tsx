'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

export default function PackDetailPage() {
  const params = useParams();
  const [pack, setPack] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    apiFetch(`/impact-packs/${params.id}`).then((data) => setPack(data?.data?.pack));
  }, [params.id]);

  async function buyPack() {
    if (!params.id) return;
    const result: any = await apiFetch('/company/purchases', { method: 'POST', body: JSON.stringify({ impactPackId: params.id }) });
    if (result.status === 'success') {
      setMessage('Purchase successful. Open your company certificates page to view details.');
      return;
    }
    setMessage(result.message || 'Purchase failed.');
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <Link href="/impact-packs" className="text-sm text-sky-600">← Back to packs</Link>
        {pack ? (
          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{pack.project?.country} • {pack.project?.city}</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{pack.name}</h1>
                <p className="mt-4 text-slate-600">{pack.description}</p>
              </div>
              <div className="space-y-3 rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Price</p>
                <p className="text-3xl font-semibold text-slate-900">€{(pack.priceCents / 100).toFixed(0)}</p>
                <button onClick={buyPack} className="w-full rounded bg-slate-900 px-4 py-3 text-white">Buy certificate</button>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <h2 className="font-semibold text-slate-900">Verified trees</h2>
                <p className="mt-2 text-3xl font-bold text-slate-900">{pack.treesPlanted}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <h2 className="font-semibold text-slate-900">Survival support</h2>
                <p className="mt-2 text-slate-600">{pack.treesAlive12m ?? 'TBD'} trees expected at 12 months</p>
              </div>
            </div>
            {message ? <p className="mt-6 rounded border border-slate-300 bg-slate-50 p-4 text-slate-700">{message}</p> : null}
          </div>
        ) : (
          <p className="mt-6 text-slate-600">Loading pack details…</p>
        )}
      </main>
    </div>
  );
}

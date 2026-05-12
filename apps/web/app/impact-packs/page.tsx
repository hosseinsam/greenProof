'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/navbar';
import { apiFetch } from '../../lib/api';

export default function ImpactPacksPage() {
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/impact-packs').then((data) => setPacks(data?.data?.packs ?? []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Impact Packs</h1>
        <p className="mt-2 text-slate-600">Browse audited nature impact bundles for local sustainability reporting.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {packs.map((pack) => (
            <div key={pack.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{pack.project?.name}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{pack.name}</h2>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{pack.status}</span>
              </div>
              <p className="mt-4 text-slate-600">{pack.description}</p>
              <div className="mt-4 flex items-center justify-between text-slate-700">
                <span>{pack.treesPlanted} trees</span>
                <span>€{(pack.priceCents / 100).toFixed(0)}</span>
              </div>
              <Link href={`/impact-packs/${pack.id}`} className="mt-6 inline-flex rounded bg-slate-900 px-4 py-2 text-white">View pack</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

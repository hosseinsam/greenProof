'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function CompanyPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/company/purchases').then((data: any) => setPurchases(data?.data?.purchases ?? []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Purchases</h1>
        <div className="mt-8 grid gap-4">
          {purchases.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">No purchases found.</p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-900">{purchase.impactPack?.name}</p>
                <p className="text-slate-600">Amount: €{(purchase.amountCents / 100).toFixed(2)}</p>
                <p className="text-slate-600">Status: {purchase.status}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

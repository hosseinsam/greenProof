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
        <p className="mt-3 max-w-3xl text-slate-600">
          Manual payments stay pending until a GreenProof admin confirms the payment reference. Certificates retire only after payment confirmation.
        </p>
        <div className="mt-8 grid gap-4">
          {purchases.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">No purchases found.</p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{purchase.impactPack?.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{purchase.impactPack?.project?.name}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{purchase.status}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  <p>Amount: {purchase.currency} {(purchase.amountCents / 100).toFixed(2)}</p>
                  <p>Payment reference: {purchase.paymentReference ?? 'waiting for admin confirmation'}</p>
                  <p>Paid at: {purchase.paidAt ? new Date(purchase.paidAt).toLocaleString() : 'not confirmed yet'}</p>
                  <p>Certificate: {purchase.certificate?.code ?? 'reserved after purchase'}</p>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  {purchase.status === 'PENDING'
                    ? 'Your impact units are reserved. The public certificate retires after the payment reference is confirmed.'
                    : 'Payment is confirmed and the certificate proof is ready for public reporting.'}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [references, setReferences] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const result = await apiFetch('/admin/purchases/pending');
    setPurchases(result?.data?.purchases ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirm(id: string) {
    const paymentReference = references[id]?.trim();
    if (!paymentReference) {
      setMessage('Add a payment reference before confirming.');
      return;
    }
    const result = await apiFetch(`/admin/purchases/${id}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentReference })
    });
    setMessage(result.status === 'success' ? 'Payment confirmed. Certificate retired and report generated.' : result.message ?? 'Confirmation failed.');
    await load();
  }

  return (
    <div>
      <Navbar />
      <main className="container py-10 md:py-14">
        <span className="eyebrow">Manual funding queue</span>
        <h1 className="mt-5 text-4xl font-semibold text-[color:var(--foreground)]">Confirm payments before retirement.</h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
          In manual payment mode, the company funds a pack first. The certificate retires only after an admin confirms the payment reference.
        </p>
        {message ? <p className="mt-6 rounded-2xl border bg-white p-4 text-slate-700">{message}</p> : null}
        <div className="mt-8 grid gap-5">
          {purchases.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No pending payments.</p>
          ) : purchases.map(purchase => (
            <article key={purchase.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{purchase.impactPack?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{purchase.company?.companyName ?? purchase.company?.name} - {purchase.impactPack?.project?.name}</p>
                  <p className="mt-4 text-slate-700">Amount: {purchase.currency} {(purchase.amountCents / 100).toFixed(2)}</p>
                  <p className="mt-1 text-slate-700">Certificate: {purchase.certificate?.code ?? 'pending'}</p>
                  <p className="mt-1 text-slate-700">Status: {purchase.status}</p>
                </div>
                <div>
                  <label className="field-label">Payment reference</label>
                  <input
                    className="field-input"
                    value={references[purchase.id] ?? ''}
                    onChange={event => setReferences(current => ({ ...current, [purchase.id]: event.target.value }))}
                    placeholder="Bank transfer, receipt, or invoice reference"
                  />
                  <button className="btn-primary mt-4 w-full" onClick={() => confirm(purchase.id)}>Confirm payment</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

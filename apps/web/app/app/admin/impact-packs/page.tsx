'use client';

import { Navbar } from '../../../components/navbar';

export default function AdminImpactPacksPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Admin impact packs</h1>
        <p className="mt-4 text-slate-600">Create verified impact packs for small companies to purchase.</p>
      </main>
    </div>
  );
}

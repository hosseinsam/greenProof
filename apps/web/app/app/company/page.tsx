'use client';

import Link from 'next/link';
import { Navbar } from '../../../components/navbar';

export default function CompanyDashboardPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">Company dashboard</h1>
          <p className="mt-2 text-slate-600">Browse impact packs, view purchases, and use certificates for reporting.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/app/company/marketplace" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Marketplace</Link>
            <Link href="/app/company/purchases" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Purchases</Link>
            <Link href="/app/company/certificates" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Certificates</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Navbar } from '../components/navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <section className="rounded-3xl bg-white p-10 shadow-lg">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Verified nature impact</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Verified local nature impact for small companies.</h1>
              <p className="mt-6 max-w-2xl text-slate-600">
                GreenProof helps communities document real planting and maintenance work, while companies fund
                transparent impact certificates for ESG evidence and sustainability storytelling.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/impact-packs" className="rounded bg-slate-900 px-5 py-3 text-white">Browse Impact Packs</Link>
                <Link href="/register" className="rounded border border-slate-300 px-5 py-3 text-slate-900">Register</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-8">
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">How it works</h2>
              <ul className="space-y-4 text-slate-600">
                <li>1. Community users submit verified planting or maintenance evidence.</li>
                <li>2. Admin reviews and approves submissions, minting Green Coins and impact units.</li>
                <li>3. Companies buy retired impact certificates with transparent registry hashes.</li>
                <li>4. Certificates support local sustainability reporting and safe claim wording.</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">For communities</h3>
            <p className="mt-4 text-slate-600">Submit evidence of planting, seed distribution, or habitat care and earn Green Coins for verified activity.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">For small companies</h3>
            <p className="mt-4 text-slate-600">Browse verified impact packs, fund local nature projects, and access audit-ready certificate evidence.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Navbar } from '../../../components/navbar';

export default function AdminDashboardPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Review evidence, manage projects, and issue certificates.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/app/admin/submissions" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Submissions</Link>
            <Link href="/app/admin/projects" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Projects</Link>
            <Link href="/app/admin/impact-packs" className="rounded-3xl bg-slate-50 p-6 text-slate-900 hover:bg-slate-100">Impact Packs</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

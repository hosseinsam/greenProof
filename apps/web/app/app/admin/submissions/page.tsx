'use client';

import { Navbar } from '../../../../components/navbar';

export default function AdminSubmissionsPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Admin submissions</h1>
        <p className="mt-4 text-slate-600">Review pending evidence and approve or reject submissions through the API.</p>
      </main>
    </div>
  );
}

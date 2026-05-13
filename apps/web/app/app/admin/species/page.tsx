'use client';

import { Navbar } from '../../../../components/navbar';

export default function AdminSpeciesPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Admin species</h1>
        <p className="mt-4 text-slate-600">Add species records for verified planting and restoration work.</p>
      </main>
    </div>
  );
}

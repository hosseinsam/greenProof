'use client';

import { Navbar } from '../../../../components/navbar';

export default function AdminProjectsPage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Admin projects</h1>
        <p className="mt-4 text-slate-600">Create and update project entries for verified local nature initiatives.</p>
      </main>
    </div>
  );
}

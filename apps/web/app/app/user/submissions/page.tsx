'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

export default function UserSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/submissions/my').then((data) => setSubmissions(data?.data?.submissions ?? []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">My submissions</h1>
        <div className="mt-8 grid gap-4">
          {submissions.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">No submissions yet.</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{submission.title}</h2>
                <p className="mt-2 text-slate-600">{submission.description}</p>
                <p className="mt-3 text-sm text-slate-500">Status: {submission.status}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

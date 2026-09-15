'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function UserSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/submissions/my').then((data: any) => setSubmissions(data?.data?.submissions ?? []));
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
                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Status: {submission.status}</p>
                  <p>Verification: {submission.verificationLevel ?? 'waiting for review'}</p>
                  {submission.reviewerNote ? <p className="sm:col-span-2">Reviewer note: {submission.reviewerNote}</p> : null}
                  {submission.rejectionReason ? <p className="font-semibold text-rose-700 sm:col-span-2">Rejection reason: {submission.rejectionReason}</p> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

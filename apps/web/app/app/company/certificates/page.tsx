'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

export default function CompanyCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/company/certificates').then((data) => setCertificates(data?.data?.certificates ?? []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Certificates</h1>
        <div className="mt-8 grid gap-4">
          {certificates.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">No certificates purchased yet.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-900">{cert.code}</p>
                <p className="text-slate-600">Status: {cert.status}</p>
                <p className="text-slate-600">Project: {cert.project?.name}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

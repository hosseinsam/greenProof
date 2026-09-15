'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

export default function CompanyCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/company/certificates').then((data: any) => setCertificates(data?.data?.certificates ?? []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Certificates</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Share verified local nature-impact support with public proof. GreenProof certificates are not carbon offsets or carbon-neutral claims.
        </p>
        <div className="mt-8 grid gap-4">
          {certificates.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">No certificates purchased yet.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{cert.code}</p>
                    <p className="mt-1 text-slate-600">Project: {cert.project?.name}</p>
                    <p className="text-sm text-slate-500">Pack: {cert.impactPack?.name}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{cert.status}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link className="btn-primary" href={`/certificates/${cert.code}`}>Open public proof</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

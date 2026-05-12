'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';

export default function CertificatePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!params.code) return;
    apiFetch(`/certificates/${params.code}/public`).then((result) => setData(result?.data));
  }, [params.code]);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <Link href="/" className="text-sm text-sky-600">← Back to home</Link>
        {data ? (
          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-semibold text-slate-900">Certificate {data.certificate.code}</h1>
            <p className="mt-2 text-slate-600">A retired impact certificate with transparent registry evidence.</p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <h2 className="font-semibold text-slate-900">Company</h2>
                <p className="mt-2 text-slate-700">{data.certificate.buyerCompany?.companyName ?? 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <h2 className="font-semibold text-slate-900">Project</h2>
                <p className="mt-2 text-slate-700">{data.certificate.project?.name}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900">Verification</h3>
                <p className="mt-2 text-slate-700">{data.certificate.verificationLevel}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900">Status</h3>
                <p className="mt-2 text-slate-700">{data.certificate.status}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
              <p><strong>Report hash:</strong> {data.certificate.reportHash}</p>
              <p><strong>Evidence hash:</strong> {data.certificate.evidenceBundleHash}</p>
              <p><strong>Mint tx:</strong> {data.certificate.chainMintTxHash}</p>
              <p><strong>Retire tx:</strong> {data.certificate.chainRetireTxHash}</p>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-100 p-6 text-slate-700">
              <h3 className="text-lg font-semibold text-slate-900">Safe public claim</h3>
              <p>This certificate supports audited local nature-impact reporting and transparent registry validation.</p>
              <p className="mt-3 font-semibold text-slate-900">Risky claim to avoid: Do not present this as a carbon-neutral or offset certificate.</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-slate-600">Loading certificate details…</p>
        )}
      </main>
    </div>
  );
}

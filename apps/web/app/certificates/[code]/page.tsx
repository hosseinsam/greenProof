'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/navbar';
import { API_URL, apiFetch } from '../../../lib/api';

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
        <Link href="/" className="text-sm text-sky-700">Back to home</Link>
        {data ? (
          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="grid gap-8 lg:grid-cols-[1fr_180px]">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">Certificate {data.certificate.code}</h1>
                <p className="mt-2 text-slate-600">Verified local nature-impact support with public proof, report hashes, and registry events.</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${API_URL}${data.qrUrl}`} alt="Certificate QR code" className="h-40 w-40 rounded-2xl border bg-white p-2" />
            </div>

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
              <p><strong>Mint tx:</strong> {data.certificate.chainMintTxHash ?? 'pending'}</p>
              <p><strong>Transfer tx:</strong> {data.certificate.chainTransferTxHash ?? 'pending'}</p>
              <p><strong>Retire tx:</strong> {data.certificate.chainRetireTxHash ?? 'pending'}</p>
              {data.reportUrl ? <a className="mt-4 inline-flex text-sky-700" href={`${API_URL}${data.reportUrl}`}>Download HTML report</a> : null}
            </div>

            <div className="mt-6 rounded-3xl bg-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Proof timeline</h3>
              <div className="mt-4 grid gap-3">
                {(data.proofTimeline ?? []).map((item: any, index: number) => (
                  <div key={`${item.label}-${index}`} className="rounded-2xl bg-white p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    {item.at ? <p>{item.at}</p> : null}
                    {item.txHash ? <p className="break-all">Tx: {item.txHash}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-emerald-50 p-6 text-slate-700">
              <h3 className="text-lg font-semibold text-slate-900">Safe public claims</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {(data.safeClaims ?? []).map((claim: string) => <li key={claim}>{claim}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-slate-600">Loading certificate details...</p>
        )}
      </main>
    </div>
  );
}

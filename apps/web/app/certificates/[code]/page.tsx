'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, Leaf, Printer, QrCode, ShieldCheck } from 'lucide-react';
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
      <main className="container mx-auto py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link href="/" className="text-sm font-medium text-sky-700">Back to home</Link>
          <button className="btn-secondary inline-flex items-center gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print certificate
          </button>
        </div>

        {data ? (
          <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl print:mt-0 print:rounded-none print:shadow-none">
            <section className="bg-[linear-gradient(135deg,#0f5132,#1f8a5f,#d7f3df)] p-8 text-white md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_190px]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Verified local nature-impact support
                  </div>
                  <h1 className="mt-6 text-4xl font-semibold tracking-normal md:text-5xl">GreenProof Certificate</h1>
                  <p className="mt-3 text-lg text-emerald-50">{data.certificate.code}</p>
                  <p className="mt-6 max-w-2xl text-emerald-50">
                    Public proof that a company funded verified local restoration activity, with evidence hashes, registry events, and safe reporting language.
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-4 text-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${API_URL}${data.qrUrl}`} alt="Certificate QR code" className="mx-auto h-40 w-40" />
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold">
                    <QrCode className="h-4 w-4" />
                    Scan for public proof
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 p-8 md:p-10 lg:grid-cols-3">
              <ProofCard label="Company" value={data.certificate.buyerCompany?.companyName ?? 'Unknown'} />
              <ProofCard label="Project" value={data.certificate.project?.name ?? 'Unknown project'} />
              <ProofCard label="Status" value={data.certificate.status} />
              <ProofCard label="Verification" value={data.certificate.verificationLevel} />
              <ProofCard label="Issued" value={new Date(data.certificate.issuedAt).toLocaleDateString()} />
              <ProofCard label="Retired" value={data.certificate.retiredAt ? new Date(data.certificate.retiredAt).toLocaleDateString() : 'pending'} />
            </section>

            <section className="border-t border-slate-100 p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Proof timeline</h2>
                  <div className="mt-5 grid gap-3">
                    {(data.proofTimeline ?? []).map((item: any, index: number) => (
                      <div key={`${item.label}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        {item.at ? <p>{new Date(item.at).toLocaleString()}</p> : null}
                        {item.txHash ? <p className="break-all text-xs text-slate-500">Tx: {item.txHash}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="rounded-3xl bg-emerald-50 p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Leaf className="h-5 w-5 text-emerald-700" />
                    Safe public claim
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {(data.safeClaims ?? []).map((claim: string) => <li key={claim}>{claim}</li>)}
                  </ul>
                  <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Not a carbon offset</p>
                    <p className="mt-2">
                      This proof supports local nature-impact reporting. It must not be used as a carbon-neutral, offset, or certified carbon-credit claim.
                    </p>
                  </div>
                </aside>
              </div>
            </section>

            <section className="border-t border-slate-100 bg-slate-50 p-8 md:p-10">
              <h2 className="text-2xl font-semibold text-slate-900">Registry and evidence hashes</h2>
              <div className="mt-5 grid gap-3 text-sm text-slate-700">
                <HashRow label="Report hash" value={data.certificate.reportHash} />
                <HashRow label="Evidence hash" value={data.certificate.evidenceBundleHash} />
                <HashRow label="Mint tx" value={data.certificate.chainMintTxHash ?? 'pending'} />
                <HashRow label="Transfer tx" value={data.certificate.chainTransferTxHash ?? 'pending'} />
                <HashRow label="Retire tx" value={data.certificate.chainRetireTxHash ?? 'pending'} />
              </div>
              {data.reportUrl ? (
                <a className="btn-primary mt-6 inline-flex items-center gap-2 print:hidden" href={`${API_URL}${data.reportUrl}`}>
                  <Download className="h-4 w-4" />
                  Download public report
                </a>
              ) : null}
            </section>
          </div>
        ) : (
          <p className="mt-6 text-slate-600">Loading certificate details...</p>
        )}
      </main>
    </div>
  );
}

function ProofCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-1 break-all text-xs text-slate-500">{value}</p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../../components/navbar';
import { API_URL, apiFetch } from '../../../../lib/api';

type Submission = {
  id: string;
  title: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  locationPrecision?: string | null;
  evidenceHash?: string | null;
  evidenceMimeType?: string | null;
  evidenceFileSize?: number | null;
  evidenceOriginalName?: string | null;
  reviewerNote?: string | null;
  suspiciousFlag?: boolean;
  user?: { name: string; email: string };
  project?: { name: string };
  species?: { commonName: string };
};

type ReviewChecklist = {
  imagePresent: boolean;
  locationPresent: boolean;
  projectSelected: boolean;
  speciesSelected: boolean;
  duplicateCheckPassed: boolean;
};

const checklistKeys: Array<keyof ReviewChecklist> = [
  'imagePresent',
  'locationPresent',
  'projectSelected',
  'speciesSelected',
  'duplicateCheckPassed'
];

function checklistFor(submission?: Submission): ReviewChecklist {
  return {
    imagePresent: Boolean(submission?.evidenceHash),
    locationPresent: submission?.latitude != null && submission?.longitude != null,
    projectSelected: Boolean(submission?.project),
    speciesSelected: Boolean(submission?.species),
    duplicateCheckPassed: Boolean(submission?.evidenceHash && !submission?.suspiciousFlag)
  };
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [checklists, setChecklists] = useState<Record<string, ReviewChecklist>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const result = await apiFetch('/admin/submissions');
    setSubmissions(result?.data?.submissions ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function loadPreview(id: string) {
    const token = localStorage.getItem('greenproof_token');
    const response = await fetch(`${API_URL}/submissions/${id}/evidence`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      setMessage('Could not load evidence preview.');
      return;
    }
    const blob = await response.blob();
    setPreviews(current => ({ ...current, [id]: URL.createObjectURL(blob) }));
  }

  async function approve(id: string) {
    const checklist = checklists[id] ?? checklistFor(submissions.find(submission => submission.id === id));
    const result = await apiFetch(`/admin/submissions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        reviewerNote: notes[id] ?? '',
        verificationLevel: 'PARTNER_VERIFIED',
        checklist
      })
    });
    setMessage(result.status === 'success' ? 'Submission approved and Green Coins minted.' : result.message ?? 'Approval failed.');
    await load();
  }

  async function reject(id: string) {
    const checklist = checklists[id] ?? checklistFor(submissions.find(submission => submission.id === id));
    const result = await apiFetch(`/admin/submissions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        rejectionReason: notes[id] || 'Evidence does not pass verification.',
        reviewerNote: notes[id] ?? '',
        checklist
      })
    });
    setMessage(result.status === 'success' ? 'Submission rejected with reviewer notes.' : result.message ?? 'Rejection failed.');
    await load();
  }

  function toggleChecklist(id: string, key: keyof ReviewChecklist) {
    setChecklists(current => {
      const checklist = current[id] ?? checklistFor(submissions.find(submission => submission.id === id));
      return { ...current, [id]: { ...checklist, [key]: !checklist[key] } };
    });
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Admin submissions</h1>
        <p className="mt-4 text-slate-600">Review evidence, checklist status, duplicate risk, and reviewer notes before minting rewards.</p>
        {message ? <p className="mt-6 rounded-2xl border bg-white p-4 text-slate-700">{message}</p> : null}
        <div className="mt-8 grid gap-6">
          {submissions.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No pending submissions.</p>
          ) : submissions.map(submission => (
            <article key={submission.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">{submission.title}</h2>
                    {submission.suspiciousFlag ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Needs extra review</span> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{submission.user?.name} - {submission.project?.name} - {submission.species?.commonName}</p>
                  <p className="mt-4 text-slate-700">{submission.description}</p>
                  <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                    <p>Location: {submission.latitude ?? 'missing'}, {submission.longitude ?? 'missing'}</p>
                    <p>Precision: {submission.locationPrecision ?? 'not provided'}</p>
                    <p>Upload: {submission.evidenceOriginalName ?? 'evidence image'}</p>
                    <p>Type/size: {submission.evidenceMimeType ?? 'unknown'} - {submission.evidenceFileSize ? `${Math.round(submission.evidenceFileSize / 1024)} KB` : 'unknown'}</p>
                    <p className="break-all sm:col-span-2">Evidence hash: {submission.evidenceHash ?? 'pending'}</p>
                    {submission.suspiciousFlag ? <p className="font-semibold text-amber-800 sm:col-span-2">Review flag: {submission.reviewerNote ?? 'Evidence needs extra attention.'}</p> : null}
                  </div>
                  <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-2">
                    {checklistKeys.map(key => {
                      const value = (checklists[submission.id] ?? checklistFor(submission))[key];
                      return (
                        <label key={key} className="flex items-center gap-3 text-sm text-slate-700">
                          <input type="checkbox" checked={value} onChange={() => toggleChecklist(submission.id, key)} />
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                      );
                    })}
                  </div>
                  <textarea
                    className="field-input mt-5 min-h-24"
                    placeholder="Reviewer note or rejection reason"
                    value={notes[submission.id] ?? ''}
                    onChange={event => setNotes(current => ({ ...current, [submission.id]: event.target.value }))}
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="btn-primary" onClick={() => approve(submission.id)}>Approve</button>
                    <button className="btn-secondary" onClick={() => reject(submission.id)}>Reject</button>
                    <button className="btn-secondary" onClick={() => loadPreview(submission.id)}>Load evidence</button>
                  </div>
                </div>
                <div className="min-h-56 overflow-hidden rounded-3xl bg-slate-100">
                  {previews[submission.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previews[submission.id]} alt={`Evidence for ${submission.title}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-56 items-center justify-center p-6 text-center text-sm text-slate-500">
                      Evidence preview is private. Load it when reviewing.
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

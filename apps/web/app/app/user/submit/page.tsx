'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Crosshair, ImagePlus, MapPinned, Sprout } from 'lucide-react';
import { Navbar } from '../../../../components/navbar';
import { apiFetch } from '../../../../lib/api';

const LeafletLocationPicker = dynamic(
  () => import('../../../../components/leaflet-location-picker'),
  { ssr: false }
);

type Coordinates = {
  lat: number;
  lng: number;
};

const SUBMISSION_TYPES = [
  { value: 'TREE_PLANTED', label: 'Tree planted', reward: '+5 coins' },
  { value: 'SEED_PLANTED', label: 'Seed planted', reward: '+2 coins' },
  { value: 'MAINTENANCE', label: 'Maintenance', reward: '+3 coins' },
  { value: 'SURVIVAL_CHECK', label: 'Survival check', reward: '+10 coins' },
  { value: 'COMMUNITY_EVENT', label: 'Community event', reward: '+20 coins' }
] as const;

export default function UserSubmitPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [type, setType] = useState('TREE_PLANTED');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationPrecision, setLocationPrecision] = useState('approximate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiFetch('/projects').then((data) => setProjects(data?.data?.projects ?? []));
    apiFetch('/species').then((data) => setSpecies(data?.data?.species ?? []));
  }, []);

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: position }) => {
        setCoords({
          lat: Number(position.latitude.toFixed(6)),
          lng: Number(position.longitude.toFixed(6))
        });
        setLocationPrecision('gps');
        setMessage('Location captured from your device. You can still fine-tune it on the map.');
      },
      () => {
        setMessage('Unable to access your current location. You can still click on the map to choose it manually.');
      }
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setMessage('Please attach an evidence image.');
      return;
    }
    if (!coords) {
      setMessage('Please choose the planting location on the map before submitting.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('speciesId', speciesId);
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', String(coords.lat));
    formData.append('longitude', String(coords.lng));
    formData.append('locationPrecision', locationPrecision);
    formData.append('file', file);

    const result: any = await apiFetch('/submissions', { method: 'POST', body: formData });
    if (result.status === 'success') {
      setMessage('Submission created and pending review.');
      setTitle('');
      setDescription('');
      setProjectId('');
      setSpeciesId('');
      setType('TREE_PLANTED');
      setCoords(null);
      setLocationPrecision('approximate');
      setFile(null);
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message || 'Submission failed.');
    setIsSubmitting(false);
  }

  return (
    <div>
      <Navbar />
      <main className="container py-10 md:py-14">
        <section className="glass-card overflow-hidden rounded-[36px] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <span className="eyebrow">
                <Sprout className="mr-2 h-3.5 w-3.5" />
                Community evidence
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--foreground)] md:text-5xl" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Add planting proof with a precise map location.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)]">
                This flow is designed to match the stronger GreenProof UI direction: richer guidance, clearer status, and more trustworthy location evidence for every new plant record.
              </p>

              <div className="mt-8 space-y-4">
                <GuideCard
                  icon={<ImagePlus className="h-5 w-5" />}
                  title="1. Add evidence"
                  text="Upload a photo that clearly shows the planting, maintenance, or survival check."
                />
                <GuideCard
                  icon={<MapPinned className="h-5 w-5" />}
                  title="2. Pin the exact spot"
                  text="Choose the location on the map or use your current position, then adjust it manually if needed."
                />
                <GuideCard
                  icon={<Crosshair className="h-5 w-5" />}
                  title="3. Submit for review"
                  text="Admins can verify the work faster when the description and map pin are both accurate."
                />
              </div>
            </div>

            <div className="panel-card">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Project</span>
                    <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="field-input" required>
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="field-label">Species</span>
                    <select value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} className="field-input" required>
                      <option value="">Select a species</option>
                      {species.map((item) => (
                        <option key={item.id} value={item.id}>{item.commonName}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="field-label">Submission type</span>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="field-input" required>
                    {SUBMISSION_TYPES.map((submissionType) => (
                      <option key={submissionType.value} value={submissionType.value}>
                        {submissionType.label} ({submissionType.reward})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="field-label">Title</span>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="field-input" type="text" required placeholder="Planted three olive saplings near the school entrance" />
                </label>

                <label className="block">
                  <span className="field-label">Description</span>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="field-input min-h-32 resize-y" rows={5} required placeholder="What was planted, who joined, and anything reviewers should know." />
                </label>

                <div className="rounded-[28px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.75)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">Planting location</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">Click anywhere on the map to place the evidence pin.</p>
                    </div>
                    <button type="button" className="btn-secondary" onClick={useMyLocation}>Use my location</button>
                  </div>
                  <div className="mt-4">
                    <LeafletLocationPicker value={coords} onChange={(nextCoords) => setCoords(nextCoords)} />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="field-label">Latitude</span>
                        <input
                          className="field-input"
                          value={coords ? coords.lat : ''}
                          onChange={(event) => {
                            const lat = Number(event.target.value);
                            setCoords((current) => ({ lat, lng: current?.lng ?? 51.389 }));
                          }}
                          placeholder="35.6892"
                        />
                      </label>
                      <label className="block">
                        <span className="field-label">Longitude</span>
                        <input
                          className="field-input"
                          value={coords ? coords.lng : ''}
                          onChange={(event) => {
                            const lng = Number(event.target.value);
                            setCoords((current) => ({ lat: current?.lat ?? 35.6892, lng }));
                          }}
                          placeholder="51.3890"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="field-label">Precision</span>
                      <select value={locationPrecision} onChange={(e) => setLocationPrecision(e.target.value)} className="field-input min-w-40">
                        <option value="gps">GPS</option>
                        <option value="exact">Exact manual pin</option>
                        <option value="approximate">Approximate</option>
                      </select>
                    </label>
                  </div>
                </div>

                <label className="block">
                  <span className="field-label">Evidence image</span>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="field-input" required />
                </label>

                <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Create submission'}
                </button>
              </form>
              {message ? <p className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.75)] p-4 text-sm text-[color:var(--foreground)]">{message}</p> : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function GuideCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(40,89,67,0.1)] text-[color:var(--primary)]">{icon}</div>
      <h2 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}

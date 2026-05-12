'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/navbar';
import { apiFetch } from '../../../lib/api';

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

  useEffect(() => {
    apiFetch('/projects').then((data) => setProjects(data?.data?.projects ?? []));
    apiFetch('/species').then((data) => setSpecies(data?.data?.species ?? []));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setMessage('Please attach an evidence image.');
      return;
    }
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('speciesId', speciesId);
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    const result: any = await apiFetch('/submissions', { method: 'POST', body: formData });
    if (result.status === 'success') {
      setMessage('Submission created and pending review.');
      setTitle('');
      setDescription('');
      setFile(null);
      return;
    }
    setMessage(result.message || 'Submission failed.');
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">Submit evidence</h1>
          <p className="mt-2 text-slate-600">Upload planting or survival evidence for review.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Project</span>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-2 w-full" required>
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Species</span>
              <select value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} className="mt-2 w-full" required>
                <option value="">Select species</option>
                {species.map((item) => (
                  <option key={item.id} value={item.id}>{item.commonName}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Submission type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full" required>
                <option value="TREE_PLANTED">Tree planted</option>
                <option value="SEED_PLANTED">Seed planted</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="SURVIVAL_CHECK">Survival check</option>
                <option value="COMMUNITY_EVENT">Community event</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input value={title} onChange={e => setTitle(e.target.value)} className="mt-2 w-full" type="text" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-2 w-full" rows={4} required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Evidence image</span>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="mt-2 w-full" required />
            </label>
            <button type="submit" className="rounded bg-slate-900 px-4 py-3 text-white">Create submission</button>
          </form>
          {message ? <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-slate-700">{message}</p> : null}
        </div>
      </main>
    </div>
  );
}

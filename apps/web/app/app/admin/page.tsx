'use client';

import { DashboardShell } from '../../../components/dashboard-shell';

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      eyebrow="Admin workspace"
      title="Review evidence quickly without losing the audit trail."
      description="Use the admin workspace to manage the proof pipeline, shape projects and species, and turn approved activity into credible funding outputs."
      stats={[
        { label: 'Queue status', value: 'Pending' },
        { label: 'Evidence type', value: 'Geo-tagged' },
        { label: 'Audit trail', value: 'On' }
      ]}
      actions={[
        { href: '/app/admin/submissions', label: 'Submissions', description: 'Review incoming evidence, inspect coordinates, and approve or reject with context.' },
        { href: '/app/admin/projects', label: 'Projects', description: 'Maintain the project catalog that community users can attach their field activity to.' },
        { href: '/app/admin/impact-packs', label: 'Impact Packs', description: 'Package approved impact units into offerings that companies can responsibly fund.' }
      ]}
    />
  );
}

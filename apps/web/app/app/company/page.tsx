'use client';

import { DashboardShell } from '../../../components/dashboard-shell';

export default function CompanyDashboardPage() {
  return (
    <DashboardShell
      eyebrow="Company workspace"
      title="Fund local projects and keep the evidence trail ready for reporting."
      description="Browse the marketplace, manage purchases, and access certificates that are explicit about what was funded, verified, and retired."
      stats={[
        { label: 'Claim safety', value: 'High' },
        { label: 'Certificates', value: 'Auditable' },
        { label: 'Registry trail', value: 'Public' }
      ]}
      actions={[
        { href: '/app/company/marketplace', label: 'Marketplace', description: 'Compare available impact packs and find the best fit for your local nature goals.' },
        { href: '/app/company/purchases', label: 'Purchases', description: 'Track orders, statuses, and the progression from funding to issued proof.' },
        { href: '/app/company/certificates', label: 'Certificates', description: 'Open retired certificates with their supporting hashes and reporting context.' }
      ]}
    />
  );
}

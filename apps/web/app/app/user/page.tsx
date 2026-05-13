'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '../../../components/dashboard-shell';
import { apiFetch } from '../../../lib/api';

export default function UserDashboardPage() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    apiFetch('/wallet/me').then((data) => setWallet(data?.data));
  }, []);

  return (
    <DashboardShell
      eyebrow="Community workspace"
      title="Track field work, rewards, and what needs review next."
      description="Your dashboard is organized around evidence capture. From here you can submit new planting records, follow review outcomes, and keep an eye on your Green Coin balance."
      stats={[
        { label: 'Green Coins', value: wallet ? String(wallet.balance) : '...' },
        { label: 'Review flow', value: 'Live' },
        { label: 'Location proof', value: 'Map-enabled' }
      ]}
      actions={[
        { href: '/app/user/submit', label: 'Submit evidence', description: 'Create a richer planting or maintenance record with image proof and an exact map pin.' },
        { href: '/app/user/submissions', label: 'My submissions', description: 'Review pending, approved, and rejected submissions in one place.' },
        { href: '/app/user/wallet', label: 'Wallet activity', description: 'See your ledger, rewards, and any chain transaction references.' }
      ]}
    />
  );
}

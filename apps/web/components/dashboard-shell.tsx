'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar } from './navbar';

export function DashboardShell({
  eyebrow,
  title,
  description,
  stats,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  actions: Array<{ href: string; label: string; description: string }>;
}) {
  return (
    <div>
      <Navbar />
      <main className="container py-10 md:py-14">
        <section className="glass-card overflow-hidden rounded-[36px] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: 'var(--font-fraunces)' }}>
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[color:var(--muted)] md:text-lg">{description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="panel-card group transition hover:-translate-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--primary)]">Next step</p>
              <h2 className="mt-4 text-2xl font-semibold text-[color:var(--foreground)]">{action.label}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{action.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)]">
                Open
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

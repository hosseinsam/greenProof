'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Sprout, Users } from 'lucide-react';
import { Navbar } from '../components/navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="container py-10 md:py-14">
        <section className="glass-card relative overflow-hidden rounded-[36px] p-10 md:p-14">
          <div className="absolute inset-0 -z-10" style={{ background: 'var(--hero-gradient)' }} />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <Leaf className="mr-2 h-3.5 w-3.5" />
                Verified nature impact
              </span>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] md:text-6xl" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Verified local nature impact for small companies.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
                GreenProof helps communities document real planting and maintenance work, while companies fund
                transparent impact certificates for ESG evidence and sustainability storytelling.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/impact-packs" className="btn-primary">
                  Browse Impact Packs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/register" className="btn-secondary">Register</Link>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl shadow-emerald-950/10">
              <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--muted)]">Sample certificate</p>
              <h2 className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">Stockholm School Tree Pilot</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">10 verified trees • Partner-verified • Retired</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <HeroStat label="Verification" value="Partner" />
                <HeroStat label="Registry" value="Public" />
                <HeroStat label="Report hash" value="0x9af2...c41b" />
                <HeroStat label="Mint tx" value="0x3e87...d5a0" />
              </div>
              <p className="mt-6 text-sm leading-6 text-[color:var(--muted)]">
                Certificates document funded local nature work and provide auditable reporting support without drifting into risky carbon-credit language.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: 'var(--font-fraunces)' }}>How it works</h2>
            <p className="mt-3 text-lg text-[color:var(--muted)]">Evidence flows from the field into transparent review and funding workflows that both communities and companies can trust.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<Sprout className="h-5 w-5" />} title="Communities document work" text="Users submit planting, survival, and maintenance evidence with photo proof and a precise location." />
            <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Admins verify and reward" text="Approved submissions mint Green Coins, create impact units, and keep the evidence trail auditable." />
            <FeatureCard icon={<Users className="h-5 w-5" />} title="Companies retire certificates" text="Businesses fund local projects through impact packs and use retired certificates for safer ESG storytelling." />
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <AudienceCard
            title="For communities"
            description="Submit evidence of planting, seed distribution, or habitat care and earn Green Coins for verified activity."
            bullets={['Upload photo evidence from the field', 'Pin exact planting locations on a map', 'Track approval status and wallet rewards']}
          />
          <AudienceCard
            title="For small companies"
            description="Browse verified impact packs, fund local nature projects, and access audit-ready certificate evidence."
            bullets={['Back transparent local projects', 'Retire certificates to avoid double-claiming', 'Use safer, defensible impact language']}
          />
        </section>
      </main>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[rgba(40,89,67,0.06)] p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="panel-card">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(40,89,67,0.1)] text-[color:var(--primary)]">{icon}</div>
      <h3 className="mt-5 text-xl font-semibold text-[color:var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}

function AudienceCard({ title, description, bullets }: { title: string; description: string; bullets: string[] }) {
  return (
    <div className="panel-card">
      <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
      <ul className="mt-5 space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-[color:var(--foreground)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--primary)]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

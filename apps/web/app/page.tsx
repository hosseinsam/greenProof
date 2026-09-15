'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Coins, Globe2, Leaf, MapPin, ShieldCheck, Sprout, Trees, Users } from 'lucide-react';
import { Navbar } from '../components/navbar';

const proofSteps = [
  { title: 'People care for nature', text: 'Communities plant trees, check survival, restore seeds, and maintain local green places.', icon: Sprout },
  { title: 'Evidence becomes trust', text: 'Photos, location, species, reviewer notes, and hashes create a clear record of what happened.', icon: ShieldCheck },
  { title: 'Companies fund proof', text: 'Impact packs help businesses support verified local work with certificates that avoid risky offset claims.', icon: Users }
];

const worldSignals = [
  { label: 'Local action', value: 'Field evidence', icon: MapPin },
  { label: 'Reward', value: 'Internal coins', icon: Coins },
  { label: 'Proof', value: 'Public certificate', icon: ShieldCheck },
  { label: 'Mission', value: 'Better living', icon: Globe2 }
];

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <section className="living-hero">
          <div className="container relative z-10 grid min-h-[calc(100vh-88px)] gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <Leaf className="mr-2 h-3.5 w-3.5" />
                Proof for a more livable world
              </span>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-[color:var(--foreground)] md:text-7xl">
                Turn local nature care into trusted proof.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
                GreenProof brings together people who plant, maintain, and protect local nature with companies that want transparent, responsible ways to fund better living.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary">
                  Join GreenProof
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/impact-packs" className="btn-secondary">Explore impact packs</Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[32px] border border-white/70 bg-white/80 p-7 shadow-xl shadow-emerald-950/10 backdrop-blur">
                <p className="text-sm uppercase tracking-normal text-[color:var(--muted)]">Live proof trail</p>
                <h2 className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">A tree is not a claim. It is evidence.</h2>
                <div className="mt-6 grid gap-3">
                  {['Photo captured', 'Location pinned', 'Reviewer approved', 'Coins rewarded', 'Certificate retired'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-[rgba(40,89,67,0.06)] p-3 text-sm font-semibold text-[color:var(--foreground)]">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {worldSignals.map((signal) => {
                  const Icon = signal.icon;
                  return (
                    <div key={signal.label} className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                      <Icon className="h-5 w-5 text-[color:var(--primary)]" />
                      <p className="mt-4 text-xs uppercase tracking-normal text-[color:var(--muted)]">{signal.label}</p>
                      <p className="mt-2 font-semibold text-[color:var(--foreground)]">{signal.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-14">
          <div className="max-w-3xl">
            <span className="eyebrow">Why it matters</span>
            <h2 className="mt-5 text-4xl font-semibold md:text-5xl">People already want a better world. GreenProof gives their work a trusted record.</h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
              Small nature actions often disappear after the day they happen. GreenProof keeps the proof alive so contributors feel recognized and companies can fund local impact without vague green claims.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {proofSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="panel-card">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(40,89,67,0.1)] text-[color:var(--primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[color:var(--foreground)]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{step.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[rgba(255,255,255,0.52)] py-14">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow">GreenProof Coins</span>
              <h2 className="mt-5 text-4xl font-semibold md:text-5xl">A reward for verified contribution, not speculation.</h2>
              <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
                Coins recognize approved planting, seed restoration, maintenance, survival checks, and community events. They are internal reputation points for launch, not money, not trading, and not carbon credits.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImpactMetric icon={<Trees className="h-5 w-5" />} label="Tree planted" value="5 coins" />
              <ImpactMetric icon={<Sprout className="h-5 w-5" />} label="Seed planted" value="2 coins" />
              <ImpactMetric icon={<ShieldCheck className="h-5 w-5" />} label="Survival check" value="10 coins" />
              <ImpactMetric icon={<Users className="h-5 w-5" />} label="Community event" value="20 coins" />
            </div>
          </div>
        </section>

        <section className="container py-14">
          <div className="grid gap-5 lg:grid-cols-2">
            <AudienceCard
              title="For people who want better places to live"
              text="Submit evidence, follow review decisions, earn contribution coins, and build a public-safe record of local nature care."
              bullets={['Planting and maintenance evidence', 'Reviewer notes and transparent status', 'Contribution stats you can be proud of']}
            />
            <AudienceCard
              title="For companies funding real local work"
              text="Fund impact packs, wait for payment confirmation, receive retired certificates, and share proof without making offset claims."
              bullets={['Verified impact units', 'QR certificate proof', 'Safe sustainability reporting language']}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ImpactMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="text-[color:var(--primary)]">{icon}</div>
      <p className="mt-4 text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function AudienceCard({ title, text, bullets }: { title: string; text: string; bullets: string[] }) {
  return (
    <div className="panel-card">
      <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
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

import Link from 'next/link';
import { Leaf, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[color:var(--line)] bg-[rgba(255,255,255,0.55)]">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)] text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[color:var(--foreground)]">GreenProof</p>
              <p className="text-xs uppercase tracking-normal text-[color:var(--muted)]">Verified local impact</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-[color:var(--muted)]">
            A proof system for people and companies who believe better living starts with cared-for local nature, honest evidence, and responsible funding.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Explore</p>
          <div className="mt-4 grid gap-2 text-sm text-[color:var(--muted)]">
            <Link href="/impact-packs">Impact packs</Link>
            <Link href="/register">Join the community</Link>
            <Link href="/login">Workspace login</Link>
          </div>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
            <ShieldCheck className="h-4 w-4" />
            Safe claim
          </p>
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
            GreenProof certificates document verified local nature-impact support. They are not carbon offsets, investment products, or carbon-neutrality claims.
          </p>
        </div>
      </div>
    </footer>
  );
}

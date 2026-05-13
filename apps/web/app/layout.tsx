import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces'
});

export const metadata: Metadata = {
  title: 'GreenProof',
  description: 'Verified local nature impact for small companies.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>
        <div className="min-h-screen text-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}

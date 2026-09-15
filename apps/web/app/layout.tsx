import './globals.css';
import type { Metadata } from 'next';
import { Footer } from '../components/footer';

export const metadata: Metadata = {
  title: 'GreenProof',
  description: 'Verified local nature impact for small companies.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen text-slate-900">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

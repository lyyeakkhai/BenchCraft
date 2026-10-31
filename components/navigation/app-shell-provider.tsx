'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Full-screen SaaS Dashboard & Evaluation flow:
  // Edge-to-edge workspace, no marketing navbar, no marketing footer
  const isDashboard = pathname.startsWith('/dashboard');
  const isPrintReport = pathname.includes('/report');

  if (isDashboard || isPrintReport) {
    return <div className="h-screen w-screen overflow-hidden flex flex-col">{children}</div>;
  }

  // Legacy evaluation redirect routes (/c/*)
  if (pathname.startsWith('/c/')) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  // Marketing pages (/, /product, /how-it-works, /pricing, /case-study)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}

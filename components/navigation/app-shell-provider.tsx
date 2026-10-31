'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isPrintReport = pathname.includes('/report');

  if (isDashboard || isPrintReport) {
    return <div className="h-screen w-full overflow-hidden flex flex-col bg-paper text-ink">{children}</div>;
  }

  if (pathname.startsWith('/c/')) {
    return <div className="min-h-screen flex flex-col bg-paper text-ink">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Navbar />
      <main id="main" className="flex-1 container py-10">{children}</main>
      <Footer />
    </div>
  );
}

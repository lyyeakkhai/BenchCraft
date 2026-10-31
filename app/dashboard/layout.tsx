import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { comparisons } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { ShieldCheck, Plus, Terminal } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await requireUser();

  const userComparisons = await db
    .select({ id: comparisons.id })
    .from(comparisons)
    .where(eq(comparisons.clerkUserId, userId));

  const totalUsed = userComparisons.length;
  const maxLimit = 20;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-paper text-ink relative">
      {/* Soft Ambient Top Glow Beam */}
      <div className="fixed inset-x-0 top-0 h-[360px] glow-beam pointer-events-none z-0 opacity-40 dark:opacity-60" />

      <div className="hidden md:block h-screen flex-shrink-0 print:hidden relative z-20">
        <DashboardSidebar totalUsed={totalUsed} maxLimit={maxLimit} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-14 bg-paper-2/90 backdrop-blur-md border-b border-rule px-6 flex items-center justify-between gap-4 flex-shrink-0 z-20 print:hidden">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              href="/dashboard"
              className="font-medium text-ink hover:text-accent transition-colors whitespace-nowrap"
            >
              Workspace
            </Link>
            <span className="text-muted/50" aria-hidden="true">/</span>
            <span className="font-semibold text-ink whitespace-nowrap">
              Production Arena
            </span>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill glass-well text-xs font-medium text-accent whitespace-nowrap border border-accent/25">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>ZDR Active</span>
            </span>
            <ThemeToggle />
            <Link
              href="/dashboard/evaluations/new"
              className="btn-ledger btn-sm hidden sm:inline-flex"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Evaluation</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">{children}</div>
        </div>
      </div>
    </div>
  );
}

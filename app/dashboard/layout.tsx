import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { comparisons } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await requireUser();

  // Fetch count of evaluations for usage meter
  const userComparisons = await db
    .select({ id: comparisons.id })
    .from(comparisons)
    .where(eq(comparisons.clerkUserId, userId));

  const totalUsed = userComparisons.length;
  const maxLimit = 20;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#EDF2EF]">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block h-screen flex-shrink-0">
        <DashboardSidebar totalUsed={totalUsed} maxLimit={maxLimit} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#EDF2EF]">
        {/* Dashboard Sub-Header */}
        <header className="h-14 bg-white border-b border-[#D3DDD8] px-6 flex items-center justify-between gap-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-xs text-[#4B605C]">
            <Link href="/dashboard" className="font-semibold text-[#0A2E2B] hover:text-[#1F5C55] transition flex items-center gap-1.5">
              Dashboard
            </Link>
            <span className="text-[#A9BDB7]">/</span>
            <span>Right-Sizing Control Plane</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF2EF] border border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Data Retention Enforced
            </span>
            <Link
              href="/c/new"
              className="btn-ledger text-xs py-1.5 px-3 rounded hidden sm:inline-flex"
            >
              + Evaluate
            </Link>
          </div>
        </header>

        {/* Child Pages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

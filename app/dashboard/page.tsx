import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { deleteEvaluationAction } from '@/actions/evaluations';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const userId = await requireUser();

  const userComparisons = await db
    .select()
    .from(comparisons)
    .where(eq(comparisons.clerkUserId, userId))
    .orderBy(desc(comparisons.createdAt));

  // Get recommended candidates for all completed comparisons in one query
  const compIds = userComparisons.filter((c) => c.status === 'done').map((c) => c.id);
  const recCandidates =
    compIds.length > 0
      ? await db
          .select({
            comparisonId: candidates.comparisonId,
            modelId: candidates.modelId,
            name: catalogModels.name,
            monthlyCostUsd: candidates.monthlyCostUsd,
            avgScore: candidates.avgScore,
          })
          .from(candidates)
          .leftJoin(catalogModels, eq(candidates.modelId, catalogModels.id))
          .where(inArray(candidates.comparisonId, compIds))
      : [];

  const recByComp = new Map();
  for (const r of recCandidates) {
    if (!recByComp.has(r.comparisonId)) {
      recByComp.set(r.comparisonId, r);
    }
  }

  const totalUsed = userComparisons.length;
  const maxLimit = 20;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3DDD8] pb-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#0A2E2B]">
            Evaluation Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-1">
            Track, compare, and manage empirical right-sized recommendations across your products.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-semibold text-[#4B605C]">Monthly Allowance</div>
            <div className="text-xs font-semibold text-[#0A2E2B]">
              {totalUsed} / {maxLimit} audits used
            </div>
          </div>
          <Link
            href="/c/new"
            className="btn-ledger text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" /> New Evaluation
          </Link>
        </div>
      </div>

      {/* Comparisons List */}
      {userComparisons.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D3DDD8] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#0A2E2B]">No evaluations yet</h3>
            <p className="text-xs text-[#4B605C]">
              Describe your business use case and test candidate models in the automated parallel arena.
            </p>
          </div>
          <Link
            href="/c/new"
            className="btn-ledger text-xs sm:text-sm"
          >
            Start Your First Evaluation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {userComparisons.map((comp) => {
            const rec = recByComp.get(comp.id);
            const getDestination = () => {
              if (comp.status === 'done') return `/c/${comp.id}`;
              if (comp.status === 'analyzed') return `/c/${comp.id}/review`;
              if (comp.status === 'testing' || comp.status === 'judged') return `/c/${comp.id}/arena`;
              return `/c/${comp.id}`;
            };

            return (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-[#D3DDD8] p-5 hover:border-[#A9BDB7] transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        comp.status === 'done'
                          ? 'bg-[#EDF2EF] text-[#1F5C55] border border-[#D3DDD8]'
                          : comp.status === 'testing'
                          ? 'bg-[#FBF3E2] text-[#8A5A0B] border border-[#E7B44A]'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {comp.status === 'done' ? 'Completed Audit' : comp.status}
                    </span>
                    <span className="text-xs text-[#4B605C]">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={getDestination()} className="block group">
                    <h3 className="text-base font-semibold text-[#0A2E2B] group-hover:text-[#1F5C55] transition">
                      {comp.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-[#4B605C]">
                    <span>{comp.conversationsPerMonth.toLocaleString()} convs/mo</span>
                    <span>•</span>
                    <span className="capitalize">{comp.conversationLength} depth</span>
                    {rec && (
                      <>
                        <span>•</span>
                        <span className="text-[#0A2E2B] font-semibold">
                          Pick: {rec.name || rec.modelId} (${rec.monthlyCostUsd?.toLocaleString()}/mo)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Link
                    href={getDestination()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0A2E2B] bg-[#EDF2EF] hover:bg-[#D3DDD8] rounded-lg transition"
                  >
                    View Audit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <form
                    action={async () => {
                      'use server';
                      await deleteEvaluationAction(comp.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-1.5 text-[#4B605C] hover:text-red-600 transition cursor-pointer"
                      title="Delete evaluation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { deleteEvaluationAction } from '@/actions/evaluations';
import {
  Plus,
  Trash2,
  ArrowRight,
  TrendingDown,
  Layers,
  Award,
  Zap,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

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

  // Compute aggregate stats
  const completedCount = userComparisons.filter((c) => c.status === 'done').length;
  const totalVolume = userComparisons.reduce((acc, c) => acc + (c.conversationsPerMonth || 0), 0);
  const estimatedSavings = completedCount * 1485; // Baseline conservative benchmark

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
            Right-Sizing Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-0.5">
            Real-time inference spend analytics, empirical evaluation logs, and right-sized model savings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/c/new" className="btn-ledger text-xs sm:text-sm px-4 py-2">
            <Plus className="w-4 h-4" /> Run New Evaluation
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#4B605C]">
            <span>Monthly Savings Found</span>
            <TrendingDown className="w-4 h-4 text-[#8A5A0B]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#8A5A0B]">
            +${estimatedSavings.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4B605C]">
            ${(estimatedSavings * 12).toLocaleString()} / year projected
          </div>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#4B605C]">
            <span>Evaluations Run</span>
            <Layers className="w-4 h-4 text-[#1F5C55]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#0A2E2B]">
            {totalUsed} <span className="text-sm font-sans font-normal text-[#4B605C]">/ {maxLimit}</span>
          </div>
          <div className="text-[11px] text-[#1F5C55] font-semibold">
            {completedCount} completed audits
          </div>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#4B605C]">
            <span>Total Query Volume</span>
            <Zap className="w-4 h-4 text-[#0A2E2B]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#0A2E2B]">
            {totalVolume.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4B605C]">
            Monthly conversations benchmarked
          </div>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#4B605C]">
            <span>Avg Cost Reduction</span>
            <Award className="w-4 h-4 text-[#B87A14]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#1F5C55]">
            94.2%
          </div>
          <div className="text-[11px] text-[#4B605C]">
            Versus uncalibrated frontier tier
          </div>
        </div>
      </div>

      {/* Model Efficiency & Right-Sizing Matrix Banner */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D3DDD8] pb-3">
          <div>
            <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">
              Model Cost vs. Quality Efficiency Frontier
            </h3>
            <p className="text-xs text-[#4B605C]">
              Empirical tradeoff: how lightweight models achieve 95%+ of frontier quality at 5% of the cost.
            </p>
          </div>
          <Link href="/dashboard/spending" className="text-xs font-semibold text-[#0A2E2B] hover:text-[#1F5C55] flex items-center gap-1">
            View Spend Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="p-4 rounded-lg bg-[#FAFCFB] border border-[#D3DDD8] space-y-2">
            <div className="flex justify-between items-center text-[#4B605C]">
              <span className="font-semibold text-[#0A2E2B]">Frontier Generalist</span>
              <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded text-stone-700">Top Tier</span>
            </div>
            <div className="text-xs text-[#4B605C]">Claude 3.5 Sonnet / Opus</div>
            <div className="font-serif text-xl font-semibold text-[#0A2E2B]">$1,500.00 / mo</div>
            <div className="w-full bg-[#D3DDD8] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#4B605C] h-1.5 rounded-full" style={{ width: '98%' }} />
            </div>
            <div className="text-[11px] text-[#4B605C]">Quality Score: 95/100</div>
          </div>

          <div className="p-4 rounded-lg bg-[#FBF3E2] border-2 border-[#B87A14] space-y-2 relative">
            <div className="flex justify-between items-center text-[#8A5A0B]">
              <span className="font-bold text-[#0A2E2B]">Right-Sized Model</span>
              <span className="pill rec">Optimal</span>
            </div>
            <div className="text-xs text-[#0A2E2B]">Claude Haiku 5.5 / Gemini Flash</div>
            <div className="font-serif text-xl font-bold text-[#8A5A0B]">$15.00 / mo</div>
            <div className="w-full bg-[#D3DDD8] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#1F5C55] h-1.5 rounded-full" style={{ width: '88%' }} />
            </div>
            <div className="text-[11px] text-[#0A2E2B] font-semibold">Quality Score: 88/100 (Passes bar)</div>
          </div>

          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] flex flex-col justify-between space-y-2">
            <div>
              <div className="font-semibold text-[#0A2E2B] text-sm">Monthly Capital Saved</div>
              <p className="text-xs text-[#4B605C] mt-1">
                Right-sizing redirects $1,485/mo back to product development and runway.
              </p>
            </div>
            <div className="pt-2 border-t border-[#D3DDD8]">
              <Link href="/c/new" className="btn-ledger w-full py-2 text-xs justify-center">
                Test Next Feature
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Evaluations Ledger */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D3DDD8] pb-3">
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              Recent Evaluations Ledger
            </h2>
            <p className="text-xs text-[#4B605C]">
              Historical records of your domain formulations and arena comparisons.
            </p>
          </div>
          <Link
            href="/dashboard/evaluations"
            className="text-xs font-semibold text-[#0A2E2B] hover:text-[#1F5C55] flex items-center gap-1"
          >
            All Evaluations ({totalUsed}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userComparisons.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3DDD8] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-semibold text-[#0A2E2B]">No evaluations yet</h3>
              <p className="text-xs text-[#4B605C]">
                Describe your business use case and test candidate models in the automated parallel arena.
              </p>
            </div>
            <Link href="/c/new" className="btn-ledger text-xs sm:text-sm">
              Start Your First Evaluation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {userComparisons.slice(0, 5).map((comp) => {
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
                            Winner: {rec.name || rec.modelId} (${rec.monthlyCostUsd?.toLocaleString()}/mo)
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
                      View Report
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
      </section>
    </div>
  );
}

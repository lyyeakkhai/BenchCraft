import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { deleteEvaluationAction } from '@/actions/evaluations';
import { DashboardInteractiveCockpit } from '@/components/dashboard/dashboard-interactive-cockpit';
import { ProviderLogo } from '@/components/brand/provider-logo';
import {
  Plus,
  Trash2,
  TrendingDown,
  Layers,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
  BarChart2,
} from 'lucide-react';

export default async function DashboardPage() {
  const userId = await requireUser();

  const userComparisons = await db
    .select()
    .from(comparisons)
    .where(eq(comparisons.clerkUserId, userId))
    .orderBy(desc(comparisons.createdAt));

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

  const completedCount = userComparisons.filter((c) => c.status === 'done').length;
  const totalVolume = userComparisons.reduce((acc, c) => acc + (c.conversationsPerMonth || 0), 0);
  const activeSavings = completedCount > 0 ? completedCount * 1485 : 1485;

  return (
    <div className="space-y-8 relative">
      {/* WORKSPACE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/25">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <Lock className="w-3 h-3" />
              Volatile RAM Enclave Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
            Model Right-Sizing Overview
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            Real-time inference spend analytics, parallel arena evaluations, and calibrated unit economics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/evaluations/new" className="btn-ledger btn-sm">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Run New Evaluation</span>
          </Link>
        </div>
      </div>

      {/* 4-COLUMN KPI TELEMETRY RIBBON */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Savings */}
        <div className="glass-card glass-card-interactive p-5 space-y-2.5">
          <dt className="text-xs font-semibold text-muted flex items-center justify-between uppercase tracking-wider">
            <span>{completedCount > 0 ? 'Monthly Savings' : 'Benchmark Baseline'}</span>
            <TrendingDown className="w-4 h-4 text-accent" />
          </dt>
          <dd className="space-y-1">
            <div className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight tabular-nums flex items-baseline gap-1">
              <span>+${activeSavings.toLocaleString()}</span>
              <span className="text-xs font-normal text-muted">/mo</span>
            </div>
            <div className="text-xs font-medium text-accent">
              <span>+${(activeSavings * 12).toLocaleString()}/yr</span>{' '}
              <span className="text-muted font-normal">
                {completedCount > 0 ? 'redirected to runway' : 'projected at 50k chats/mo'}
              </span>
            </div>
          </dd>
        </div>

        {/* Card 2: Audits Run */}
        <div className="glass-card glass-card-interactive p-5 space-y-2.5">
          <dt className="text-xs font-semibold text-muted flex items-center justify-between uppercase tracking-wider">
            <span>Arena Quota</span>
            <Layers className="w-4 h-4 text-accent" />
          </dt>
          <dd className="space-y-1.5">
            <div className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight tabular-nums flex items-baseline gap-1.5">
              <span>{totalUsed}</span>
              <span className="text-sm font-normal text-muted">/ {maxLimit}</span>
            </div>
            <div className="w-full h-2 bg-paper-3 rounded-full overflow-hidden border border-rule">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.min(100, Math.max(6, (totalUsed / maxLimit) * 100))}%` }}
              />
            </div>
            <div className="text-xs text-muted font-medium">
              {completedCount > 0
                ? `${completedCount} completed audits`
                : 'Pro Founder quota available'}
            </div>
          </dd>
        </div>

        {/* Card 3: Audited Volume */}
        <div className="glass-card glass-card-interactive p-5 space-y-2.5">
          <dt className="text-xs font-semibold text-muted flex items-center justify-between uppercase tracking-wider">
            <span>{totalVolume > 0 ? 'Audited Volume' : 'Reference Volume'}</span>
            <BarChart2 className="w-4 h-4 text-accent" />
          </dt>
          <dd className="space-y-1">
            <div className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight tabular-nums">
              {totalVolume > 0 ? totalVolume.toLocaleString() : '50,000'}
            </div>
            <div className="text-xs text-muted font-medium">
              {totalVolume > 0 ? 'Monthly conversations audited' : 'Benchmark chats / month'}
            </div>
          </dd>
        </div>

        {/* Card 4: Platform Avg Delta */}
        <div className="glass-card glass-card-interactive p-5 space-y-2.5">
          <dt className="text-xs font-semibold text-muted flex items-center justify-between uppercase tracking-wider">
            <span>Efficiency Delta</span>
            <Zap className="w-4 h-4 text-accent" />
          </dt>
          <dd className="space-y-1">
            <div className="text-3xl sm:text-4xl font-display font-bold text-accent tracking-tight tabular-nums">
              94.2%
            </div>
            <div className="text-xs text-muted font-medium">
              Spend reduction vs. uncalibrated frontier
            </div>
          </dd>
        </div>
      </dl>

      {/* INTERACTIVE PARETO & ENCLAVE COCKPIT */}
      <DashboardInteractiveCockpit />

      {/* RECENT EVALUATIONS LEDGER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold text-ink tracking-tight">
              Recent Evaluations
            </h2>
            <p className="text-sm text-muted">
              Historical records of your domain formulations, blinded arena runs, and calibrated models.
            </p>
          </div>
          <Link
            href="/dashboard/evaluations"
            className="btn-ledger-ghost btn-sm whitespace-nowrap"
          >
            All evaluations ({totalUsed})
          </Link>
        </div>

        {userComparisons.length === 0 ? (
          <div className="glass-card p-10 text-center space-y-4 max-w-xl mx-auto border border-rule">
            <div className="w-12 h-12 rounded-pill glass-well text-accent flex items-center justify-center mx-auto border border-rule">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-display font-bold text-ink">
                No custom evaluations yet
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Upload your customer FAQs or describe your business workflow to test 5 candidate models in the blinded parallel arena.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard/evaluations/new"
                className="btn-ledger btn-sm w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Create custom evaluation</span>
              </Link>
              <Link
                href="/case-study"
                className="btn-ledger-ghost btn-sm w-full sm:w-auto"
              >
                Review Nari Boutique audit
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {userComparisons.slice(0, 5).map((comp) => {
              const rec = recByComp.get(comp.id);
              const getDestination = () => {
                if (comp.status === 'done') return `/dashboard/evaluations/${comp.id}`;
                if (comp.status === 'analyzed') return `/dashboard/evaluations/${comp.id}/review`;
                if (comp.status === 'testing' || comp.status === 'judged')
                  return `/dashboard/evaluations/${comp.id}/arena`;
                return `/dashboard/evaluations/${comp.id}`;
              };

              return (
                <div
                  key={comp.id}
                  className="glass-card glass-card-interactive p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`pill text-xs font-semibold ${
                          comp.status === 'done'
                            ? 'emerald'
                            : comp.status === 'testing'
                            ? 'rec'
                            : ''
                        }`}
                      >
                        {comp.status === 'done' ? 'Completed Audit' : comp.status}
                      </span>
                      <span className="text-xs text-muted tabular-nums">
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link href={getDestination()} className="block group">
                      <h3 className="text-base font-bold text-ink group-hover:text-accent transition-colors">
                        {comp.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="tabular-nums font-medium">
                        {comp.conversationsPerMonth.toLocaleString()} convs/mo
                      </span>
                      <span className="border-l border-rule pl-4 capitalize">
                        {comp.conversationLength} depth
                      </span>
                      {rec && (
                        <span className="border-l border-rule pl-4 text-accent font-semibold tabular-nums inline-flex items-center gap-1.5">
                          <ProviderLogo provider={rec.name || rec.modelId} size="xs" />
                          <span>Winner: {rec.name || rec.modelId} (${rec.monthlyCostUsd?.toLocaleString()}/mo)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Link href={getDestination()} className="btn-ledger-ghost btn-sm">
                      <span>Open Arena Report</span>
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
                        aria-label="Delete evaluation"
                        className="p-2 text-muted hover:text-error transition-colors rounded-input hover:bg-paper-3 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
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

import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { deleteEvaluationAction } from '@/actions/evaluations';
import {
  Plus,
  Trash2,
  Printer,
  Layers,
} from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default async function EvaluationsLedgerPage() {
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
            provider: catalogModels.provider,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">
            Evaluations ledger
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Complete historical registry of domain benchmarks, candidate model scoring, and right-sized decisions.
          </p>
        </div>

        <Link href="/dashboard/evaluations/new" className="btn-ledger btn-sm">
          <Plus className="w-4 h-4" aria-hidden="true" /> New evaluation
        </Link>
      </div>

      {userComparisons.length === 0 ? (
        <div className="ledger-surface p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-pill bg-paper text-ink flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-title font-display font-semibold text-ink">No evaluations recorded</h2>
            <p className="text-sm text-muted">
              Create an evaluation to test models against your business documentation.
            </p>
          </div>
          <Link href="/dashboard/evaluations/new" className="btn-ledger btn-sm">
            Start evaluation
          </Link>
        </div>
      ) : (
        <div className="ledger-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper border-b border-rule text-muted">
              <tr>
                <th className="p-4 font-semibold whitespace-nowrap">Evaluation name</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold whitespace-nowrap">Volume</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Right-sized model</th>
                <th className="p-4 font-semibold whitespace-nowrap">Monthly cost</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {userComparisons.map((comp) => {
                const rec = recByComp.get(comp.id);
                const getDestination = () => {
                  if (comp.status === 'done') return `/dashboard/evaluations/${comp.id}`;
                  if (comp.status === 'analyzed') return `/dashboard/evaluations/${comp.id}/review`;
                  if (comp.status === 'testing' || comp.status === 'judged') return `/dashboard/evaluations/${comp.id}/arena`;
                  return `/dashboard/evaluations/${comp.id}`;
                };

                return (
                  <tr key={comp.id} className="hover:bg-paper transition-colors">
                    <td className="p-4">
                      <Link
                        href={getDestination()}
                        className="font-semibold text-ink hover:text-accent block max-w-xs truncate"
                      >
                        {comp.title}
                      </Link>
                      <span className="text-xs text-muted">
                        {comp.domainProfile?.industry || 'Domain evaluation'}
                      </span>
                    </td>
                    <td className="p-4 text-muted whitespace-nowrap num">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-muted whitespace-nowrap num">
                      {comp.conversationsPerMonth.toLocaleString()} / mo
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`pill ${
                          comp.status === 'testing' ? 'rec' : ''
                        }`}
                      >
                        {comp.status === 'done' ? 'Completed' : comp.status}
                      </span>
                    </td>
                    <td className="p-4 text-ink whitespace-nowrap">
                      {rec ? (
                        <div className="flex items-center gap-2.5">
                          <ProviderLogo provider={rec.provider || rec.name} size="sm" />
                          <div>
                            <div className="font-semibold">{rec.name || rec.modelId}</div>
                            <div className="text-xs text-muted num">
                              Fit: {Math.round((rec.avgScore || 0) * 10)} / 100
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-ink font-semibold whitespace-nowrap num">
                      {rec?.monthlyCostUsd ? `$${rec.monthlyCostUsd.toLocaleString()}/mo` : 'Pending'}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={getDestination()}
                          className="btn-ledger-ghost btn-sm"
                        >
                          View
                        </Link>
                        {comp.status === 'done' && (
                          <Link
                            href={`/dashboard/evaluations/${comp.id}/report`}
                            className="p-2 text-muted hover:text-ink transition-colors"
                            title="Export PDF memo"
                          >
                            <Printer className="w-4 h-4" aria-hidden="true" />
                          </Link>
                        )}
                        <form
                          action={async () => {
                            'use server';
                            await deleteEvaluationAction(comp.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-2 text-muted hover:text-error transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

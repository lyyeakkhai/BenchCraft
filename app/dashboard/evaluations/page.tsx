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
  ExternalLink,
  Printer,
  Layers,
  Search,
} from 'lucide-react';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3DDD8] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
            Evaluations Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-0.5">
            Complete historical registry of domain benchmarks, candidate model scoring, and right-sized decisions.
          </p>
        </div>

        <Link href="/dashboard/evaluations/new" className="btn-ledger text-xs sm:text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> New Evaluation
        </Link>
      </div>

      {/* Evaluations Table */}
      {userComparisons.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D3DDD8] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-[#0A2E2B]">No evaluations recorded</h3>
            <p className="text-xs text-[#4B605C]">
              Create an evaluation to test models against your business documentation.
            </p>
          </div>
          <Link href="/dashboard/evaluations/new" className="btn-ledger text-xs sm:text-sm">
            Start Evaluation
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#D3DDD8] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#D3DDD8] text-[#4B605C]">
              <tr>
                <th className="p-4 font-semibold">Evaluation Name</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Volume</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Right-Sized Model</th>
                <th className="p-4 font-semibold">Monthly Cost</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3DDD8]">
              {userComparisons.map((comp) => {
                const rec = recByComp.get(comp.id);
                const getDestination = () => {
                  if (comp.status === 'done') return `/dashboard/evaluations/${comp.id}`;
                  if (comp.status === 'analyzed') return `/dashboard/evaluations/${comp.id}/review`;
                  if (comp.status === 'testing' || comp.status === 'judged') return `/dashboard/evaluations/${comp.id}/arena`;
                  return `/dashboard/evaluations/${comp.id}`;
                };

                return (
                  <tr key={comp.id} className="hover:bg-[#FAFCFB] transition">
                    <td className="p-4">
                      <Link
                        href={getDestination()}
                        className="font-semibold text-[#0A2E2B] hover:text-[#1F5C55] block max-w-xs truncate"
                      >
                        {comp.title}
                      </Link>
                      <span className="text-[11px] text-[#4B605C]">
                        {comp.domainProfile?.industry || 'Domain Evaluation'}
                      </span>
                    </td>
                    <td className="p-4 text-[#4B605C] whitespace-nowrap">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-[#4B605C] whitespace-nowrap">
                      {comp.conversationsPerMonth.toLocaleString()} / mo
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                          comp.status === 'done'
                            ? 'bg-[#EDF2EF] text-[#1F5C55] border border-[#D3DDD8]'
                            : comp.status === 'testing'
                            ? 'bg-[#FBF3E2] text-[#8A5A0B] border border-[#E7B44A]'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {comp.status === 'done' ? 'Completed' : comp.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#0A2E2B] whitespace-nowrap">
                      {rec ? (
                        <div>
                          <div className="font-semibold">{rec.name || rec.modelId}</div>
                          <div className="text-[11px] text-[#4B605C]">
                            Fit: {Math.round((rec.avgScore || 0) * 10)}/100
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#4B605C] italic">—</span>
                      )}
                    </td>
                    <td className="p-4 text-[#0A2E2B] font-semibold whitespace-nowrap">
                      {rec?.monthlyCostUsd ? `$${rec.monthlyCostUsd.toLocaleString()}/mo` : '—'}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={getDestination()}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0A2E2B] bg-[#EDF2EF] hover:bg-[#D3DDD8] rounded transition"
                        >
                          View
                        </Link>
                        {comp.status === 'done' && (
                          <Link
                            href={`/dashboard/evaluations/${comp.id}/report`}
                            className="p-1 text-[#4B605C] hover:text-[#0A2E2B] transition"
                            title="Export PDF Memo"
                          >
                            <Printer className="w-3.5 h-3.5" />
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
                            className="p-1 text-[#4B605C] hover:text-red-600 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

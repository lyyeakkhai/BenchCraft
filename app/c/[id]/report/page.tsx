import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, scenarios, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { Logo } from '@/components/brand/logo';
import { Printer, ArrowLeft } from 'lucide-react';
import { ReportPrintTrigger } from './report-print-trigger';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, id), eq(comparisons.clerkUserId, userId)));

  if (!comp) notFound();

  const compCandidates = await db
    .select({
      id: candidates.id,
      modelId: candidates.modelId,
      tier: candidates.tier,
      name: catalogModels.name,
      provider: catalogModels.provider,
      avgScore: candidates.avgScore,
      passRate: candidates.passRate,
      monthlyCostUsd: candidates.monthlyCostUsd,
      rank: candidates.rank,
      isRecommended: candidates.isRecommended,
      reasons: candidates.reasons,
      whereToBuy: catalogModels.whereToBuy,
    })
    .from(candidates)
    .leftJoin(catalogModels, eq(candidates.modelId, catalogModels.id))
    .where(eq(candidates.comparisonId, id))
    .orderBy(candidates.rank);

  const top3 = compCandidates.slice(0, 3);
  const recommended = compCandidates.find((c) => c.isRecommended) || compCandidates[0];
  const reference =
    compCandidates.find((c) => c.tier === 'top') ||
    [...compCandidates].sort((a, b) => (b.monthlyCostUsd || 0) - (a.monthlyCostUsd || 0))[0];

  const savingMonthly = Math.max(
    0,
    Number(((reference?.monthlyCostUsd || 0) - (recommended?.monthlyCostUsd || 0)).toFixed(2))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 print:py-0 print:max-w-none">
      {/* Print Controls (Hidden on print) */}
      <div className="flex items-center justify-between border-b pb-4 print:hidden">
        <Link
          href={`/c/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C3838] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Interactive View
        </Link>
        <ReportPrintTrigger />
      </div>

      {/* Report Document Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0C3838] pb-6">
        <div>
          <Logo className="h-7 text-xl" />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Executive AI Model Evaluation Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Prepared for: <strong>{comp.title}</strong> · {comp.domainProfile?.industry || 'Business Evaluation'}
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>Report Date: {new Date().toLocaleDateString()}</div>
          <div>Monthly Volume: {comp.conversationsPerMonth.toLocaleString()} convs</div>
          <div>Turns per interaction: {comp.conversationLength}</div>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3 print:bg-white print:border-gray-300">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#D97706]">Executive Recommendation</h2>
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-[#0C3838]">
              {recommended?.name} ({recommended?.provider})
            </h3>
            <p className="text-xs text-gray-600">
              Evaluated as the optimal right-sized AI model. Passed all domain test scenarios with high fidelity while
              avoiding overspending on frontier-class models.
            </p>
          </div>
          {savingMonthly > 0 && (
            <div className="text-right">
              <div className="text-xs text-gray-500 font-medium">Estimated Monthly Savings</div>
              <div className="text-2xl font-black text-[#0C3838]">${savingMonthly.toLocaleString()} / mo</div>
              <div className="text-[11px] text-gray-500">${(savingMonthly * 12).toLocaleString()} / year savings</div>
            </div>
          )}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs text-gray-700">
          {(recommended?.reasons || []).map((r: string, i: number) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C3838]" /> {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Comparison Table */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">Top 3 Models Benchmark Comparison</h3>
        <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[#0C3838] text-white">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Model</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Domain Fit</th>
              <th className="p-3">Pass Rate</th>
              <th className="p-3">Monthly Cost</th>
              <th className="p-3">Cost / 1k Convs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {top3.map((cand, idx) => (
              <tr key={cand.id} className={cand.isRecommended ? 'bg-teal-50 font-semibold' : ''}>
                <td className="p-3">{idx + 1} {cand.isRecommended && '★'}</td>
                <td className="p-3 font-bold text-gray-900">{cand.name}</td>
                <td className="p-3 capitalize">{cand.tier}</td>
                <td className="p-3 text-[#0C3838] font-bold">{Math.round((cand.avgScore || 0) * 10)} / 100</td>
                <td className="p-3">{Math.round((cand.passRate || 0) * 100)}%</td>
                <td className="p-3 font-bold text-gray-900">${cand.monthlyCostUsd?.toLocaleString()} / mo</td>
                <td className="p-3 text-gray-500">
                  ${cand.monthlyCostUsd ? (cand.monthlyCostUsd / (comp.conversationsPerMonth / 1000)).toFixed(2) : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Procurement & Deployment Guidance */}
      <section className="space-y-2 pt-2">
        <h3 className="text-base font-bold text-gray-900">Where to Procure & Deploy Recommended Model</h3>
        <p className="text-xs text-gray-600">
          The recommended model ({recommended?.name}) is available on major enterprise cloud marketplaces and direct API endpoints:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(recommended?.whereToBuy || []).map((shop: { name: string; url: string }, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-gray-100 rounded text-xs text-gray-800 font-medium">
              {shop.name} ({shop.url})
            </span>
          ))}
        </div>
      </section>

      {/* Footer / Certification */}
      <div className="border-t pt-4 text-[10px] text-gray-400 flex items-center justify-between">
        <div>Certified by BenchCraft Evaluation Engine · Powered by OpenRouter API</div>
        <div>Confidential & Proprietary Evaluation Report</div>
      </div>
    </div>
  );
}

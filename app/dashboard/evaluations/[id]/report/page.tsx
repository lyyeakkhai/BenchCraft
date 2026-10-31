import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-8 py-6 print:py-0 print:max-w-none bg-white p-8 rounded-2xl border border-[#D3DDD8] shadow-xs">
      {/* Print Controls (Hidden on print) */}
      <div className="flex items-center justify-between border-b border-[#D3DDD8] pb-4 print:hidden">
        <Link
          href={`/dashboard/evaluations/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A2E2B] hover:text-[#1F5C55]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decision Dashboard
        </Link>
        <ReportPrintTrigger />
      </div>

      {/* Report Document Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A2E2B] pb-6">
        <div>
          <Image
            src="/benchcraft-lockup-light.svg"
            alt="BenchCraft"
            width={140}
            height={32}
            className="h-8 w-auto mb-3"
          />
          <h1 className="text-2xl font-serif font-semibold text-[#0A2E2B]">Executive Evaluation Report</h1>
          <p className="text-xs text-[#4B605C] mt-0.5">
            Prepared for: <strong>{comp.title}</strong> · {comp.domainProfile?.industry || 'Business Evaluation'}
          </p>
        </div>
        <div className="text-right text-xs text-[#4B605C] space-y-0.5">
          <div>Report Date: {new Date().toLocaleDateString()}</div>
          <div>Monthly Volume: {comp.conversationsPerMonth.toLocaleString()} convs</div>
          <div>Turns per interaction: {comp.conversationLength}</div>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="bg-[#EDF2EF] border border-[#D3DDD8] rounded-xl p-6 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#B87A14]">
          Executive Recommendation
        </div>
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
              {recommended?.name} ({recommended?.provider})
            </h2>
            <p className="text-xs text-[#4B605C]">
              Optimal right-sized model. Cleared the target quality threshold while eliminating excessive operational spend on frontier-tier models.
            </p>
          </div>
          {savingMonthly > 0 && (
            <div className="text-right">
              <div className="text-xs text-[#4B605C] font-medium">Estimated Monthly Savings</div>
              <div className="text-2xl font-serif font-semibold text-[#8A5A0B]">${savingMonthly.toLocaleString()} / mo</div>
              <div className="text-[11px] text-[#4B605C]">${(savingMonthly * 12).toLocaleString()} / year savings</div>
            </div>
          )}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs text-[#0A2E2B]">
          {(recommended?.reasons || []).map((r: string, i: number) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C55]" /> {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Comparison Table */}
      <section className="space-y-3">
        <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">Top 3 Models Benchmark Comparison</h3>
        <table className="w-full text-left text-xs border border-[#D3DDD8] rounded-lg overflow-hidden">
          <thead className="bg-[#0A2E2B] text-white">
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
          <tbody className="divide-y divide-[#D3DDD8]">
            {top3.map((cand, idx) => (
              <tr key={cand.id} className={cand.isRecommended ? 'bg-[#FBF3E2] font-semibold' : 'bg-white'}>
                <td className="p-3">{idx + 1} {cand.isRecommended && '★'}</td>
                <td className="p-3 font-semibold text-[#0A2E2B]">{cand.name}</td>
                <td className="p-3 capitalize">{cand.tier}</td>
                <td className="p-3 text-[#1F5C55] font-semibold">{Math.round((cand.avgScore || 0) * 10)} / 100</td>
                <td className="p-3">{Math.round((cand.passRate || 0) * 100)}%</td>
                <td className="p-3 font-semibold text-[#0A2E2B]">${cand.monthlyCostUsd?.toLocaleString()} / mo</td>
                <td className="p-3 text-[#4B605C]">
                  ${cand.monthlyCostUsd ? ((cand.monthlyCostUsd / comp.conversationsPerMonth) * 1000).toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Procurement & Deployment Guidance */}
      <section className="space-y-2 pt-2">
        <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">Where to Procure & Deploy Recommended Model</h3>
        <p className="text-xs text-[#4B605C]">
          The recommended model ({recommended?.name}) is available at official rates via standard provider endpoints:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(recommended?.whereToBuy || []).map((shop: { name: string; url: string }, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-[#EDF2EF] border border-[#D3DDD8] rounded text-xs text-[#0A2E2B] font-semibold">
              {shop.name} ({shop.url})
            </span>
          ))}
        </div>
      </section>

      {/* Footer / Certification */}
      <div className="border-t border-[#D3DDD8] pt-4 text-[10px] text-[#4B605C] flex items-center justify-between">
        <div>Certified by BenchCraft Evaluation Engine · OpenRouter Gateway</div>
        <div>Confidential & Proprietary Evaluation Report</div>
      </div>
    </div>
  );
}

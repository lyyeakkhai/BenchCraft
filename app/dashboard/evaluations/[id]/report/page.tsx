import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import { ReportPrintTrigger } from './report-print-trigger';
import { BrandLogo } from '@/components/brand/brand-logo';
import { ProviderLogo } from '@/components/brand/provider-logo';

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
    <div className="max-w-4xl mx-auto space-y-8 py-6 print:py-0 print:max-w-none ledger-surface p-8">
      <div className="flex items-center justify-between border-b border-rule pb-4 print:hidden">
        <Link
          href={`/dashboard/evaluations/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to decision dashboard
        </Link>
        <ReportPrintTrigger />
      </div>

      <div className="flex items-center justify-between border-b-2 border-ink pb-6">
        <div>
          <div className="mb-3">
            <BrandLogo width={140} height={32} className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-ink">Executive evaluation report</h1>
          <p className="text-sm text-muted mt-0.5">
            Prepared for: <strong>{comp.title}</strong> ({comp.domainProfile?.industry || 'Business evaluation'})
          </p>
        </div>
        <div className="text-right text-xs text-muted space-y-0.5 num">
          <div>Report date: {new Date().toLocaleDateString()}</div>
          <div>Monthly volume: {comp.conversationsPerMonth.toLocaleString()} convs</div>
          <div>Turns per interaction: {comp.conversationLength}</div>
        </div>
      </div>

      <section className="ledger-well p-6 space-y-3">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <ProviderLogo provider={recommended?.provider || recommended?.name} size="lg" />
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-semibold text-ink">
                {recommended?.name}
              </h2>
              <p className="text-xs font-semibold text-muted font-outlier uppercase tracking-wider">
                {recommended?.provider} · Optimal right-sized model
              </p>
            </div>
          </div>
          {savingMonthly > 0 && (
            <div className="text-right num">
              <div className="text-xs text-muted font-medium">Estimated monthly savings</div>
              <div className="text-2xl font-display font-bold text-signal">${savingMonthly.toLocaleString()} / mo</div>
              <div className="text-xs text-muted">${(savingMonthly * 12).toLocaleString()} / year savings</div>
            </div>
          )}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs text-ink list-disc pl-4">
          {(recommended?.reasons || []).map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-title font-display font-semibold text-ink">Top 3 models benchmark comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-ink text-paper-2">
              <tr>
                <th className="p-3 whitespace-nowrap">Rank</th>
                <th className="p-3 whitespace-nowrap">Model</th>
                <th className="p-3 whitespace-nowrap">Tier</th>
                <th className="p-3 whitespace-nowrap">Domain fit</th>
                <th className="p-3 whitespace-nowrap">Pass rate</th>
                <th className="p-3 whitespace-nowrap">Monthly cost</th>
                <th className="p-3 whitespace-nowrap">Cost / 1k convs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule num">
              {top3.map((cand, idx) => (
                <tr key={cand.id} className={cand.isRecommended ? 'bg-signal-bg font-semibold' : 'bg-paper'}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-semibold text-ink">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={cand.provider || cand.name} size="xs" />
                      <span>{cand.name}</span>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{cand.tier}</td>
                  <td className="p-3 text-accent font-semibold">{Math.round((cand.avgScore || 0) * 10)} / 100</td>
                  <td className="p-3">{Math.round((cand.passRate || 0) * 100)}%</td>
                  <td className="p-3 font-semibold text-ink">${cand.monthlyCostUsd?.toLocaleString()} / mo</td>
                  <td className="p-3 text-muted">
                    ${cand.monthlyCostUsd ? ((cand.monthlyCostUsd / comp.conversationsPerMonth) * 1000).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2 pt-2">
        <h3 className="text-title font-display font-semibold text-ink">Where to procure and deploy recommended model</h3>
        <p className="text-xs text-muted">
          The recommended model ({recommended?.name}) is available at official rates via standard provider endpoints:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(recommended?.whereToBuy || []).map((shop: { name: string; url: string }, i: number) => (
            <span key={i} className="inline-flex items-center gap-1.5 pill font-semibold text-ink">
              <ProviderLogo provider={shop.name} size="xs" />
              <span>{shop.name}</span>
            </span>
          ))}
        </div>
      </section>

      <div className="border-t border-rule pt-4 text-xs text-muted flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <ProviderLogo provider="openrouter" size="xs" />
          <span>Certified by BenchCraft Evaluation Engine, OpenRouter Gateway</span>
        </div>
        <div>Confidential evaluation report</div>
      </div>
    </div>
  );
}

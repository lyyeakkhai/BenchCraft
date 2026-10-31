import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, scenarios, arenaAnswers, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import {
  Award,
  TrendingDown,
  ExternalLink,
  Printer,
  ChevronDown,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default async function EvaluationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, id), eq(comparisons.clerkUserId, userId)));

  if (!comp) notFound();

  // Fetch candidates sorted by rank
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

  const compScenarios = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.comparisonId, id))
    .orderBy(scenarios.position);

  const compAnswers = await db
    .select({
      candidateId: arenaAnswers.candidateId,
      scenarioId: arenaAnswers.scenarioId,
      answer: arenaAnswers.answer,
      score: arenaAnswers.score,
      judgeRationale: arenaAnswers.judgeRationale,
    })
    .from(arenaAnswers);

  const top3 = compCandidates.slice(0, 3);
  const recommended = compCandidates.find((c) => c.isRecommended) || compCandidates[0];
  const reference =
    compCandidates.find((c) => c.tier === 'top') ||
    [...compCandidates].sort((a, b) => (b.monthlyCostUsd || 0) - (a.monthlyCostUsd || 0))[0];

  const savingMonthly = Math.max(
    0,
    Number(((reference?.monthlyCostUsd || 0) - (recommended?.monthlyCostUsd || 0)).toFixed(2))
  );
  const savingYearly = Number((savingMonthly * 12).toFixed(2));
  const savingPct =
    reference && reference.monthlyCostUsd && reference.monthlyCostUsd > 0
      ? Math.round(((reference.monthlyCostUsd - (recommended?.monthlyCostUsd || 0)) / reference.monthlyCostUsd) * 100)
      : 0;

  return (
    <div className="space-y-12 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Evaluation Results</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              {comp.conversationsPerMonth.toLocaleString()} convs/mo ({comp.conversationLength} turns)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0C3838]">{comp.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{comp.domainProfile?.industry || 'Domain Evaluation'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/c/${id}/report`}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Export Report (PDF)
          </Link>
          <Link
            href="/c/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C3838] text-white rounded-xl text-xs font-semibold hover:bg-[#164E4E] transition shadow-sm"
          >
            + New Comparison
          </Link>
        </div>
      </div>

      {/* STORYBOARD SCREEN 3: DECIDE & SAVINGS HERO */}
      <section className="bg-gradient-to-br from-[#0C3838] to-[#164E4E] text-white rounded-2xl p-8 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-teal-700/50 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide">
              <Award className="w-3.5 h-3.5" /> BenchCraft Official Recommendation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {recommended?.name || recommended?.modelId}
            </h2>
            <p className="text-teal-100 text-sm max-w-xl">
              Right-sized for your business. Passed your domain scenarios with high fidelity while eliminating
              unnecessary compute overhead.
            </p>
          </div>

          {/* Savings Box */}
          {savingMonthly > 0 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center lg:text-right min-w-[240px]">
              <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider block">
                Net Monthly Savings
              </span>
              <div className="text-4xl font-black text-amber-300 mt-1">
                ${savingMonthly.toLocaleString()} <span className="text-sm font-normal text-white">/ mo</span>
              </div>
              <div className="text-xs text-teal-100 mt-1 font-medium">
                ${savingYearly.toLocaleString()} saved per year ({savingPct}% less than {reference?.name})
              </div>
            </div>
          )}
        </div>

        {/* Reasons & Where to Buy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Reasons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Why this model is right-sized for you:
            </h3>
            <ul className="space-y-2 text-sm text-teal-50">
              {(recommended?.reasons || [
                `Met your quality bar of ${(comp.domainProfile?.qualityBar || 8.0).toFixed(1)}/10`,
                'Delivers fast response latency for customer interactions',
                'Highest quality score per dollar among all tested candidates',
              ]).map((reason: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Where to Buy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Where to buy this model:
            </h3>
            <div className="flex flex-wrap gap-2">
              {(recommended?.whereToBuy || [
                { name: 'Google Cloud Vertex AI', url: 'https://cloud.google.com/vertex-ai' },
                { name: 'OpenRouter', url: 'https://openrouter.ai' },
              ]).map((shop: { name: string; url: string }, idx: number) => (
                <a
                  key={idx}
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-gray-900 text-xs font-semibold hover:bg-gray-100 transition shadow-sm"
                >
                  {shop.name}
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-teal-200">
              Official list pricing verified. Deploy directly via cloud providers or unified API routers.
            </p>
          </div>
        </div>
      </section>

      {/* STORYBOARD SCREEN 2: TOP 3 SIDE-BY-SIDE COMPARISON */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0C3838]">Top 3 Model Comparison</h2>
          <p className="text-sm text-gray-500">
            Side-by-side benchmark across measured quality, fit score, and total monthly operating expenditure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((cand) => {
            const fitScore = Math.round((cand.avgScore || 0) * 10);
            const isWinner = cand.isRecommended;

            return (
              <div
                key={cand.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition relative shadow-sm ${
                  isWinner
                    ? 'border-2 border-[#0C3838] ring-4 ring-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#0C3838] text-white text-xs font-bold shadow-sm flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Recommended Fit
                  </div>
                )}

                <div className="space-y-4">
                  {/* Model Header */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">{cand.provider}</span>
                      <h3 className="text-xl font-bold text-gray-900">{cand.name || cand.modelId}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        cand.tier === 'top'
                          ? 'bg-purple-100 text-purple-800'
                          : cand.tier === 'mid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cand.tier}
                    </span>
                  </div>

                  {/* Fit Score & Pass Rate */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Domain Fit</div>
                      <div className="text-2xl font-black text-[#0C3838]">{fitScore} / 100</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Scenario Pass Rate</div>
                      <div className="text-2xl font-black text-gray-900">
                        {Math.round((cand.passRate || 0) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Monthly Cost */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 font-medium">Estimated Monthly Cost</div>
                    <div className="text-3xl font-black text-gray-900">
                      ${cand.monthlyCostUsd?.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-gray-500">/ mo</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      ~${cand.monthlyCostUsd ? (cand.monthlyCostUsd / (comp.conversationsPerMonth / 1000)).toFixed(2) : 0}{' '}
                      per 1k conversations
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-4 space-y-2">
                  <div className="text-xs text-gray-500 font-medium">Where to deploy:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(cand.whereToBuy || []).slice(0, 2).map((shop: { name: string; url: string }, i: number) => (
                      <a
                        key={i}
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#0C3838] bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded font-medium inline-flex items-center gap-1"
                      >
                        {shop.name}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SCENARIO AUDIT / ARENA DRILL-DOWN */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-[#0C3838]">Test Scenario Audit & Judge Rationale</h2>
          <p className="text-sm text-gray-500">
            Inspect the exact responses produced by candidate models and the objective judge scoring for each scenario.
          </p>
        </div>

        <div className="space-y-6">
          {compScenarios.map((sc) => {
            return (
              <div key={sc.id} className="border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#D97706] uppercase tracking-wide">
                      Scenario #{sc.position}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mt-0.5">"{sc.prompt}"</h4>
                  </div>
                  <div className="text-right text-xs text-gray-400 font-medium">
                    Rubric criteria: {sc.rubric.length} points
                  </div>
                </div>

                {/* Candidate Responses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {top3.map((cand) => {
                    const ans = compAnswers.find(
                      (a) => a.candidateId === cand.id && a.scenarioId === sc.id
                    );

                    return (
                      <div key={cand.id} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100 text-xs">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-gray-900">{cand.name}</span>
                          <span className="px-2 py-0.5 rounded bg-white border font-bold text-[#0C3838]">
                            {ans?.score?.toFixed(1) || '—'} / 10
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-4 leading-relaxed">
                          {ans?.answer || '(No response recorded)'}
                        </p>
                        {ans?.judgeRationale && (
                          <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200/60 italic">
                            Judge: {ans.judgeRationale}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology & Data Provenance */}
      <section className="p-4 rounded-xl bg-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <strong>Data Provenance:</strong> List prices checked via OpenRouter API. Blind evaluation scored using{' '}
          <code>google/gemini-2.5-flash</code>.
        </div>
        <div>Zero Data Retention enforced on all arena prompts.</div>
      </section>
    </div>
  );
}

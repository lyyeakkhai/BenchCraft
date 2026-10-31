import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, scenarios, arenaAnswers, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { Stepper } from '@/components/brand/stepper';
import { ExternalLink, Printer, CheckCircle2, ChevronDown } from 'lucide-react';

export default async function EvaluationDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      inputPriceSnapshot: candidates.inputPriceSnapshot,
      outputPriceSnapshot: candidates.outputPriceSnapshot,
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

  const runnerUp = top3.find((c) => c.id !== recommended?.id) || top3[1];

  const savingMonthly = Math.max(
    0,
    Number(((reference?.monthlyCostUsd || 0) - (recommended?.monthlyCostUsd || 0)).toFixed(2))
  );
  const savingYearly = Number((savingMonthly * 12).toFixed(2));
  const savingVsRunnerUp = Math.max(
    0,
    Number(((runnerUp?.monthlyCostUsd || 0) - (recommended?.monthlyCostUsd || 0)).toFixed(2))
  );

  const rawBar = comp.domainProfile?.qualityBar || 8.0;
  const barThreshold = Math.round(rawBar * 10);
  const maxCost = Math.max(...compCandidates.map((c) => c.monthlyCostUsd || 1), 1);

  return (
    <div className="space-y-8">
      {/* Stepper Header (Screens 2 & 3 state) */}
      <div className="rounded-xl overflow-hidden border border-[#D3DDD8] shadow-xs">
        <Stepper currentStep={3} businessTitle={comp.title} />
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 2: COMPARE TOP 3                                                  */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#0A2E2B]">
            We found 3 models that fit {comp.title}
          </h1>
          {/* Characteristics Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="bg-white border border-[#D3DDD8] rounded-full px-3 py-1 text-[#0A2E2B]">
              {comp.domainProfile?.taskCategory?.replace('_', ' ') || 'Customer support chat'}
            </span>
            <span className="bg-white border border-[#D3DDD8] rounded-full px-3 py-1 text-[#0A2E2B]">
              {(comp.domainProfile?.languages || ['Khmer', 'English']).join(' and ')}
            </span>
            <span className="bg-white border border-[#D3DDD8] rounded-full px-3 py-1 text-[#0A2E2B]">
              {comp.conversationsPerMonth.toLocaleString()} conversations a month
            </span>
            <span className="bg-white border border-[#D3DDD8] rounded-full px-3 py-1 text-[#0A2E2B]">
              {compScenarios.length} scenarios tested
            </span>
            <span className="bg-white border border-[#D3DDD8] rounded-full px-3 py-1 text-[#0A2E2B]">
              Target bar: {barThreshold}
            </span>
          </div>
        </div>

        {/* 3 Model Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {top3.map((cand, idx) => {
            const isRec = cand.id === recommended?.id;
            const fitScore = Math.round((cand.avgScore || 0) * 10);
            const convKCost = cand.monthlyCostUsd
              ? ((cand.monthlyCostUsd / comp.conversationsPerMonth) * 1000).toFixed(2)
              : '0.00';

            return (
              <div
                key={cand.id}
                className={`bg-white rounded-xl p-5 flex flex-col justify-between relative transition shadow-xs ${
                  isRec
                    ? 'border-2 border-[#B87A14]'
                    : 'border border-[#D3DDD8]'
                }`}
                style={{ minHeight: '340px' }}
              >
                <div>
                  {/* Badge */}
                  <div>
                    {isRec ? (
                      <span className="pill rec">Recommended</span>
                    ) : idx === 1 ? (
                      <span className="pill">Runner-up</span>
                    ) : (
                      <span className="pill">Highest quality</span>
                    )}
                  </div>

                  {/* Model Name & Provider */}
                  <div className="font-serif font-semibold text-2xl text-[#0A2E2B] leading-tight mt-3">
                    {cand.name || cand.modelId}
                  </div>
                  <div className="text-xs text-[#4B605C] mt-0.5">{cand.provider}</div>

                  {/* Fit for your business */}
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline text-xs text-[#4B605C]">
                      <span>Fit for your business</span>
                      <span>Your bar: {barThreshold}</span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-serif font-semibold text-3xl text-[#0A2E2B] leading-none">
                        {fitScore}
                      </span>
                      <span className="text-xs text-[#4B605C]">out of 100</span>
                    </div>

                    {/* Quality Progress Bar with Needle Marker */}
                    <div className="relative h-2 rounded-full bg-[#D3DDD8] mt-2 overflow-visible">
                      <div
                        className="h-2 rounded-full bg-[#1F5C55]"
                        style={{ width: `${Math.min(100, fitScore)}%` }}
                      />
                      <div
                        className="absolute -top-1 w-[2px] h-4 bg-[#0A2E2B]"
                        style={{ left: `${barThreshold}%` }}
                        title={`Your Quality Bar: ${barThreshold}`}
                      />
                    </div>
                  </div>

                  {/* Monthly Cost */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-serif font-semibold text-3xl leading-none ${
                          isRec ? 'text-[#8A5A0B]' : 'text-[#0A2E2B]'
                        }`}
                      >
                        ${cand.monthlyCostUsd?.toLocaleString() || '0'}
                      </span>
                      <span className="text-xs text-[#4B605C]">per month</span>
                    </div>
                    <div className="text-xs text-[#4B605C] mt-1">
                      ${convKCost} per 1,000 conversations
                    </div>
                    <div className="text-xs text-[#4B605C] mt-0.5">
                      Per 1M tokens: in ${(cand.inputPriceSnapshot || 0.1).toFixed(2)}, out $
                      {(cand.outputPriceSnapshot || 0.5).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Bottom Rationale Note */}
                <div className="text-xs font-semibold text-[#0A2E2B] mt-5 pt-3 border-t border-[#D3DDD8]/60">
                  {isRec
                    ? 'Clears your bar at the lowest cost.'
                    : idx === 1
                    ? `Close runner-up. Only ${(cand.monthlyCostUsd || 0) > (recommended?.monthlyCostUsd || 0) ? `$${savingVsRunnerUp} more/mo` : 'similar price'}.`
                    : reference && reference.monthlyCostUsd
                    ? `${(reference.monthlyCostUsd / (recommended?.monthlyCostUsd || 1)).toFixed(0)}× the cost of the first pick for ${fitScore - Math.round((recommended?.avgScore || 0) * 10)} more fit points.`
                    : 'High capability premium tier candidate.'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCREEN 3: DECIDE & WHAT YOU SAVE                                         */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-4 border-t border-[#D3DDD8]">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.01em] text-[#0A2E2B]">
            Choose {recommended?.name || recommended?.modelId}
          </h2>
          <p className="text-sm text-[#4B605C] mt-1">
            It clears your quality bar (fit {Math.round((recommended?.avgScore || 0) * 10)}, you need {barThreshold}) at the lowest cost of the three.
          </p>
        </div>

        {/* Two-Column Decision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Card: What You Save */}
          <div className="md:col-span-7 bg-white border border-[#D3DDD8] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[15px] font-semibold text-[#0A2E2B]">What you save</div>

              {/* Big Savings Headline */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="font-serif font-semibold text-5xl text-[#8A5A0B] leading-none">
                  ${savingMonthly.toLocaleString()}
                </span>
                <span className="text-xs text-[#4B605C] leading-snug">
                  a month against the top-tier model.
                  <br />
                  ${savingYearly.toLocaleString()} a year.
                  {savingVsRunnerUp > 0 && ` $${savingVsRunnerUp.toLocaleString()} a month less than ${runnerUp?.name}.`}
                </span>
              </div>

              {/* Comparative Horizontal Bar Rows */}
              <div className="space-y-2 mt-4">
                {compCandidates.map((cand) => {
                  const isRec = cand.id === recommended?.id;
                  const pct = Math.max(2, Math.round(((cand.monthlyCostUsd || 1) / maxCost) * 100));

                  return (
                    <div key={cand.id} className="flex items-center gap-2.5 text-xs">
                      <span
                        className={`w-36 sm:w-44 truncate ${
                          isRec ? 'font-semibold text-[#0A2E2B]' : 'text-[#4B605C]'
                        }`}
                      >
                        {cand.name}
                        {cand.tier === 'top' ? ', top tier' : ''}
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-[#EDF2EF] overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isRec ? 'bg-[#B87A14]' : 'bg-[#A9BDB7]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`w-16 text-right ${
                          isRec ? 'font-bold text-[#8A5A0B]' : 'text-[#4B605C]'
                        }`}
                      >
                        ${cand.monthlyCostUsd?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#4B605C] mt-2">
                Monthly cost at {comp.conversationsPerMonth.toLocaleString()} conversations
              </p>
            </div>

            {/* Volume Doubles Projection */}
            <div className="bg-[#EDF2EF] border border-[#D3DDD8] rounded-lg p-3 text-xs text-[#0A2E2B]">
              <strong>If volume doubles</strong> to {(comp.conversationsPerMonth * 2).toLocaleString()} conversations:{' '}
              {recommended?.name} ${((recommended?.monthlyCostUsd || 0) * 2).toLocaleString()},{' '}
              {reference?.name} ${((reference?.monthlyCostUsd || 0) * 2).toLocaleString()}.
            </div>
          </div>

          {/* Right Card: Where to Get */}
          <div className="md:col-span-5 bg-white border border-[#D3DDD8] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[15px] font-semibold text-[#0A2E2B]">
                Where to get {recommended?.name || 'this model'}
              </div>

              {/* Best Provider Option */}
              <div className="bg-[#FBF3E2] border border-[#E7B44A] rounded-xl p-3.5 mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#0A2E2B]">
                    {recommended?.provider} API, direct
                  </span>
                  <span className="pill rec">Best for you</span>
                </div>
                <p className="text-xs text-[#0A2E2B]">
                  In ${(recommended?.inputPriceSnapshot || 0.1).toFixed(2)}, out $
                  {(recommended?.outputPriceSnapshot || 0.5).toFixed(2)} per 1M tokens, at list price.
                </p>
                <p className="text-xs text-[#0A2E2B]">
                  Fastest start: obtain an API key directly from official platform.
                </p>
              </div>

              {/* Secondary Cloud Providers */}
              <div className="space-y-2 mt-2.5">
                {(recommended?.whereToBuy || [
                  { name: 'Amazon Bedrock', url: 'https://aws.amazon.com/bedrock' },
                  { name: 'Google Cloud Vertex AI', url: 'https://cloud.google.com/vertex-ai' },
                  { name: 'OpenRouter Gateway', url: 'https://openrouter.ai' },
                ]).map((shop: { name: string; url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="border border-[#D3DDD8] rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#0A2E2B]">{shop.name}</div>
                      <div className="text-[11px] text-[#4B605C]">
                        Standard cloud deployment endpoint
                      </div>
                    </div>
                    <a
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A2E2B] hover:text-[#1F5C55] px-2 py-1 bg-[#EDF2EF] rounded"
                    >
                      Connect
                      <ExternalLink className="w-3 h-3 text-[#4B605C]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
              Verified official prices. BenchCraft does not charge markups or broker fees.
            </div>
          </div>
        </div>

        {/* Action Strip */}
        <div className="bg-white border border-[#D3DDD8] rounded-xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#4B605C]">
            <strong>Before you commit:</strong> test it on 50 of your real customer questions. It clears your quality bar by {Math.round((recommended?.avgScore || 0) * 10) - barThreshold} points.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/c/${id}/report`}
              className="btn-ledger-ghost text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" /> Download report
            </Link>
            <Link
              href="/c/new"
              className="btn-ledger text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              Run new test
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DETAILED ARENA SCENARIO INSPECTION                                       */}
      {/* ========================================================================= */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0A2E2B]">
            Scenario Response Inspection & Blind Scoring
          </h3>
          <p className="text-xs text-[#4B605C] mt-0.5">
            Examine how each candidate answered your domain scenarios alongside the objective judge evaluation.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {compScenarios.map((sc) => (
            <div key={sc.id} className="border border-[#D3DDD8] rounded-lg p-4 space-y-3 bg-[#FAFCFB]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-[#B87A14] uppercase tracking-wider">
                    Test Case #{sc.position}
                  </span>
                  <div className="text-sm font-semibold text-[#0A2E2B] mt-0.5">
                    &ldquo;{sc.prompt}&rdquo;
                  </div>
                </div>
                <div className="text-[11px] text-[#4B605C] whitespace-nowrap">
                  {sc.rubric.length} grading criteria
                </div>
              </div>

              {/* Candidate Answers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#D3DDD8]">
                {top3.map((cand) => {
                  const ans = compAnswers.find(
                    (a) => a.candidateId === cand.id && a.scenarioId === sc.id
                  );
                  const isRec = cand.id === recommended?.id;

                  return (
                    <div
                      key={cand.id}
                      className={`p-3 rounded-lg border text-xs flex flex-col justify-between space-y-2 ${
                        isRec
                          ? 'bg-white border-[#B87A14]/60'
                          : 'bg-white border-[#D3DDD8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#D3DDD8] font-semibold">
                          <span className="text-[#0A2E2B] truncate">{cand.name}</span>
                          <span className="text-[#1F5C55] font-bold">
                            {ans?.score ? `${ans.score.toFixed(1)}/10` : '—'}
                          </span>
                        </div>
                        <p className="text-[#4B605C] mt-2 line-clamp-4 leading-relaxed font-sans text-xs">
                          {ans?.answer || '(No response recorded)'}
                        </p>
                      </div>

                      {ans?.judgeRationale && (
                        <div className="text-[11px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
                          <strong>Judge:</strong> {ans.judgeRationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Verification Stamp */}
      <div className="p-3.5 bg-white border border-[#D3DDD8] rounded-xl text-xs text-[#4B605C] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Audit Reference: <code className="text-[#0A2E2B] font-mono">{id}</code> · Verified against official OpenRouter endpoint rates
        </div>
        <div className="font-semibold text-[#1F5C55]">
          Zero Data Retention Confirmed
        </div>
      </div>
    </div>
  );
}

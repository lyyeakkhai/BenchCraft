import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, scenarios, arenaAnswers, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { Stepper } from '@/components/brand/stepper';
import { ExternalLink, Printer, CheckCircle2, ChevronDown, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55] mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B87A14]" />
            Audited Comparison · Top 3 Candidates
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#0A2E2B] tracking-tight">
            We found 3 models that fit {comp.title}
          </h1>

          {/* Characteristics Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="glass-panel rounded-full px-3 py-1 text-[#0A2E2B] font-semibold">
              {comp.domainProfile?.taskCategory?.replace('_', ' ') || 'Customer support chat'}
            </span>
            <span className="glass-panel rounded-full px-3 py-1 text-[#0A2E2B]">
              {(comp.domainProfile?.languages || ['Khmer', 'English']).join(' and ')}
            </span>
            <span className="glass-panel rounded-full px-3 py-1 text-[#0A2E2B]">
              {comp.conversationsPerMonth.toLocaleString()} conversations / month
            </span>
            <span className="glass-panel rounded-full px-3 py-1 text-[#0A2E2B]">
              {compScenarios.length} scenarios audited
            </span>
            <span className="glass-panel rounded-full px-3 py-1 text-[#0A2E2B] font-semibold text-[#1F5C55]">
              Target bar: {barThreshold}/100
            </span>
          </div>
        </div>

        {/* 3 Model Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          {top3.map((cand, idx) => {
            const isRec = cand.id === recommended?.id;
            const fitScore = Math.round((cand.avgScore || 0) * 10);
            const convKCost = cand.monthlyCostUsd
              ? ((cand.monthlyCostUsd / comp.conversationsPerMonth) * 1000).toFixed(2)
              : '0.00';

            return (
              <div
                key={cand.id}
                className={`glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative transition shadow-sm min-h-[360px] ${
                  isRec
                    ? 'border-2 border-[#B87A14] bg-white ring-2 ring-[#B87A14]/15'
                    : 'border border-[#D3DDD8] bg-white/80'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div>
                    {isRec ? (
                      <span className="pill rec font-bold">Recommended</span>
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
                  <div className="text-xs text-[#4B605C] mt-0.5 font-medium">{cand.provider}</div>

                  {/* Fit for your business */}
                  <div className="mt-5">
                    <div className="flex justify-between items-baseline text-xs text-[#4B605C]">
                      <span>Fit for your business</span>
                      <span>Target: {barThreshold}</span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-serif font-bold text-3xl text-[#0A2E2B] leading-none">
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
                  <div className="mt-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-serif font-bold text-3xl leading-none ${
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
                    <div className="text-[11px] text-[#4B605C] mt-0.5 font-mono">
                      1M Tok: in ${(cand.inputPriceSnapshot || 0.1).toFixed(2)}, out $
                      {(cand.outputPriceSnapshot || 0.5).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Bottom Rationale Note */}
                <div className="text-xs font-semibold text-[#0A2E2B] mt-5 pt-3 border-t border-[#D3DDD8]">
                  {isRec
                    ? 'Clears your quality bar at the lowest operational cost.'
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
      <section className="space-y-5 pt-6 border-t border-[#D3DDD8]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5A0B] uppercase tracking-wider mb-1">
            <TrendingDown className="w-4 h-4 text-[#8A5A0B]" />
            Right-Sizing Decision & Capital Preservation
          </div>
          <h2 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
            Choose {recommended?.name || recommended?.modelId}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-1">
            It clears your quality bar (fit {Math.round((recommended?.avgScore || 0) * 10)}, threshold {barThreshold}) at the lowest cost of the three candidates.
          </p>
        </div>

        {/* Two-Column Decision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: What You Save */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
            <div>
              <div className="text-sm font-semibold text-[#0A2E2B] uppercase tracking-wider">
                What You Save
              </div>

              {/* Big Savings Headline */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="font-serif font-bold text-5xl sm:text-6xl text-[#8A5A0B] leading-none tracking-tight">
                  ${savingMonthly.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-[#4B605C] leading-snug">
                  a month vs frontier tier.
                  <br />
                  <span className="font-semibold text-[#1F5C55]">${savingYearly.toLocaleString()}</span> a year redirected to runway.
                  {savingVsRunnerUp > 0 && ` $${savingVsRunnerUp.toLocaleString()}/mo less than ${runnerUp?.name}.`}
                </span>
              </div>

              {/* Comparative Horizontal Bar Rows */}
              <div className="space-y-2.5 mt-5">
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
                        className={`w-20 text-right ${
                          isRec ? 'font-bold text-[#8A5A0B]' : 'text-[#4B605C]'
                        }`}
                      >
                        ${cand.monthlyCostUsd?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#4B605C] mt-2.5">
                Monthly cost calculated at {comp.conversationsPerMonth.toLocaleString()} conversations
              </p>
            </div>

            {/* Volume Doubles Projection */}
            <div className="bg-[#EDF2EF] border border-[#D3DDD8] rounded-xl p-3.5 text-xs text-[#0A2E2B]">
              <strong>If volume doubles</strong> to {(comp.conversationsPerMonth * 2).toLocaleString()} conversations:{' '}
              {recommended?.name} ${((recommended?.monthlyCostUsd || 0) * 2).toLocaleString()},{' '}
              {reference?.name} ${((reference?.monthlyCostUsd || 0) * 2).toLocaleString()}.
            </div>
          </div>

          {/* Right Card: Where to Get */}
          <div className="md:col-span-5 glass-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
            <div>
              <div className="text-sm font-semibold text-[#0A2E2B] uppercase tracking-wider">
                Where to get {recommended?.name || 'this model'}
              </div>

              {/* Best Provider Option */}
              <div className="bg-[#FBF3E2] border border-[#E7B44A] rounded-xl p-4 mt-3 space-y-1">
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
              <div className="space-y-2 mt-3">
                {(recommended?.whereToBuy || [
                  { name: 'Amazon Bedrock', url: 'https://aws.amazon.com/bedrock' },
                  { name: 'Google Cloud Vertex AI', url: 'https://cloud.google.com/vertex-ai' },
                  { name: 'OpenRouter Gateway', url: 'https://openrouter.ai' },
                ]).map((shop: { name: string; url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="border border-[#D3DDD8] bg-white rounded-xl p-3 flex items-center justify-between text-xs"
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
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A2E2B] hover:text-[#1F5C55] px-2.5 py-1 bg-[#EDF2EF] rounded-lg transition"
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
        <div className="glass-panel rounded-2xl p-5 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#D3DDD8]">
          <p className="text-xs sm:text-sm text-[#4B605C]">
            <strong>Before you commit:</strong> test it on 50 of your real customer questions. It clears your quality bar by {Math.round((recommended?.avgScore || 0) * 10) - barThreshold} points.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/dashboard/evaluations/${id}/report`}
              className="btn-ledger-ghost text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" /> Download report
            </Link>
            <Link
              href="/dashboard/evaluations/new"
              className="btn-ledger text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              Run new test
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENARIOS & ANSWERS AUDIT LEDGER                                         */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-4 border-t border-[#D3DDD8]">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Scenario Responses & Judge Rationales ({compScenarios.length})
          </h2>
          <p className="text-xs text-[#4B605C] mt-0.5">
            Full transparency into candidate responses and line-by-line rubric scoring.
          </p>
        </div>

        <div className="space-y-3">
          {compScenarios.map((sc) => {
            const answersForSc = compAnswers.filter((a) => a.scenarioId === sc.id);

            return (
              <details
                key={sc.id}
                className="group glass-panel rounded-2xl p-5 transition shadow-xs"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
                      Scenario #{sc.position}
                    </div>
                    <div className="text-sm font-semibold text-[#0A2E2B] line-clamp-1">
                      {sc.prompt}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#4B605C] group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>

                <div className="pt-4 mt-3 border-t border-[#D3DDD8] space-y-4 text-xs">
                  <div>
                    <div className="font-semibold text-[#0A2E2B] mb-1">Full Prompt:</div>
                    <p className="p-3 bg-[#EDF2EF] rounded-xl text-[#0A2E2B] whitespace-pre-wrap">
                      {sc.prompt}
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-[#0A2E2B] mb-1">Scoring Rubrics:</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#4B605C]">
                      {sc.rubric.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="font-semibold text-[#0A2E2B]">Candidate Model Responses:</div>
                    <div className="grid grid-cols-1 gap-3">
                      {answersForSc.map((ans, idx) => {
                        const cand = compCandidates.find((c) => c.id === ans.candidateId);
                        const isCandRec = cand?.id === recommended?.id;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border text-xs space-y-2 ${
                              isCandRec ? 'border-[#B87A14] bg-[#FBF3E2]/40' : 'border-[#D3DDD8] bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#0A2E2B]">
                                {cand?.name || 'Model'} ({cand?.provider})
                              </span>
                              <span className="font-bold text-xs text-[#1F5C55]">
                                Score: {ans.score !== null ? `${ans.score}/10` : 'Pending'}
                              </span>
                            </div>
                            <p className="text-[#0A2E2B] leading-relaxed whitespace-pre-wrap italic bg-white/70 p-3 rounded-lg border border-[#D3DDD8]/60">
                              &quot;{ans.answer}&quot;
                            </p>
                            {ans.judgeRationale && (
                              <p className="text-[11px] text-[#4B605C]">
                                <strong>Judge Rationale:</strong> {ans.judgeRationale}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}

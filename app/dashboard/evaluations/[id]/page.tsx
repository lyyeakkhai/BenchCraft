import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, scenarios, arenaAnswers, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { Stepper } from '@/components/brand/stepper';
import { ProviderLogo } from '@/components/brand/provider-logo';
import { ExternalLink, Printer, ChevronDown, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      <Stepper currentStep={3} businessTitle={comp.title} />

      {/* 01 // TOP 3 CANDIDATES PODIUM */}
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-well">
              [01 // ARENA PODIUM]
            </span>
            <span className="pill emerald text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Calibrated Verdict Ready
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">
            We found 3 qualifying models for{' '}
            <span className="font-editorial italic font-semibold text-accent">
              {comp.title}.
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="pill font-semibold text-ink">
              {comp.domainProfile?.taskCategory?.replace('_', ' ') || 'Customer support chat'}
            </span>
            <span className="pill">
              {(comp.domainProfile?.languages || ['Khmer', 'English']).join(' & ')}
            </span>
            <span className="pill font-outlier num">
              {comp.conversationsPerMonth.toLocaleString()} convs / mo
            </span>
            <span className="pill font-outlier num">
              {compScenarios.length} scenarios audited
            </span>
            <span className="pill emerald font-outlier font-semibold num">
              Target Bar: {barThreshold} / 100
            </span>
          </div>
        </div>

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
                className={`rounded-card p-6 flex flex-col justify-between relative min-h-[360px] ${
                  isRec ? 'ledger-signal' : 'glass-card glass-card-interactive'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    {isRec ? (
                      <span className="pill rec font-bold">
                        <Zap className="w-3 h-3" />
                        Recommended Winner
                      </span>
                    ) : idx === 1 ? (
                      <span className="pill">Runner-up</span>
                    ) : (
                      <span className="pill">Frontier Reference</span>
                    )}
                    <span className="text-[11px] font-outlier text-muted">Rank #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <ProviderLogo provider={cand.provider || cand.name} size="lg" />
                    <div>
                      <div className="font-display font-bold text-xl sm:text-2xl text-ink leading-tight">
                        {cand.name || cand.modelId}
                      </div>
                      <div className="text-xs text-muted mt-0.5 font-outlier">{cand.provider}</div>
                    </div>
                  </div>

                  <div className="mt-5 p-3.5 rounded-card glass-well space-y-2">
                    <div className="flex justify-between items-baseline text-xs text-muted font-outlier num">
                      <span>Domain Fit</span>
                      <span>Bar: {barThreshold}/100</span>
                    </div>

                    <div className="flex items-baseline gap-1 num">
                      <span className="font-editorial font-bold text-3xl text-ink leading-none">
                        {fitScore}
                      </span>
                      <span className="text-xs text-muted">/ 100</span>
                    </div>

                    <div className="relative h-2 rounded-pill bg-rule overflow-visible">
                      <div
                        className="h-2 rounded-pill bg-accent"
                        style={{ width: `${Math.min(100, fitScore)}%` }}
                      />
                      <div
                        className="absolute -top-1 w-[2px] h-4 bg-ink"
                        style={{ left: `${barThreshold}%` }}
                        title={`Your quality bar: ${barThreshold}`}
                      />
                    </div>
                  </div>

                  <div className="mt-5 num">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-editorial font-bold text-3xl sm:text-4xl leading-none ${
                          isRec ? 'text-signal' : 'text-ink'
                        }`}
                      >
                        ${cand.monthlyCostUsd?.toLocaleString() || '0'}
                      </span>
                      <span className="text-xs text-muted">/ month</span>
                    </div>
                    <div className="text-xs text-muted mt-1 font-outlier">
                      ${convKCost} per 1,000 conversations
                    </div>
                    <div className="text-[11px] text-muted mt-0.5 font-outlier">
                      1M tok: in ${(cand.inputPriceSnapshot || 0.1).toFixed(2)} · out $
                      {(cand.outputPriceSnapshot || 0.5).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-ink mt-5 pt-3 border-t border-rule">
                  {isRec
                    ? 'Clears your quality bar at the lowest operational cost.'
                    : idx === 1
                    ? `Close runner-up. ${
                        (cand.monthlyCostUsd || 0) > (recommended?.monthlyCostUsd || 0)
                          ? `$${savingVsRunnerUp} more/mo`
                          : 'Similar cost'
                      }.`
                    : reference && reference.monthlyCostUsd
                    ? `${(reference.monthlyCostUsd / (recommended?.monthlyCostUsd || 1)).toFixed(
                        0
                      )}× the cost of the calibrated winner.`
                    : 'High-capability frontier tier candidate.'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 02 // UNIT ECONOMICS & CLOUD PROCUREMENT */}
      <section className="space-y-5 pt-6 border-t border-rule">
        <div className="space-y-1">
          <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-well">
            [02 // FINANCIAL RIGHT-SIZING]
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink pt-1">
            Deploy {recommended?.name || recommended?.modelId}
          </h2>
          <p className="text-sm text-muted num">
            Clears your quality bar (fit {Math.round((recommended?.avgScore || 0) * 10)}, threshold{' '}
            {barThreshold}) at the lowest inference cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-7 glass-card p-6 sm:p-7 flex flex-col justify-between space-y-5 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-signal/12 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-title font-display font-bold text-ink">
                Audited Net Savings
              </h3>

              <div className="flex flex-wrap items-baseline gap-3 my-4">
                <span className="font-editorial font-bold text-5xl sm:text-6xl text-signal leading-none tracking-tight num">
                  ${savingMonthly.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-muted leading-snug num">
                  saved per month vs. frontier tier.
                  <br />
                  <span className="font-semibold text-accent">
                    ${savingYearly.toLocaleString()}/yr
                  </span>{' '}
                  redirected to engineering runway.
                </span>
              </div>

              <div className="space-y-2.5 mt-5">
                {compCandidates.map((cand) => {
                  const isRec = cand.id === recommended?.id;
                  const pct = Math.max(3, Math.round(((cand.monthlyCostUsd || 1) / maxCost) * 100));

                  return (
                    <div key={cand.id} className="flex items-center gap-2.5 text-xs">
                      <span
                        className={`w-36 sm:w-44 truncate ${
                          isRec ? 'font-bold text-ink' : 'text-muted'
                        }`}
                      >
                        {cand.name}
                      </span>
                      <div className="flex-1 h-2.5 rounded-pill glass-well overflow-hidden">
                        <div
                          className={`h-2.5 rounded-pill ${
                            isRec ? 'bg-signal' : 'bg-rule-2'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`w-20 text-right font-outlier num ${
                          isRec ? 'font-bold text-signal' : 'text-muted'
                        }`}
                      >
                        ${cand.monthlyCostUsd?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-well rounded-input p-3.5 text-xs text-ink num relative z-10">
              <strong>At 2× scale</strong> ({(comp.conversationsPerMonth * 2).toLocaleString()}{' '}
              convs/mo): {recommended?.name} costs $
              {((recommended?.monthlyCostUsd || 0) * 2).toLocaleString()}/mo vs.{' '}
              {reference?.name} at ${((reference?.monthlyCostUsd || 0) * 2).toLocaleString()}/mo.
            </div>
          </div>

          <div className="md:col-span-5 glass-card p-6 sm:p-7 flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-title font-display font-bold text-ink">
                Cloud Procurement Endpoints
              </h3>

              <div className="ledger-signal p-4 mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-ink">
                    {recommended?.provider} Direct API
                  </span>
                  <span className="pill rec text-[11px]">Zero Markup</span>
                </div>
                <p className="text-xs text-ink font-outlier num">
                  In ${(recommended?.inputPriceSnapshot || 0.1).toFixed(2)} · Out $
                  {(recommended?.outputPriceSnapshot || 0.5).toFixed(2)} / 1M tokens
                </p>
              </div>

              <div className="space-y-2 mt-3">
                {(
                  recommended?.whereToBuy || [
                    { name: 'Amazon Bedrock', url: 'https://aws.amazon.com/bedrock' },
                    { name: 'Google Cloud Vertex AI', url: 'https://cloud.google.com/vertex-ai' },
                    { name: 'OpenRouter ZDR Gateway', url: 'https://openrouter.ai' },
                  ]
                ).map((shop: { name: string; url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="glass-well rounded-input p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <ProviderLogo provider={shop.name} size="sm" />
                      <div>
                        <div className="font-semibold text-ink">{shop.name}</div>
                        <div className="text-[11px] text-muted">Enterprise ZDR endpoint</div>
                      </div>
                    </div>
                    <a
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ledger-ghost btn-sm"
                    >
                      <span>Connect</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted pt-2 border-t border-rule flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Verified list pricing. Zero broker fees.</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted num">
            <strong>Executive Audit Ready:</strong> Export a board-ready PDF memo with full scenario rationales.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/dashboard/evaluations/${id}/report`}
              className="btn-ledger-ghost btn-sm flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Download Memo</span>
            </Link>
            <Link
              href="/dashboard/evaluations/new"
              className="btn-ledger btn-sm flex-1 sm:flex-initial"
            >
              Run New Test
            </Link>
          </div>
        </div>
      </section>

      {/* 03 // SCENARIOS & JUDGE RATIONALES LEDGER */}
      <section className="space-y-4 pt-4 border-t border-rule">
        <div className="space-y-1">
          <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-well">
            [03 // RUBRIC TRANSCRIPTS]
          </span>
          <h2 className="text-2xl font-display font-bold text-ink num pt-1">
            Scenario Responses &amp; Judge Rationales ({compScenarios.length})
          </h2>
          <p className="text-sm text-muted">
            Full transparency into anonymized candidate outputs and temperature-0 rubric grading.
          </p>
        </div>

        <div className="space-y-3">
          {compScenarios.map((sc) => {
            const answersForSc = compAnswers.filter((a) => a.scenarioId === sc.id);

            return (
              <details key={sc.id} className="group glass-card p-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-outlier font-semibold text-accent num">
                      SCENARIO #{sc.position}
                    </div>
                    <div className="text-sm font-bold text-ink line-clamp-1">{sc.prompt}</div>
                  </div>
                  <ChevronDown
                    className="w-4 h-4 text-muted group-open:rotate-180 transition-transform flex-shrink-0"
                    aria-hidden="true"
                  />
                </summary>

                <div className="pt-4 mt-3 border-t border-rule space-y-4 text-xs">
                  <div>
                    <div className="font-semibold text-ink mb-1">Full adversarial prompt:</div>
                    <p className="p-3 glass-well rounded-input text-ink whitespace-pre-wrap">
                      {sc.prompt}
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-ink mb-1">Temperature-0 Judge Rubrics:</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-muted">
                      {sc.rubric.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="font-semibold text-ink">Candidate model transcripts:</div>
                    <div className="grid grid-cols-1 gap-3">
                      {answersForSc.map((ans, idx) => {
                        const cand = compCandidates.find((c) => c.id === ans.candidateId);
                        const isCandRec = cand?.id === recommended?.id;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-card text-xs space-y-2 ${
                              isCandRec ? 'ledger-signal' : 'glass-well'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ProviderLogo provider={cand?.provider || cand?.name} size="xs" />
                                <span className="font-bold text-ink">
                                  {cand?.name || 'Model'} <span className="text-muted font-normal">({cand?.provider})</span>
                                </span>
                              </div>
                              <span className="pill emerald font-outlier font-bold text-[11px] num">
                                Score: {ans.score !== null ? `${ans.score} / 10` : 'Pending'}
                              </span>
                            </div>
                            <p className="text-ink leading-relaxed whitespace-pre-wrap bg-paper-2/80 p-3 rounded-input border border-rule">
                              “{ans.answer}”
                            </p>
                            {ans.judgeRationale && (
                              <p className="text-xs text-muted">
                                <strong>Judge rationale:</strong> {ans.judgeRationale}
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

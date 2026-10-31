import { CandidateResult, CatalogModel, ConversationLength, DomainProfile } from '../types';
import { ScoredAnswer } from './judge';
import { ModelScenarioAnswer } from './arena';

export interface RecommendationSummary {
  top3: CandidateResult[];
  allCandidates: CandidateResult[];
  recommendedModel: CandidateResult;
  referenceModel: CandidateResult;
  savingMonthly: number;
  savingYearly: number;
  savingPercentage: number;
  warning?: string;
}

export function calculateCandidateMetrics(params: {
  candidate: CatalogModel;
  scoredAnswers: ScoredAnswer[];
  rawAnswers: ModelScenarioAnswer[];
  conversationsPerMonth: number;
  conversationLength: ConversationLength;
  qualityBar: number;
}): CandidateResult {
  const turns = { short: 2, medium: 4, long: 8 }[params.conversationLength];

  // Averages
  const totalScore = params.scoredAnswers.reduce((sum, a) => sum + a.score, 0);
  const avgScore = params.scoredAnswers.length > 0 ? Number((totalScore / params.scoredAnswers.length).toFixed(2)) : 0;
  const fitScore = Math.round(avgScore * 10);

  const passedCount = params.scoredAnswers.filter((a) => a.score >= params.qualityBar).length;
  const passRate = params.scoredAnswers.length > 0 ? Number((passedCount / params.scoredAnswers.length).toFixed(2)) : 0;

  const totalInputTokens = params.rawAnswers.reduce((sum, a) => sum + a.inputTokens, 0);
  const totalOutputTokens = params.rawAnswers.reduce((sum, a) => sum + a.outputTokens, 0);

  // Use reasonable defaults if 0
  const avgInputTokens = params.rawAnswers.length > 0 ? Math.round(totalInputTokens / params.rawAnswers.length) : 450;
  const avgOutputTokens = params.rawAnswers.length > 0 ? Math.round(totalOutputTokens / params.rawAnswers.length) : 220;

  // Cost calculation
  const costPerTurn =
    (avgInputTokens * params.candidate.inputPricePerMTok + avgOutputTokens * params.candidate.outputPricePerMTok) /
    1_000_000;

  const monthlyCostUsd = Number((params.conversationsPerMonth * turns * costPerTurn).toFixed(2));
  const costPer1kConvs = Number((1_000 * turns * costPerTurn).toFixed(3));

  return {
    modelId: params.candidate.id,
    name: params.candidate.name,
    provider: params.candidate.provider,
    tier: params.candidate.tier,
    inputPrice: params.candidate.inputPricePerMTok,
    outputPrice: params.candidate.outputPricePerMTok,
    avgScore,
    fitScore,
    passRate,
    avgInputTokens,
    avgOutputTokens,
    monthlyCostUsd,
    costPer1kConvs,
    rank: 0,
    isRecommended: false,
    reasons: [],
    whereToBuy: params.candidate.whereToBuy,
  };
}

export function generateEvaluationRecommendation(params: {
  candidates: CandidateResult[];
  profile: DomainProfile;
  conversationsPerMonth: number;
}): RecommendationSummary {
  // Sort by fitScore descending, ties broken by lower monthly cost
  const sorted = [...params.candidates].sort((a, b) => {
    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
    return a.monthlyCostUsd - b.monthlyCostUsd;
  });

  // Assign ranks
  sorted.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  // Identify reference model (top tier or most expensive)
  const reference =
    sorted.find((c) => c.tier === 'top') ||
    [...sorted].sort((a, b) => b.monthlyCostUsd - a.monthlyCostUsd)[0];

  // Right-sizing rule:
  // Qualifying candidates: avgScore >= qualityBar AND passRate >= 0.75
  const qualifying = sorted.filter((c) => c.avgScore >= params.profile.qualityBar && c.passRate >= 0.75);

  let recommended: CandidateResult;
  let warning: string | undefined;

  if (qualifying.length > 0) {
    // Recommend the CHEAPEST qualifying model
    recommended = [...qualifying].sort((a, b) => a.monthlyCostUsd - b.monthlyCostUsd)[0];
  } else {
    // If none fully met bar, recommend highest fitScore
    recommended = sorted[0];
    warning = 'No tested model fully met your target quality bar across all scenarios.';
  }

  recommended.isRecommended = true;

  // Compute savings against top tier reference
  const savingMonthly = Math.max(0, Number((reference.monthlyCostUsd - recommended.monthlyCostUsd).toFixed(2)));
  const savingYearly = Number((savingMonthly * 12).toFixed(2));
  const savingPercentage =
    reference.monthlyCostUsd > 0
      ? Math.round(((reference.monthlyCostUsd - recommended.monthlyCostUsd) / reference.monthlyCostUsd) * 100)
      : 0;

  // Build structured, data-backed reasons
  const qualityPctOfTop =
    reference.avgScore > 0 ? Math.round((recommended.avgScore / reference.avgScore) * 100) : 100;

  recommended.reasons = [
    `Scored ${recommended.avgScore.toFixed(1)}/10 against your quality threshold (${params.profile.qualityBar.toFixed(1)})`,
    `Passed ${Math.round(recommended.passRate * 100)}% of tested business scenarios with high confidence`,
    `Delivers ${qualityPctOfTop}% of top-tier quality at a fraction of the cost`,
    savingMonthly > 0
      ? `Saves $${savingMonthly.toLocaleString()}/month ($${savingYearly.toLocaleString()}/year) compared to ${reference.name}`
      : `Best fit for your high-complexity domain bar`,
  ];

  // Top 3 includes the recommended model + the 2 highest fit scores
  const top3Candidates = [
    recommended,
    ...sorted.filter((c) => c.modelId !== recommended.modelId),
  ].slice(0, 3);

  return {
    top3: top3Candidates,
    allCandidates: sorted,
    recommendedModel: recommended,
    referenceModel: reference,
    savingMonthly,
    savingYearly,
    savingPercentage,
    warning,
  };
}

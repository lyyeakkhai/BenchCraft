import { describe, it, expect } from 'vitest';
import { calculateCandidateMetrics, generateEvaluationRecommendation } from './recommender';
import { selectCandidates } from './selection';
import { CURATED_CATALOG } from '../catalog';
import { CatalogModel, DomainProfile } from '../types';

describe('BenchCraft Engine Unit Tests', () => {
  const dummyCandidate: CatalogModel = {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    provider: 'Google',
    tier: 'small',
    categories: ['support_chat'],
    priorScores: { support_chat: 82 },
    languages: ['en', 'km'],
    contextLength: 1048576,
    modalities: ['text'],
    inputPricePerMTok: 0.0375,
    outputPricePerMTok: 0.15,
    whereToBuy: [{ name: 'Google Cloud Vertex AI', url: 'https://cloud.google.com' }],
    sourceUrl: 'https://ai.google.dev',
    active: true,
  };

  it('calculates monthly cost and metrics accurately', () => {
    const scoredAnswers = [
      { modelId: dummyCandidate.id, scenarioId: 's1', score: 8.5, rationale: 'Good' },
      { modelId: dummyCandidate.id, scenarioId: 's2', score: 8.0, rationale: 'Good' },
    ];
    const rawAnswers = [
      {
        modelId: dummyCandidate.id,
        scenarioId: 's1',
        scenarioPosition: 1,
        answer: 'Hi',
        inputTokens: 500,
        outputTokens: 200,
        latencyMs: 300,
        status: 'done' as const,
      },
      {
        modelId: dummyCandidate.id,
        scenarioId: 's2',
        scenarioPosition: 2,
        answer: 'Hello',
        inputTokens: 500,
        outputTokens: 200,
        latencyMs: 350,
        status: 'done' as const,
      },
    ];

    const result = calculateCandidateMetrics({
      candidate: dummyCandidate,
      scoredAnswers,
      rawAnswers,
      conversationsPerMonth: 50000,
      conversationLength: 'medium', // 4 turns
      qualityBar: 8.0,
    });

    expect(result.avgScore).toBe(8.25);
    expect(result.fitScore).toBe(83);
    expect(result.passRate).toBe(1.0);
    expect(result.monthlyCostUsd).toBeGreaterThan(0);
    expect(result.monthlyCostUsd).toBeLessThan(50); // Flash lite is very cheap
  });

  it('applies the right-sizing rule: recommends the cheapest candidate meeting the quality bar', () => {
    const profile: DomainProfile = {
      industry: 'Fashion Boutique',
      taskCategory: 'support_chat',
      businessSummary: 'Online clothing store in Cambodia',
      languages: ['en', 'km'],
      needsLongContext: false,
      needsVision: false,
      riskLevel: 'medium',
      qualityBar: 8.0,
      assumptions: [],
    };

    const smallCandidate = {
      modelId: 'small-model',
      name: 'Small Model',
      provider: 'Provider A',
      tier: 'small' as const,
      inputPrice: 0.05,
      outputPrice: 0.15,
      avgScore: 8.3,
      fitScore: 83,
      passRate: 0.85,
      avgInputTokens: 500,
      avgOutputTokens: 200,
      monthlyCostUsd: 15.0,
      costPer1kConvs: 0.3,
      rank: 0,
      isRecommended: false,
      reasons: [],
      whereToBuy: [],
    };

    const topCandidate = {
      modelId: 'top-frontier-model',
      name: 'Top Frontier Model',
      provider: 'Provider B',
      tier: 'top' as const,
      inputPrice: 3.0,
      outputPrice: 15.0,
      avgScore: 9.5,
      fitScore: 95,
      passRate: 1.0,
      avgInputTokens: 500,
      avgOutputTokens: 200,
      monthlyCostUsd: 1500.0,
      costPer1kConvs: 30.0,
      rank: 0,
      isRecommended: false,
      reasons: [],
      whereToBuy: [],
    };

    const rec = generateEvaluationRecommendation({
      candidates: [topCandidate, smallCandidate],
      profile,
      conversationsPerMonth: 50000,
    });

    // Small model qualifies (8.3 >= 8.0 & 85% >= 75%) and is $15 vs $1500
    expect(rec.recommendedModel.modelId).toBe('small-model');
    expect(rec.savingMonthly).toBe(1485.0);
    expect(rec.savingYearly).toBe(17820.0);
    expect(rec.recommendedModel.reasons.length).toBeGreaterThan(0);
  });

  it('selects candidates across tiers and ensures diverse representation', () => {
    const profile: DomainProfile = {
      industry: 'Fashion E-commerce',
      taskCategory: 'support_chat',
      businessSummary: 'Customer support',
      languages: ['en'],
      needsLongContext: false,
      needsVision: false,
      riskLevel: 'medium',
      qualityBar: 8.0,
      assumptions: [],
    };

    const selected = selectCandidates(profile, CURATED_CATALOG);
    expect(selected.length).toBeGreaterThanOrEqual(3);
    expect(selected.some((m) => m.tier === 'top')).toBe(true);
    expect(selected.some((m) => m.tier === 'small')).toBe(true);
  });
});

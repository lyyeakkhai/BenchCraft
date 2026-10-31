'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../lib/db';
import { comparisons, documents, scenarios, candidates, arenaAnswers, catalogModels } from '../drizzle/schema';
import { requireUser } from '../lib/auth';
import { processUploadedFile } from '../lib/engine/intake';
import { analyzeBusinessAndGenerateScenarios } from '../lib/engine/analysis';
import { selectCandidates } from '../lib/engine/selection';
import { runCandidateScenario } from '../lib/engine/arena';
import { judgeScenarioAnswers } from '../lib/engine/judge';
import { calculateCandidateMetrics, generateEvaluationRecommendation } from '../lib/engine/recommender';
import { ConversationLength, DomainProfile, Scenario } from '../lib/types';
import { getCatalog } from '../lib/catalog';

export async function createEvaluationAction(formData: FormData) {
  const userId = await requireUser();

  const title = (formData.get('title') as string) || 'My Business AI Assistant';
  const description = (formData.get('description') as string) || '';
  const conversationsPerMonth = parseInt((formData.get('conversationsPerMonth') as string) || '10000', 10);
  const conversationLength = ((formData.get('conversationLength') as string) || 'medium') as ConversationLength;

  if (!description || description.trim().length < 10) {
    throw new Error('Please provide at least 10 characters describing your business use case.');
  }

  // 1. Process files
  const fileEntries = formData.getAll('files') as File[];
  const validFiles = fileEntries.filter((f) => f && f.size > 0 && f.name);

  const extractedDocs = [];
  for (const file of validFiles.slice(0, 5)) {
    try {
      const doc = await processUploadedFile(file);
      extractedDocs.push(doc);
    } catch (e) {
      console.warn(`File intake skipped for ${file.name}:`, e);
    }
  }

  // 2. Create Draft Comparison in DB
  let comparisonId: string;
  try {
    const [inserted] = await db
      .insert(comparisons)
      .values({
        clerkUserId: userId,
        title,
        description,
        conversationsPerMonth,
        conversationLength,
        status: 'draft',
      })
      .returning();
    comparisonId = inserted.id;

    // Save document summaries
    if (extractedDocs.length > 0) {
      await db.insert(documents).values(
        extractedDocs.map((doc) => ({
          comparisonId,
          fileName: doc.name,
          mimeType: doc.type,
          sizeBytes: doc.size,
          summary: doc.content.slice(0, 300),
        }))
      );
    }
  } catch (err) {
    console.error('Failed to create comparison in DB:', err);
    throw new Error('Database connection failed. Please ensure DATABASE_URL is properly configured.');
  }

  // 3. Run Domain Analysis
  const { profile, scenarios: generatedScenarios } = await analyzeBusinessAndGenerateScenarios({
    description,
    docSummaries: extractedDocs.map((d) => d.content),
    conversationsPerMonth,
    conversationLength,
  });

  // 4. Select ~5 candidates
  const catalog = getCatalog();
  const selectedModels = selectCandidates(profile, catalog);

  // 5. Seed Catalog Models if not in DB, and save Candidates
  try {
    for (const m of selectedModels) {
      await db
        .insert(catalogModels)
        .values({
          id: m.id,
          name: m.name,
          provider: m.provider,
          tier: m.tier,
          categories: m.categories,
          priorScores: m.priorScores,
          isReference: m.isReference,
          languages: m.languages,
          contextLength: m.contextLength,
          modalities: m.modalities,
          inputPricePerMTok: m.inputPricePerMTok,
          outputPricePerMTok: m.outputPricePerMTok,
          whereToBuy: m.whereToBuy,
          sourceUrl: m.sourceUrl,
          active: true,
        })
        .onConflictDoNothing();
    }

    // Save Scenarios
    await db.insert(scenarios).values(
      generatedScenarios.map((s, idx) => ({
        comparisonId,
        position: idx + 1,
        prompt: s.prompt,
        rubric: s.rubric,
        source: s.source,
      }))
    );

    // Save Candidates with price snapshot
    await db.insert(candidates).values(
      selectedModels.map((m) => ({
        comparisonId,
        modelId: m.id,
        tier: m.tier,
        status: 'pending' as const,
        inputPriceSnapshot: m.inputPricePerMTok,
        outputPriceSnapshot: m.outputPricePerMTok,
      }))
    );

    // Update Comparison status to analyzed
    await db
      .update(comparisons)
      .set({
        domainProfile: profile,
        status: 'analyzed',
        updatedAt: new Date(),
      })
      .where(eq(comparisons.id, comparisonId));
  } catch (err) {
    console.error('Failed to save analysis results:', err);
  }

  redirect(`/dashboard/evaluations/${comparisonId}/review`);
}

export async function updateScenariosAndConfirmAction(
  comparisonId: string,
  updatedScenarios: { id?: string; position: number; prompt: string; rubric: string[] }[],
  updatedQualityBar?: number
) {
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, comparisonId), eq(comparisons.clerkUserId, userId)));

  if (!comp) throw new Error('Evaluation not found');

  // Update profile qualityBar if changed
  if (updatedQualityBar && comp.domainProfile) {
    const newProfile = {
      ...comp.domainProfile,
      qualityBar: updatedQualityBar,
    };
    await db
      .update(comparisons)
      .set({ domainProfile: newProfile, status: 'reviewed', updatedAt: new Date() })
      .where(eq(comparisons.id, comparisonId));
  } else {
    await db
      .update(comparisons)
      .set({ status: 'reviewed', updatedAt: new Date() })
      .where(eq(comparisons.id, comparisonId));
  }

  // Update scenarios
  await db.delete(scenarios).where(eq(scenarios.comparisonId, comparisonId));
  await db.insert(scenarios).values(
    updatedScenarios.map((s, idx) => ({
      comparisonId,
      position: idx + 1,
      prompt: s.prompt,
      rubric: s.rubric,
      source: 'founder' as const,
    }))
  );

  redirect(`/dashboard/evaluations/${comparisonId}/arena`);
}

export async function executeArenaEvaluationAction(comparisonId: string) {
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, comparisonId), eq(comparisons.clerkUserId, userId)));

  if (!comp) throw new Error('Evaluation not found');

  const compScenarios = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.comparisonId, comparisonId))
    .orderBy(scenarios.position);

  const compCandidates = await db
    .select()
    .from(candidates)
    .where(eq(candidates.comparisonId, comparisonId));

  const catalog = getCatalog();

  // Set status to testing
  await db.update(comparisons).set({ status: 'testing', updatedAt: new Date() }).where(eq(comparisons.id, comparisonId));

  // 1. Run all candidate models against scenarios
  const allAnswersByModel: Record<string, any[]> = {};

  for (const cand of compCandidates) {
    const catalogModel = catalog.find((m) => m.id === cand.modelId) || {
      id: cand.modelId,
      name: cand.modelId,
      provider: 'AI Provider',
      tier: cand.tier,
      categories: ['support_chat'],
      priorScores: {},
      languages: ['en'],
      contextLength: 128000,
      modalities: ['text'],
      inputPricePerMTok: cand.inputPriceSnapshot,
      outputPricePerMTok: cand.outputPriceSnapshot,
      whereToBuy: [],
      sourceUrl: '',
      active: true,
    };

    allAnswersByModel[cand.modelId] = [];

    for (const sc of compScenarios) {
      const ans = await runCandidateScenario({
        candidate: catalogModel,
        scenario: {
          id: sc.id,
          position: sc.position,
          prompt: sc.prompt,
          rubric: sc.rubric,
          source: sc.source as 'ai' | 'founder',
        },
        businessSummary: comp.domainProfile?.businessSummary || comp.description,
        conversationLength: comp.conversationLength as ConversationLength,
      });

      allAnswersByModel[cand.modelId].push(ans);

      // Save answer in DB
      await db.insert(arenaAnswers).values({
        candidateId: cand.id,
        scenarioId: sc.id,
        status: ans.status,
        answer: ans.answer,
        inputTokens: ans.inputTokens,
        outputTokens: ans.outputTokens,
        latencyMs: ans.latencyMs,
      });
    }
  }

  // 2. Judging: Score answers per scenario across candidates
  await db.update(comparisons).set({ status: 'judged', updatedAt: new Date() }).where(eq(comparisons.id, comparisonId));

  const allScoredByModel: Record<string, any[]> = {};
  compCandidates.forEach((c) => (allScoredByModel[c.modelId] = []));

  for (const sc of compScenarios) {
    const answersForScenario = compCandidates.map((c) => {
      return (
        allAnswersByModel[c.modelId]?.find((a) => a.scenarioId === sc.id) || {
          modelId: c.modelId,
          scenarioId: sc.id,
          scenarioPosition: sc.position,
          answer: 'No answer',
          inputTokens: 0,
          outputTokens: 0,
          latencyMs: 0,
          status: 'failed',
        }
      );
    });

    const scored = await judgeScenarioAnswers({
      scenario: {
        id: sc.id,
        position: sc.position,
        prompt: sc.prompt,
        rubric: sc.rubric,
        source: sc.source as 'ai' | 'founder',
      },
      businessSummary: comp.domainProfile?.businessSummary || comp.description,
      answers: answersForScenario,
    });

    for (const s of scored) {
      allScoredByModel[s.modelId]?.push(s);
      // Update arena_answers with score
      const cand = compCandidates.find((c) => c.modelId === s.modelId);
      if (cand) {
        await db
          .update(arenaAnswers)
          .set({ score: s.score, judgeRationale: s.rationale })
          .where(and(eq(arenaAnswers.candidateId, cand.id), eq(arenaAnswers.scenarioId, sc.id)));
      }
    }
  }

  // 3. Compute Metrics & Recommendations
  const candidateMetrics = compCandidates.map((cand) => {
    const catalogModel = catalog.find((m) => m.id === cand.modelId) || {
      id: cand.modelId,
      name: cand.modelId,
      provider: 'AI Provider',
      tier: cand.tier,
      categories: ['support_chat'],
      priorScores: {},
      languages: ['en'],
      contextLength: 128000,
      modalities: ['text'],
      inputPricePerMTok: cand.inputPriceSnapshot,
      outputPricePerMTok: cand.outputPriceSnapshot,
      whereToBuy: [],
      sourceUrl: '',
      active: true,
    };

    return calculateCandidateMetrics({
      candidate: catalogModel,
      scoredAnswers: allScoredByModel[cand.modelId] || [],
      rawAnswers: allAnswersByModel[cand.modelId] || [],
      conversationsPerMonth: comp.conversationsPerMonth,
      conversationLength: comp.conversationLength as ConversationLength,
      qualityBar: comp.domainProfile?.qualityBar || 8.0,
    });
  });

  const recommendation = generateEvaluationRecommendation({
    candidates: candidateMetrics,
    profile: comp.domainProfile || {
      industry: 'General Business',
      taskCategory: 'support_chat',
      businessSummary: comp.description,
      languages: ['en'],
      needsLongContext: false,
      needsVision: false,
      riskLevel: 'medium',
      qualityBar: 8.0,
      assumptions: [],
    },
    conversationsPerMonth: comp.conversationsPerMonth,
  });

  // Update candidate rows in DB
  for (const res of recommendation.allCandidates) {
    const cand = compCandidates.find((c) => c.modelId === res.modelId);
    if (cand) {
      await db
        .update(candidates)
        .set({
          status: 'done',
          avgScore: res.avgScore,
          passRate: res.passRate,
          avgInputTokens: res.avgInputTokens,
          avgOutputTokens: res.avgOutputTokens,
          monthlyCostUsd: res.monthlyCostUsd,
          rank: res.rank,
          isRecommended: res.isRecommended,
          reasons: res.reasons,
          updatedAt: new Date(),
        })
        .where(eq(candidates.id, cand.id));
    }
  }

  // Update Comparison to done
  await db
    .update(comparisons)
    .set({
      status: 'done',
      judgeModelId: 'google/gemini-2.5-flash',
      updatedAt: new Date(),
    })
    .where(eq(comparisons.id, comparisonId));

  redirect(`/dashboard/evaluations/${comparisonId}`);
}

export async function deleteEvaluationAction(comparisonId: string) {
  const userId = await requireUser();
  await db.delete(comparisons).where(and(eq(comparisons.id, comparisonId), eq(comparisons.clerkUserId, userId)));
  revalidatePath('/dashboard');
}

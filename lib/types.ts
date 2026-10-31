import { z } from 'zod';

export const TaskCategoryEnum = z.enum([
  'support_chat',
  'document_qa',
  'content_writing',
  'extraction',
  'coding',
]);
export type TaskCategory = z.infer<typeof TaskCategoryEnum>;

export const RiskLevelEnum = z.enum(['low', 'medium', 'high']);
export type RiskLevel = z.infer<typeof RiskLevelEnum>;

export const ConversationLengthEnum = z.enum(['short', 'medium', 'long']);
export type ConversationLength = z.infer<typeof ConversationLengthEnum>;

export const ComparisonStatusEnum = z.enum([
  'draft',
  'analyzed',
  'reviewed',
  'testing',
  'judged',
  'done',
  'failed',
]);
export type ComparisonStatus = z.infer<typeof ComparisonStatusEnum>;

export const DomainProfileSchema = z.object({
  industry: z.string(),
  taskCategory: TaskCategoryEnum,
  businessSummary: z.string(),
  languages: z.array(z.string()),
  needsLongContext: z.boolean(),
  needsVision: z.boolean(),
  riskLevel: RiskLevelEnum,
  qualityBar: z.number(), // 5.0 - 9.5
  assumptions: z.array(z.string()),
});
export type DomainProfile = z.infer<typeof DomainProfileSchema>;

export const ScenarioSchema = z.object({
  id: z.string().optional(),
  position: z.number(),
  prompt: z.string(),
  rubric: z.array(z.string()),
  source: z.enum(['ai', 'founder']),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

export const ModelTierEnum = z.enum(['small', 'mid', 'top']);
export type ModelTier = z.infer<typeof ModelTierEnum>;

export const WhereToBuySchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type WhereToBuy = z.infer<typeof WhereToBuySchema>;

export const CatalogModelSchema = z.object({
  id: z.string(), // OpenRouter slug
  name: z.string(),
  provider: z.string(),
  tier: ModelTierEnum,
  categories: z.array(TaskCategoryEnum),
  priorScores: z.record(z.string(), z.number()),
  isReference: z.record(z.string(), z.boolean()).optional(),
  languages: z.array(z.string()),
  contextLength: z.number(),
  modalities: z.array(z.string()),
  inputPricePerMTok: z.number(),
  outputPricePerMTok: z.number(),
  whereToBuy: z.array(WhereToBuySchema),
  sourceUrl: z.string(),
  active: z.boolean(),
});
export type CatalogModel = z.infer<typeof CatalogModelSchema>;

export interface CandidateResult {
  modelId: string;
  name: string;
  provider: string;
  tier: ModelTier;
  inputPrice: number;
  outputPrice: number;
  avgScore: number; // 0-10
  fitScore: number; // 0-100
  passRate: number; // 0-1
  avgInputTokens: number;
  avgOutputTokens: number;
  monthlyCostUsd: number;
  costPer1kConvs: number;
  rank: number;
  isRecommended: boolean;
  reasons: string[];
  whereToBuy: WhereToBuy[];
}

export interface AnswerResult {
  scenarioId: string;
  scenarioPrompt: string;
  answer: string;
  score: number;
  rationale: string;
}

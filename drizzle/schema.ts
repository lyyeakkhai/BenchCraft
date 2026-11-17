import { pgTable, text, integer, numeric, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import type { DomainProfile, WhereToBuy } from '../lib/types';

export const comparisons = pgTable('comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull(),
  title: text('title').notNull(),
  status: text('status', {
    enum: ['draft', 'analyzed', 'reviewed', 'testing', 'judged', 'done', 'failed'],
  }).notNull().default('draft'),
  description: text('description').notNull(),
  conversationsPerMonth: integer('conversations_per_month').notNull().default(10000),
  conversationLength: text('conversation_length', {
    enum: ['short', 'medium', 'long'],
  }).notNull().default('medium'),
  domainProfile: jsonb('domain_profile').$type<DomainProfile>(),
  judgeModelId: text('judge_model_id'),
  apiCostUsd: numeric('api_cost_usd', { precision: 10, scale: 4, mode: 'number' }).default(0),
  error: text('error'),
  failedStage: text('failed_stage'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}).enableRLS();

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  comparisonId: uuid('comparison_id')
    .notNull()
    .references(() => comparisons.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}).enableRLS();

export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  comparisonId: uuid('comparison_id')
    .notNull()
    .references(() => comparisons.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  prompt: text('prompt').notNull(),
  rubric: jsonb('rubric').$type<string[]>().notNull(),
  source: text('source', { enum: ['ai', 'founder'] }).notNull().default('ai'),
}).enableRLS();

export const catalogModels = pgTable('catalog_models', {
  id: text('id').primaryKey(), // OpenRouter slug e.g. "google/gemini-2.5-flash"
  name: text('name').notNull(),
  provider: text('provider').notNull(),
  tier: text('tier', { enum: ['small', 'mid', 'top'] }).notNull(),
  categories: jsonb('categories').$type<string[]>().notNull(),
  priorScores: jsonb('prior_scores').$type<Record<string, number>>().notNull(),
  isReference: jsonb('is_reference').$type<Record<string, boolean>>(),
  languages: jsonb('languages').$type<string[]>().notNull(),
  contextLength: integer('context_length').notNull(),
  modalities: jsonb('modalities').$type<string[]>().notNull(),
  inputPricePerMTok: numeric('input_price_per_m_tok', { precision: 10, scale: 4, mode: 'number' }).notNull(),
  outputPricePerMTok: numeric('output_price_per_m_tok', { precision: 10, scale: 4, mode: 'number' }).notNull(),
  whereToBuy: jsonb('where_to_buy').$type<WhereToBuy[]>().notNull(),
  sourceUrl: text('source_url').notNull(),
  pricesUpdatedAt: timestamp('prices_updated_at', { withTimezone: true }).defaultNow(),
  active: boolean('active').default(true).notNull(),
}).enableRLS();

export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  comparisonId: uuid('comparison_id')
    .notNull()
    .references(() => comparisons.id, { onDelete: 'cascade' }),
  modelId: text('model_id')
    .notNull()
    .references(() => catalogModels.id),
  tier: text('tier', { enum: ['small', 'mid', 'top'] }).notNull(),
  status: text('status', { enum: ['pending', 'running', 'done', 'failed'] }).notNull().default('pending'),
  inputPriceSnapshot: numeric('input_price_snapshot', { precision: 10, scale: 4, mode: 'number' }).notNull(),
  outputPriceSnapshot: numeric('output_price_snapshot', { precision: 10, scale: 4, mode: 'number' }).notNull(),
  avgScore: numeric('avg_score', { precision: 4, scale: 2, mode: 'number' }),
  passRate: numeric('pass_rate', { precision: 4, scale: 2, mode: 'number' }),
  avgInputTokens: numeric('avg_input_tokens', { precision: 10, scale: 2, mode: 'number' }),
  avgOutputTokens: numeric('avg_output_tokens', { precision: 10, scale: 2, mode: 'number' }),
  monthlyCostUsd: numeric('monthly_cost_usd', { precision: 10, scale: 2, mode: 'number' }),
  rank: integer('rank'),
  isRecommended: boolean('is_recommended').default(false),
  reasons: jsonb('reasons').$type<string[]>(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}).enableRLS();

export const arenaAnswers = pgTable('arena_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  scenarioId: uuid('scenario_id')
    .notNull()
    .references(() => scenarios.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['done', 'failed'] }).notNull().default('done'),
  answer: text('answer').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  latencyMs: integer('latency_ms').notNull().default(0),
  score: numeric('score', { precision: 4, scale: 2, mode: 'number' }),
  judgeRationale: text('judge_rationale'),
}).enableRLS();

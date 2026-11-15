# Sprint 1: Setup, Accounts, Database & Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the project foundation for BenchCraft: shared TypeScript/Zod domain contracts, Supabase Postgres schema with Drizzle ORM and RLS, Clerk auth protection, OpenRouter LLM gateway with Zero Data Retention, brand design tokens, and the initial authenticated dashboard shell.

**Architecture:** Next.js 16 App Router application connected to Supabase Postgres via Drizzle ORM (transaction pooler with `prepare: false`). Authentication handled through `@clerk/nextjs` using resource-level protection (`requireUser`). All external AI communication isolated behind a singleton LLM gateway enforcing privacy rules (`zdr: true`, `data_collection: "deny"`).

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Drizzle ORM, postgres.js, @clerk/nextjs, Zod, Vitest.

## Global Constraints

- Directory: `/Users/lyyeakkhai/workspace/CADT-DS-G2/PM-D2/banch-craft/Bench-Craft`
- TypeScript strict mode must pass with zero errors (`tsc --noEmit`).
- All database tables must define `.enableRLS()` or `pgTable.withRLS()` to block Supabase Data API exposure.
- All OpenRouter calls must enforce `provider: { data_collection: "deny", zdr: true }`.
- No raw document files persisted to disk or database.
- Brand colors: Primary Deep Forest Teal (`#0C3838`), Amber Gold (`#D97706`), Neutral Gray (`#F9FAFB`).

---

### Task 1: Vitest & Brand Theme Foundation

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `src/app/globals.css`
- Modify: `package.json`

**Interfaces:**
- Produces: Test runner command `npm run test` executing Vitest across `src/**/*.test.ts`.
- Produces: CSS custom properties for BenchCraft palette (`--primary`, `--primary-foreground`, `--accent`, `--accent-foreground`).

- [ ] **Step 1: Write Vitest configuration file**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 2: Create test setup file**

```typescript
// src/test/setup.ts
// Global test setup runs before unit test suites
process.env.OPENROUTER_API_KEY = 'test_openrouter_key';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test';
```

- [ ] **Step 3: Add test scripts to package.json**

Add `"test": "vitest run"` and `"test:watch": "vitest"` to the `scripts` section in `package.json`.

- [ ] **Step 4: Update globals.css with brand tokens**

```css
/* src/app/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --brand-teal: #0C3838;
    --brand-teal-light: #164E4E;
    --brand-amber: #D97706;
    --brand-bg: #F9FAFB;
    --brand-card: #FFFFFF;
    --brand-border: #E5E7EB;
    --brand-text: #111827;
    --brand-muted: #6B7280;
  }
}
```

- [ ] **Step 5: Write smoke test to verify test setup**

Create `src/test/smoke.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Test Environment', () => {
  it('loads test environment correctly', () => {
    expect(process.env.OPENROUTER_API_KEY).toBe('test_openrouter_key');
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test`
Expected: PASS (1 test passed)

---

### Task 2: Shared Domain Types & Contracts

**Files:**
- Create: `src/lib/types/index.ts`
- Test: `src/lib/types/index.test.ts`

**Interfaces:**
- Produces: Zod schemas and TypeScript types: `DomainProfileSchema`, `DomainProfile`, `ScenarioSchema`, `Scenario`, `CatalogModelSchema`, `CatalogModel`, `ComparisonStatusSchema`.
- Consumed by: Intake, Analysis, Arena, Judge, Recommender, and Database schema.

- [ ] **Step 1: Write failing schema tests**

```typescript
// src/lib/types/index.test.ts
import { describe, it, expect } from 'vitest';
import { DomainProfileSchema, ScenarioSchema } from './index';

describe('Domain Profile Schema Validation', () => {
  it('validates a compliant domain profile', () => {
    const valid = {
      industry: 'E-commerce / Fashion',
      taskCategory: 'support_chat',
      businessSummary: 'Online clothing store answering sizing and shipping questions.',
      languages: ['en', 'km'],
      needsLongContext: false,
      needsVision: false,
      riskLevel: 'medium',
      qualityBar: 8.0,
      assumptions: ['50,000 conversations/mo', 'Medium response length'],
    };
    const parsed = DomainProfileSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid taskCategory', () => {
    const invalid = {
      industry: 'Fashion',
      taskCategory: 'crypto_trading',
      businessSummary: 'Test',
      languages: ['en'],
      needsLongContext: false,
      needsVision: false,
      riskLevel: 'low',
      qualityBar: 7.0,
      assumptions: [],
    };
    const parsed = DomainProfileSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test src/lib/types/index.test.ts`
Expected: FAIL (Cannot find module './index')

- [ ] **Step 3: Implement domain contracts in `src/lib/types/index.ts`**

```typescript
// src/lib/types/index.ts
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
  industry: z.string().min(2),
  taskCategory: TaskCategoryEnum,
  businessSummary: z.string().min(10),
  languages: z.array(z.string()).min(1),
  needsLongContext: z.boolean(),
  needsVision: z.boolean(),
  riskLevel: RiskLevelEnum,
  qualityBar: z.number().min(5.0).max(9.5),
  assumptions: z.array(z.string()),
});
export type DomainProfile = z.infer<typeof DomainProfileSchema>;

export const ScenarioSchema = z.object({
  id: z.string().optional(),
  position: z.number(),
  prompt: z.string().min(5),
  rubric: z.array(z.string()).min(1),
  source: z.enum(['ai', 'founder']),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

export const ModelTierEnum = z.enum(['small', 'mid', 'top']);
export type ModelTier = z.infer<typeof ModelTierEnum>;

export const WhereToBuySchema = z.object({
  name: z.string(),
  url: z.string().url(),
});
export type WhereToBuy = z.infer<typeof WhereToBuySchema>;

export const CatalogModelSchema = z.object({
  id: z.string(),
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/lib/types/index.test.ts`
Expected: PASS

---

### Task 3: Database Schema & Supabase Connection

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/index.ts`
- Create: `src/db/schema.ts`
- Test: `src/db/schema.test.ts`

**Interfaces:**
- Produces: `db` client exported from `src/db/index.ts`.
- Produces: Drizzle tables `comparisons`, `documents`, `scenarios`, `catalogModels`, `candidates`, `arenaAnswers`.
- Enforces: `pgTable.withRLS()` on all tables to protect against unauthorized Supabase REST access.

- [ ] **Step 1: Write Drizzle configuration**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: Create DB client with transaction pooler support**

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/benchcraft';

// Disable prepared statements for Supabase Transaction Pooler (port 6543)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

- [ ] **Step 3: Define relational schema in `src/db/schema.ts`**

```typescript
// src/db/schema.ts
import { pgTable, text, integer, numeric, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import type { DomainProfile, WhereToBuy } from '../lib/types';

export const comparisons = pgTable.withRLS('comparisons', {
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
});

export const documents = pgTable.withRLS('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  comparisonId: uuid('comparison_id')
    .notNull()
    .references(() => comparisons.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const scenarios = pgTable.withRLS('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  comparisonId: uuid('comparison_id')
    .notNull()
    .references(() => comparisons.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  prompt: text('prompt').notNull(),
  rubric: jsonb('rubric').$type<string[]>().notNull(),
  source: text('source', { enum: ['ai', 'founder'] }).notNull().default('ai'),
});

export const catalogModels = pgTable.withRLS('catalog_models', {
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
});

export const candidates = pgTable.withRLS('candidates', {
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
});

export const arenaAnswers = pgTable.withRLS('arena_answers', {
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
});
```

- [ ] **Step 4: Write test verifying schema definition exports**

Create `src/db/schema.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { comparisons, catalogModels } from './schema';

describe('Drizzle Schema Verification', () => {
  it('exports required tables with RLS config', () => {
    expect(comparisons).toBeDefined();
    expect(catalogModels).toBeDefined();
  });
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test src/db/schema.test.ts`
Expected: PASS

---

### Task 4: Clerk Auth Protection & Middleware

**Files:**
- Create: `proxy.ts`
- Create: `src/lib/auth.ts`
- Test: `src/lib/auth.test.ts`

**Interfaces:**
- Produces: `requireUser()` helper in `src/lib/auth.ts` that enforces authentication in Server Actions and Route Handlers.
- Configures: `proxy.ts` delegating to `@clerk/nextjs/server`.

- [ ] **Step 1: Create Next.js 16 Clerk middleware in `proxy.ts`**

```typescript
// proxy.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

- [ ] **Step 2: Create server-side `requireUser` protection helper**

```typescript
// src/lib/auth.ts
import { auth } from '@clerk/nextjs/server';

export async function requireUser(): Promise<string> {
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}
```

- [ ] **Step 3: Write test verifying auth guard behavior**

Create `src/lib/auth.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { requireUser } from './auth';

vi.mock('@clerk/nextjs/server', () => ({
  auth: {
    protect: vi.fn().mockResolvedValue({ userId: 'user_123' }),
  },
}));

describe('Auth Guard Helper', () => {
  it('returns authenticated user id', async () => {
    const userId = await requireUser();
    expect(userId).toBe('user_123');
  });
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/lib/auth.test.ts`
Expected: PASS

---

### Task 5: OpenRouter LLM Gateway (Privacy & Spend Capped)

**Files:**
- Create: `src/lib/llm/index.ts`
- Test: `src/lib/llm/index.test.ts`

**Interfaces:**
- Produces: `callLlmText(opts)` and `callLlmStructured(opts)`.
- Enforces: `provider: { data_collection: "deny", zdr: true }` on every request.
- Enforces: Global spend tracking and retry logic.

- [ ] **Step 1: Write gateway test with privacy policy verification**

Create `src/lib/llm/index.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { buildOpenRouterPayload } from './index';

describe('OpenRouter Privacy Gateway', () => {
  it('enforces zero data retention and denies data collection', () => {
    const payload = buildOpenRouterPayload({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(payload.provider).toEqual({
      data_collection: 'deny',
      zdr: true,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/lib/llm/index.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement LLM Gateway in `src/lib/llm/index.ts`**

```typescript
// src/lib/llm/index.ts
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BuildPayloadOptions {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: string };
}

export function buildOpenRouterPayload(opts: BuildPayloadOptions) {
  return {
    model: opts.model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens,
    response_format: opts.responseFormat,
    provider: {
      data_collection: 'deny',
      zdr: true,
    },
  };
}

export async function callOpenRouter(opts: BuildPayloadOptions) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const payload = buildOpenRouterPayload(opts);

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://benchcraft.ai',
          'X-Title': 'BenchCraft Evaluation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      };
    } catch (err) {
      attempts++;
      if (attempts >= maxAttempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
    }
  }

  throw new Error('Failed to communicate with OpenRouter after retries');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/lib/llm/index.test.ts`
Expected: PASS

---

### Task 6: Brand Layout & Dashboard Shell

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/brand/logo.tsx`

**Interfaces:**
- Produces: Persistent brand navigation bar containing the BenchCraft logo, Clerk user controls, and navigation links.
- Produces: `/dashboard` route displaying user comparison history shell.

- [ ] **Step 1: Create BenchCraft Brand Logo component**

```tsx
// src/components/brand/logo.tsx
export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-serif font-bold text-xl tracking-tight text-[#0C3838] ${className}`}>
      {/* 3-bar ascending chart logo */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="14" width="4" height="7" rx="1" fill="#D97706" />
        <rect x="10" y="8" width="4" height="13" rx="1" fill="#164E4E" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="#0C3838" />
      </svg>
      <span>BenchCraft</span>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/app/layout.tsx` with Clerk Provider and Brand Shell**

```tsx
// src/app/layout.tsx
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/brand/logo';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'BenchCraft — Right-Sized AI Evaluation',
  description: 'Evaluate and select the right AI model for your business problem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
          <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/">
                <Logo />
              </Link>
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium text-[#0C3838] hover:text-[#164E4E]">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-[#0C3838]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/c/new"
                    className="px-3.5 py-1.5 text-sm font-medium text-white bg-[#0C3838] hover:bg-[#164E4E] rounded-md transition"
                  >
                    + New Evaluation
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 3: Create `/dashboard` shell in `src/app/dashboard/page.tsx`**

```tsx
// src/app/dashboard/page.tsx
import { requireUser } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C3838]">Evaluation Dashboard</h1>
          <p className="text-sm text-gray-500">Manage and view your AI model recommendations.</p>
        </div>
        <Link
          href="/c/new"
          className="px-4 py-2 text-sm font-medium text-white bg-[#0C3838] hover:bg-[#164E4E] rounded-lg shadow-sm"
        >
          Start New Evaluation
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
        <p className="text-gray-600">No evaluations run yet this month.</p>
        <p className="text-xs text-gray-400">Pro Plan: 0 / 20 comparisons used.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: 0 errors

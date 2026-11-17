import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function ProductPage() {
  return (
    <div className="space-y-24 py-8">
      {/* Banner Hero */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-display font-display font-semibold text-ink">
          Right-size every model in production.
        </h1>

        <p className="lead text-muted">
          Test candidate models blindly on your business rules, edge cases, and budget.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/c/new" className="btn-ledger">
            Start business evaluation
          </Link>
          <Link href="/case-study" className="btn-ledger-ghost">
            Read Nari case study
          </Link>
        </div>
      </section>

      {/* Architectural Specification Ledger */}
      <section className="space-y-8 pt-12 border-t border-rule">
        <div className="space-y-2">
          <h2 className="text-section font-display font-semibold text-ink">
            Four pillars of empirical model selection.
          </h2>
          <p className="lead text-muted">
            Engineered from first principles for founders and engineering teams managing inference budgets.
          </p>
        </div>

        <div className="ledger-surface divide-y divide-rule">
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs font-semibold text-accent num">Stage 01</div>
              <h3 className="text-title font-display font-semibold text-ink">
                Unstructured domain ingestion
              </h3>
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className="text-md text-muted leading-relaxed">
                Upload customer FAQ sheets, return policies, sizing manuals, or developer specs. Our intake engine analyzes your vocabulary, language distribution, and risk constraints to build an operational profile.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Parsed in volatile RAM and discarded immediately after synthesis</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs font-semibold text-accent num">Stage 02</div>
              <h3 className="text-title font-display font-semibold text-ink">
                Blinded parallel arena
              </h3>
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className="text-md text-muted leading-relaxed">
                We select 5 balanced candidates across Small, Balanced, and Frontier tiers (Anthropic, Google, OpenAI, Meta, DeepSeek). All models answer your scenarios simultaneously under identical prompt and temperature constraints.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5 pill">
                  <ProviderLogo provider="anthropic" size="xs" />
                  <span>Claude Haiku 5.5</span>
                </span>
                <span className="inline-flex items-center gap-1.5 pill">
                  <ProviderLogo provider="google" size="xs" />
                  <span>Gemini 2.5 Flash</span>
                </span>
                <span className="inline-flex items-center gap-1.5 pill">
                  <ProviderLogo provider="deepseek" size="xs" />
                  <span>DeepSeek V3.2</span>
                </span>
                <span className="inline-flex items-center gap-1.5 pill">
                  <ProviderLogo provider="anthropic" size="xs" />
                  <span>Claude Sonnet 5.5</span>
                </span>
                <span className="inline-flex items-center gap-1.5 pill">
                  <ProviderLogo provider="anthropic" size="xs" />
                  <span>Claude Fable 5.1</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs font-semibold text-accent num">Stage 03</div>
              <h3 className="text-title font-display font-semibold text-ink">
                Objective judge at temp 0
              </h3>
            </div>
            <div className="md:col-span-8 space-y-2">
              <p className="text-md text-muted leading-relaxed">
                Candidate outputs are shuffled and anonymized as Candidate A, B, and C to eliminate provider bias. Evaluated at temperature 0.0 against multi-point domain rubrics with verifiable line-by-line rationales.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted font-medium">Calibrated judge:</span>
                <span className="inline-flex items-center gap-1.5 pill text-xs">
                  <ProviderLogo provider="google" size="xs" />
                  <span>Google Gemini 2.5 Flash (temperature: 0.0)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs font-semibold text-signal num">Stage 04</div>
              <h3 className="text-title font-display font-semibold text-ink">
                Deterministic right-sizing
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-md text-muted leading-relaxed">
                Instead of defaulting to the most expensive flagship model, BenchCraft selects the lowest-cost candidate that clears your quality bar with at least a 75% scenario pass rate, projecting exact monthly spend from live token counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-8 pt-12 border-t border-rule">
        <div className="space-y-2">
          <h2 className="text-section font-display font-semibold text-ink">
            Public leaderboards versus domain evaluation.
          </h2>
          <p className="lead text-muted">
            General benchmarks do not measure how an LLM handles your customer return window in Phnom Penh.
          </p>
        </div>

        <div className="ledger-surface overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule text-md">
            <div className="p-7 space-y-4 bg-paper">
              <h3 className="text-title font-display font-semibold text-muted">
                Public leaderboards (LMSYS, MMLU)
              </h3>
              <ul className="space-y-3 text-muted text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-error font-bold">✕</span>
                  <span>Evaluates broad, crowdsourced chatbot queries and trivia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-error font-bold">✕</span>
                  <span>Zero visibility into your company policies, catalogs, or languages</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-error font-bold">✕</span>
                  <span>Ignores unit economics, monthly token volume, and inference cost</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-error font-bold">✕</span>
                  <span>Pushes $1,500/mo models for tasks a $15/mo model solves</span>
                </li>
              </ul>
            </div>

            <div className="p-7 space-y-4 bg-paper-2">
              <h3 className="text-title font-display font-semibold text-ink">
                BenchCraft empirical evaluation
              </h3>
              <ul className="space-y-3 text-ink text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Custom scenarios synthesized directly from your documentation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Tests domain vocabulary, edge-case policies, and required languages</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Calculates exact monthly cost at your projected query volume</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>Provides direct procurement links to</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper border border-rule text-xs font-semibold text-ink">
                      <ProviderLogo provider="aws" size="xs" /> AWS Bedrock
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper border border-rule text-xs font-semibold text-ink">
                      <ProviderLogo provider="google" size="xs" /> Vertex AI
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper border border-rule text-xs font-semibold text-ink">
                      <ProviderLogo provider="openrouter" size="xs" /> OpenRouter
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Band */}
      <section className="ledger-well p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="text-title font-display font-semibold text-ink">
            Ready to audit your model costs?
          </h2>
          <p className="text-md text-muted">
            Run your business context through the automated arena and receive an audited right-sizing recommendation.
          </p>
        </div>
        <Link href="/c/new" className="btn-ledger">
          Start business evaluation
        </Link>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function PricingPage() {
  const [conversations, setConversations] = useState<number>(50000);

  const frontierMonthly = Math.round((conversations / 1000) * 30);
  const rightSizedMonthly = Math.round((conversations / 1000) * 0.3);
  const monthlySavings = frontierMonthly - rightSizedMonthly;
  const yearlySavings = monthlySavings * 12;

  return (
    <div className="space-y-24 py-8">
      {/* Banner Hero */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-display font-display font-semibold text-ink">
          Invest $29. Save thousands in inference waste.
        </h1>

        <p className="lead text-muted">
          Start with a free evaluation and upgrade when you scale across features.
        </p>
      </section>

      {/* Interactive Savings Calculator */}
      <section className="ledger-surface p-6 sm:p-8 space-y-6">
        <div className="border-b border-rule pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Right-sizing ROI calculator
            </h2>
            <p className="text-sm text-muted">
              See how much you save every month by right-sizing away from uncalibrated frontier models.
            </p>
          </div>
          <div className="font-display text-2xl font-bold text-signal num">
            +${monthlySavings.toLocaleString()} / mo saved
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-baseline text-sm text-ink">
            <label htmlFor="volume-range" className="font-semibold">
              Expected monthly conversation volume
            </label>
            <span className="font-display font-semibold text-xl text-ink num">
              {conversations.toLocaleString()} chats / mo
            </span>
          </div>

          <input
            id="volume-range"
            type="range"
            min={1000}
            max={200000}
            step={5000}
            value={conversations}
            onChange={(e) => setConversations(parseInt(e.target.value) || 1000)}
            className="w-full accent-ink cursor-pointer"
          />

          <div className="flex justify-between text-xs text-muted num">
            <span>1,000 / mo</span>
            <span>50,000 / mo (typical startup)</span>
            <span>200,000 / mo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
          <div className="p-4 rounded-card bg-paper border border-rule space-y-1">
            <div className="text-muted">Uncalibrated default (frontier)</div>
            <div className="font-display text-2xl font-semibold text-ink num">
              ${frontierMonthly.toLocaleString()}
            </div>
            <div className="text-xs text-muted num">~$30 per 1,000 chats</div>
          </div>

          <div className="p-4 rounded-card ledger-signal space-y-1">
            <div className="text-signal font-semibold">BenchCraft right-sized pick</div>
            <div className="font-display text-2xl font-bold text-signal num">
              ${rightSizedMonthly.toLocaleString()}
            </div>
            <div className="text-xs text-signal num">~$0.30 per 1,000 chats</div>
          </div>

          <div className="p-4 rounded-card bg-paper border border-rule space-y-1">
            <div className="text-accent font-semibold">Net annual savings</div>
            <div className="font-display text-2xl font-semibold text-accent num">
              +${yearlySavings.toLocaleString()}
            </div>
            <div className="text-xs text-accent">Paid back in less than 1 day</div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Starter Plan */}
        <div className="ledger-surface p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-title font-display font-semibold text-ink">Starter Audit</h3>
              <p className="text-sm text-muted mt-1">
                For evaluating your initial prototype or validating unit economics.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-ink num">$0</span>
              <span className="text-sm text-muted">/ 1 audit</span>
            </div>

            <ul className="space-y-2.5 text-sm text-ink pt-4 border-t border-rule">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>1 full business scenario evaluation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Top 3 models side-by-side comparison</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Right-sized model recommendation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Zero Data Retention guarantee</span>
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger-ghost w-full justify-center">
            Start free evaluation
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="ledger-surface p-7 flex flex-col justify-between space-y-6 border-2 border-ink">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-title font-display font-semibold text-ink">Pro Plan</h3>
              <span className="pill rec">Recommended</span>
            </div>
            <p className="text-sm text-muted">
              For active builders running multiple evaluations and managing token spend.
            </p>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-signal num">$29</span>
              <span className="text-sm text-muted">/ month</span>
            </div>

            <ul className="space-y-2.5 text-sm text-ink pt-4 border-t border-rule">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span><strong>20 evaluations per month</strong> (~$1.45/audit)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Parallel 5-model arena execution</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <ProviderLogo provider="google" size="xs" />
                  <span>Objective Gemini judge with score rationales</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Exportable executive memo for board and investors</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Custom scenario and rubric editor</span>
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger w-full justify-center">
            Subscribe and evaluate
          </Link>
        </div>

        {/* Team Tier */}
        <div className="ledger-surface p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-title font-display font-semibold text-ink">Team Tier</h3>
              <p className="text-sm text-muted mt-1">
                For scale-ups and engineering orgs with custom evaluation datasets.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-ink num">$149</span>
              <span className="text-sm text-muted">/ month</span>
            </div>

            <ul className="space-y-2.5 text-sm text-ink pt-4 border-t border-rule">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Unlimited monthly evaluations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Custom judge models and evaluation rubrics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Multi-seat team workspace with audit logs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Continuous CI/CD regression testing API</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Dedicated support and custom model onboarding</span>
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger-ghost w-full justify-center">
            Start team trial
          </Link>
        </div>
      </section>

      {/* FAQ Section: Rows */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-rule">
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-section font-display font-semibold text-ink">
            Common questions.
          </h2>
          <p className="text-md text-muted">
            How BenchCraft bills, judges, and protects your documents.
          </p>
        </div>

        <div className="lg:col-span-8 divide-y divide-rule">
          <div className="py-5 first:pt-0 space-y-2">
            <h3 className="text-title font-display font-semibold text-ink">
              Do you charge markups on the models I deploy?
            </h3>
            <p className="text-md text-muted leading-relaxed">
              Never. BenchCraft is strictly an evaluation and decision tool. You deploy models directly through your existing AWS Bedrock, Google Cloud Vertex AI, or provider accounts at official list price.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-xs font-semibold text-ink">
                <ProviderLogo provider="aws" size="xs" /> AWS Bedrock
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-xs font-semibold text-ink">
                <ProviderLogo provider="google" size="xs" /> Google Cloud Vertex AI
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-xs font-semibold text-ink">
                <ProviderLogo provider="azure" size="xs" /> Microsoft Azure
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-xs font-semibold text-ink">
                <ProviderLogo provider="openrouter" size="xs" /> OpenRouter
              </span>
            </div>
          </div>

          <div className="py-5 space-y-2">
            <h3 className="text-title font-display font-semibold text-ink">
              What if the cheapest model makes mistakes?
            </h3>
            <p className="text-md text-muted leading-relaxed">
              Our right-sizing engine only recommends a model if it achieves at least a 75% pass rate and clears your defined domain quality threshold (such as 85/100). If a smaller model fails your criteria, the engine steps up to the balanced or frontier tier.
            </p>
          </div>

          <div className="py-5 last:pb-0 space-y-2">
            <h3 className="text-title font-display font-semibold text-ink">
              Can I cancel my subscription at any time?
            </h3>
            <p className="text-md text-muted leading-relaxed">
              Yes. Cancel with one click in your workspace settings and retain full access to all previous evaluation reports and verification memos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

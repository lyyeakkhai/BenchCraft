'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const [conversations, setConversations] = useState<number>(50000);

  // Financial calculations
  // Frontier default: ~$30 per 1k conversations (e.g., Claude 3.5 Sonnet / Opus)
  const frontierMonthly = Math.round((conversations / 1000) * 30);
  // Right-sized pick: ~$0.30 per 1k conversations (e.g., Claude Haiku 5.5 / Gemini Flash)
  const rightSizedMonthly = Math.round((conversations / 1000) * 0.3);
  const monthlySavings = frontierMonthly - rightSizedMonthly;
  const yearlySavings = monthlySavings * 12;

  return (
    <div className="space-y-20 py-6">
      {/* Header */}
      <section className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
          <span className="w-2 h-2 rounded-full bg-[#B87A14]" />
          Founder Economics
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#0A2E2B] leading-[1.15] tracking-tight">
          Invest $29. Save thousands in monthly inference waste.
        </h1>

        <p className="text-base sm:text-lg text-[#4B605C] leading-relaxed">
          Start with a free evaluation. Upgrade when you need continuous right-sizing across multiple features and production prompts.
        </p>
      </section>

      {/* Interactive Savings Calculator */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[#D3DDD8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              Right-Sizing ROI Calculator
            </h2>
            <p className="text-xs text-[#4B605C]">
              See how much you save every month by right-sizing away from uncalibrated frontier models.
            </p>
          </div>
          <div className="font-serif text-2xl font-semibold text-[#8A5A0B]">
            +${monthlySavings.toLocaleString()} / mo saved
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline text-xs text-[#0A2E2B]">
            <span className="font-semibold">Expected Monthly Conversation Volume:</span>
            <span className="font-serif font-semibold text-xl text-[#0A2E2B]">
              {conversations.toLocaleString()} chats / mo
            </span>
          </div>

          <input
            type="range"
            min={1000}
            max={200000}
            step={5000}
            value={conversations}
            onChange={(e) => setConversations(parseInt(e.target.value) || 1000)}
            className="w-full accent-[#0A2E2B] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#4B605C]">
            <span>1,000 / mo</span>
            <span>50,000 / mo (Typical Startup)</span>
            <span>200,000 / mo</span>
          </div>
        </div>

        {/* Comparative Ledger Result */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 rounded-lg bg-[#FAFCFB] border border-[#D3DDD8] space-y-1">
            <div className="text-[#4B605C]">Uncalibrated Default (Frontier)</div>
            <div className="font-serif text-2xl font-semibold text-[#0A2E2B]">
              ${frontierMonthly.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#4B605C]">~$30 per 1,000 chats</div>
          </div>

          <div className="p-4 rounded-lg bg-[#FBF3E2] border border-[#E7B44A] space-y-1">
            <div className="text-[#8A5A0B] font-semibold">BenchCraft Right-Sized Pick</div>
            <div className="font-serif text-2xl font-semibold text-[#8A5A0B]">
              ${rightSizedMonthly.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#8A5A0B]">~$0.30 per 1,000 chats</div>
          </div>

          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] space-y-1">
            <div className="text-[#1F5C55] font-semibold">Net Annual Savings</div>
            <div className="font-serif text-2xl font-semibold text-[#1F5C55]">
              +${yearlySavings.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#1F5C55]">Paid back in less than 1 day</div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Starter Plan */}
        <div className="bg-white border border-[#D3DDD8] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-[#4B605C] uppercase tracking-wider">
                Free Trial
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-1">Starter Audit</h3>
              <p className="text-xs text-[#4B605C] mt-1">
                Perfect for evaluating your initial prototype or validating unit economics.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl font-semibold text-[#0A2E2B]">$0</span>
              <span className="text-xs text-[#4B605C]">/ 1 audit</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#0A2E2B] pt-2 border-t border-[#D3DDD8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                1 full business scenario evaluation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Top 3 models side-by-side comparison
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Right-sized model recommendation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Zero Data Retention guarantee
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger-ghost w-full text-center py-2.5 text-xs">
            Start Free Evaluation
          </Link>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div className="bg-white border-2 border-[#B87A14] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#E7B44A] text-[#0A2E2B] text-[11px] font-bold tracking-wider uppercase">
            Most Popular for Founders
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
                Pro Founder
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-1">Pro Plan</h3>
              <p className="text-xs text-[#4B605C] mt-1">
                For active builders running multiple evaluations and managing token spend.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl font-semibold text-[#8A5A0B]">$29</span>
              <span className="text-xs text-[#4B605C]">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#0A2E2B] pt-2 border-t border-[#D3DDD8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <strong>20 evaluations per month</strong> (~$1.45/audit)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Parallel 5-model arena execution
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Objective Gemini judge with score rationales
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Exportable executive memo for board / investors
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Custom scenario & rubric editor
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger w-full text-center py-2.5 text-xs">
            Subscribe & Evaluate
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white border border-[#D3DDD8] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-[#4B605C] uppercase tracking-wider">
                Team & Scale
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-1">Team Tier</h3>
              <p className="text-xs text-[#4B605C] mt-1">
                For scale-ups and engineering orgs with custom evaluation datasets.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl font-semibold text-[#0A2E2B]">$149</span>
              <span className="text-xs text-[#4B605C]">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#0A2E2B] pt-2 border-t border-[#D3DDD8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Unlimited monthly evaluations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Custom judge models & evaluation rubrics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Multi-seat team workspace with audit logs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Continuous CI/CD regression testing API
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                Dedicated support & custom model onboarding
              </li>
            </ul>
          </div>

          <Link href="/c/new" className="btn-ledger-ghost w-full text-center py-2.5 text-xs">
            Contact Team Sales
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#4B605C]">
            Everything you need to know about BenchCraft pricing and evaluations.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-1.5">
            <h4 className="text-sm font-semibold text-[#0A2E2B]">
              Do you charge markups on the models I deploy?
            </h4>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              Never. BenchCraft is strictly an evaluation and decision intelligence tool. You deploy models directly through your existing AWS Bedrock, Google Cloud Vertex AI, or provider accounts at list price.
            </p>
          </div>

          <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-1.5">
            <h4 className="text-sm font-semibold text-[#0A2E2B]">
              What if the cheapest model makes mistakes?
            </h4>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              Our right-sizing engine only recommends a model if it achieves at least a 75% pass rate and strictly clears your defined domain quality threshold (e.g. 85/100). If a smaller model fails your criteria, the engine automatically steps up to the balanced or frontier tier.
            </p>
          </div>

          <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-1.5">
            <h4 className="text-sm font-semibold text-[#0A2E2B]">
              Can I cancel my subscription at any time?
            </h4>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              Yes. You can cancel with one click in your dashboard settings. You retain full access to all previous evaluation reports and verification memos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

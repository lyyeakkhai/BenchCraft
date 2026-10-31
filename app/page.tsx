import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 py-4">
      {/* Editorial Opening */}
      <section className="max-w-3xl space-y-6 pt-2">
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-[-0.02em] text-[#0A2E2B] leading-[1.15]">
          Right-sized AI model evaluation for founders who care about unit economics.
        </h1>

        <p className="text-base sm:text-lg text-[#4B605C] leading-relaxed max-w-[66ch]">
          Public leaderboards rank general capability on generic benchmarks. BenchCraft tests candidate models
          directly against your business documents, query volume, and quality thresholds in an automated parallel arena.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Link
            href="/c/new"
            className="btn-ledger text-sm sm:text-base px-6 py-3"
          >
            Start Business Evaluation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#case-study"
            className="btn-ledger-ghost text-sm sm:text-base px-5 py-2.5"
          >
            Review Nari Case Study
            <ArrowUpRight className="w-4 h-4 text-[#4B605C]" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#4B605C]">
          <span className="flex items-center gap-1.5 font-semibold text-[#1F5C55]">
            <span className="w-2 h-2 rounded-full bg-[#1F5C55]" />
            ZERO DATA RETENTION
          </span>
          <span className="text-[#A9BDB7]">•</span>
          <span>EMPIRICAL SCENARIO ARENA</span>
          <span className="text-[#A9BDB7]">•</span>
          <span>OFFICIAL LIST PRICING</span>
        </div>
      </section>

      {/* Case Study: Precision Ledger Comparison */}
      <section id="case-study" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D3DDD8] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
              The Cost of Defaulting to Frontier Models
            </h2>
            <p className="text-xs text-[#4B605C] mt-1">
              Empirical case audit: Nari Boutique (Customer Support Chat · 50,000 monthly conversations)
            </p>
          </div>
          <div className="text-xs font-semibold text-[#0A2E2B] bg-[#EDF2EF] px-3.5 py-1.5 rounded-full border border-[#D3DDD8]">
            NET SAVINGS: <span className="font-bold text-[#8A5A0B]">+$1,485.00 / month</span>
          </div>
        </div>

        {/* Ledger Comparison Grid */}
        <div className="border border-[#D3DDD8] bg-white rounded-xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D3DDD8]">
            {/* Frontier Default Column */}
            <div className="p-7 space-y-6 bg-[#FAFCFB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4B605C]">
                  Uncalibrated Default
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                  TOP TIER
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">
                  Claude Fable 5.1 (Frontier Tier)
                </h3>
                <p className="text-xs text-[#4B605C] mt-1 leading-normal">
                  Selected under the assumption that only the largest public leaderboard winner could safely converse with
                  paying customers without hallucinating.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D3DDD8] text-xs">
                <div>
                  <dt className="text-[#4B605C]">Monthly Cost</dt>
                  <dd className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-0.5">$1,500.00</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Annual Expenditure</dt>
                  <dd className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-0.5">$18,000.00</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Cost / 1,000 Chats</dt>
                  <dd className="text-sm font-semibold text-[#0A2E2B] mt-0.5">$30.00</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Measured Scenario Pass</dt>
                  <dd className="text-sm font-semibold text-[#0A2E2B] mt-0.5">100% (8/8)</dd>
                </div>
              </dl>
            </div>

            {/* BenchCraft Right-Sized Model Column */}
            <div className="p-7 space-y-6 bg-white relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B87A14]">
                  BenchCraft Right-Sized Fit
                </span>
                <span className="pill rec">RECOMMENDED</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">Claude Haiku 5.5</h3>
                <p className="text-xs text-[#4B605C] mt-1 leading-normal">
                  Identified after 8 domain scenarios testing apparel sizing, provincial shipping to Siem Reap, and return policies in Khmer and English.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D3DDD8] text-xs">
                <div>
                  <dt className="text-[#4B605C]">Monthly Cost</dt>
                  <dd className="text-2xl font-serif font-semibold text-[#8A5A0B] mt-0.5">$15.00</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Annual Savings</dt>
                  <dd className="text-2xl font-serif font-semibold text-[#8A5A0B] mt-0.5">+$17,820.00</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Cost / 1,000 Chats</dt>
                  <dd className="text-sm font-semibold text-[#0A2E2B] mt-0.5">$0.30</dd>
                </div>
                <div>
                  <dt className="text-[#4B605C]">Domain Fit Score</dt>
                  <dd className="text-sm font-semibold text-[#1F5C55] mt-0.5">88 / 100 (Passes bar: 85)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Methodology from the Pitch Deck */}
      <section id="methodology" className="space-y-8">
        <div className="border-b border-[#D3DDD8] pb-4">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            How BenchCraft Works
          </h2>
          <p className="text-xs text-[#4B605C] mt-1">
            We learn from your business and test models on your use case, not a generic leaderboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
              1. Describe your business
            </div>
            <h3 className="text-base font-semibold text-[#0A2E2B]">Domain Grounding</h3>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              Describe your business and attach your FAQ or policy documents. BenchCraft formulates real-world operational scenarios in memory.
            </p>
          </div>

          <div className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
              2. Compare the top 3
            </div>
            <h3 className="text-base font-semibold text-[#0A2E2B]">Blinded Parallel Arena</h3>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              Candidate models respond in parallel. An objective judge scores responses at temperature 0 against strict rubrics, ranking the top 3 side by side.
            </p>
          </div>

          <div className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
              3. Get one recommendation
            </div>
            <h3 className="text-base font-semibold text-[#0A2E2B]">Right-Sizing & Savings</h3>
            <p className="text-xs text-[#4B605C] leading-relaxed">
              One right-sized recommendation with exact monthly and annual savings, volume stress projections, and direct cloud procurement links.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section (From Slide 8) */}
      <section id="pricing" className="space-y-6 pt-2 border-t border-[#D3DDD8]">
        <div className="max-w-xl">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Simple Founder Economics
          </h2>
          <p className="text-xs text-[#4B605C] mt-1">
            One right-sized model choice saves thousands of dollars in monthly inference waste.
          </p>
        </div>

        <div className="border border-[#D3DDD8] bg-white rounded-xl p-8 max-w-lg space-y-6 shadow-xs">
          <div className="flex items-baseline justify-between border-b border-[#D3DDD8] pb-5">
            <div>
              <h3 className="text-lg font-semibold text-[#0A2E2B]">Pro Founder Plan</h3>
              <p className="text-xs text-[#4B605C]">For founders and growing product teams</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-serif font-semibold text-[#0A2E2B]">$29</span>
              <span className="text-xs text-[#4B605C]"> / month</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-[#0A2E2B]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              Includes 20 comprehensive arena evaluations per month
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              Parallel execution across 5 candidate models per evaluation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              Objective rubric scoring with per-scenario rationale audit
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              Exportable executive memos for investor or board review
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              Zero Data Retention: files discarded immediately after evaluation
            </li>
          </ul>

          <Link
            href="/c/new"
            className="btn-ledger w-full text-center py-3 text-sm justify-center"
          >
            Start Evaluating Models
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  FileCheck2,
} from 'lucide-react';
import { InteractiveRoiDemo } from '@/components/marketing/interactive-roi-demo';

export default function HomePage() {
  return (
    <div className="space-y-24 py-6">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Billion-Dollar Silicon Valley SaaS Stance               */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-4 space-y-8 max-w-4xl mx-auto text-center sm:text-left">
        {/* Subtle Ambient Mesh Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1F5C55]/8 via-[#B87A14]/6 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Live Operational Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#1F5C55] animate-pulse" />
          <span>Zero Data Retention Active</span>
          <span className="text-[#A9BDB7]">|</span>
          <span className="text-[#1F5C55]">Temp-0 LLM Judge Arena</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-serif font-semibold tracking-[-0.03em] text-[#0A2E2B] leading-[1.12]">
            Right-sized AI model selection for founders who refuse to burn cash on hype.
          </h1>
          <p className="text-base sm:text-xl text-[#4B605C] leading-relaxed max-w-[64ch]">
            Public leaderboards rank general capability on generic trivia. BenchCraft tests candidate models
            directly against your actual customer FAQs, query volume, and quality thresholds in an automated parallel arena.
          </p>
        </div>

        {/* CTA Button Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            href="/c/new"
            className="btn-ledger text-sm sm:text-base px-6 py-3.5 w-full sm:w-auto text-center justify-center shadow-sm"
          >
            Start Business Evaluation
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/dashboard"
            className="btn-ledger-ghost text-sm sm:text-base px-5 py-3 w-full sm:w-auto text-center justify-center"
          >
            Open Control Plane
            <ArrowUpRight className="w-4 h-4 text-[#4B605C]" />
          </Link>
        </div>

        {/* Telemetry Micro-Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 pt-3 text-xs text-[#4B605C]">
          <span className="flex items-center gap-1.5 font-semibold text-[#1F5C55]">
            <ShieldCheck className="w-4 h-4 text-[#1F5C55]" />
            ZERO DATA RETENTION (ZDR)
          </span>
          <span className="text-[#A9BDB7] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-semibold text-[#0A2E2B]">
            <Layers className="w-4 h-4 text-[#1F5C55]" />
            5-MODEL PARALLEL ARENA
          </span>
          <span className="text-[#A9BDB7] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-semibold text-[#8A5A0B]">
            <TrendingDown className="w-4 h-4 text-[#8A5A0B]" />
            94.2% AVG INFERENCE SAVINGS
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE ARENA SHOWCASE: The Nari Boutique Live Audit              */}
      {/* ========================================================================= */}
      <section id="case-study" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D3DDD8] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0A2E2B]">
              The Cost of Defaulting to Frontier Models
            </h2>
            <p className="text-xs sm:text-sm text-[#4B605C] mt-1">
              Empirical case audit: Nari Boutique (Customer Support Chat · 50,000 monthly conversations)
            </p>
          </div>
          <div className="text-xs font-semibold text-[#0A2E2B] bg-white px-4 py-2 rounded-full border border-[#D3DDD8] shadow-xs flex items-center gap-2">
            <span>SAVINGS AUDIT:</span>
            <span className="font-bold text-[#8A5A0B]">+$1,485.00 / month</span>
          </div>
        </div>

        {/* Interactive Client Simulator */}
        <InteractiveRoiDemo />
      </section>

      {/* ========================================================================= */}
      {/* 3. 3-STEP METHODOLOGY: Engineered For Technical Rigor                    */}
      {/* ========================================================================= */}
      <section id="methodology" className="space-y-8">
        <div className="border-b border-[#D3DDD8] pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B87A14] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Empirical Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0A2E2B]">
            How BenchCraft Eliminates Inference Waste
          </h2>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-1">
            We ground evaluation in your specific business documents and test candidate models under identical constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2EF] border border-[#D3DDD8] flex items-center justify-center text-sm font-bold text-[#0A2E2B]">
              01
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#B87A14] uppercase tracking-wider">
                Step 1 · Grounding
              </span>
              <h3 className="text-lg font-serif font-semibold text-[#0A2E2B] mt-0.5">
                Domain Scenario Synthesis
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Upload your customer FAQs, return guidelines, or product catalog. BenchCraft extracts your quality bar
              and synthesizes challenging multi-turn edge cases in memory.
            </p>
            <div className="pt-2 border-t border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero retention — files discarded immediately
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2EF] border border-[#D3DDD8] flex items-center justify-center text-sm font-bold text-[#0A2E2B]">
              02
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#B87A14] uppercase tracking-wider">
                Step 2 · Execution
              </span>
              <h3 className="text-lg font-serif font-semibold text-[#0A2E2B] mt-0.5">
                Blinded Parallel Arena
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Frontier and mid-tier candidate models run side-by-side in real-time. An objective rubric judge at
              temperature 0 scores each answer for accuracy, tone, and hallucination absence.
            </p>
            <div className="pt-2 border-t border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Anonymized & shuffled before judging
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2EF] border border-[#D3DDD8] flex items-center justify-center text-sm font-bold text-[#0A2E2B]">
              03
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#B87A14] uppercase tracking-wider">
                Step 3 · Right-Sizing
              </span>
              <h3 className="text-lg font-serif font-semibold text-[#0A2E2B] mt-0.5">
                Financial Right-Sizing
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              We recommend the single most cost-effective model that clears your quality threshold, with verified list pricing,
              cloud procurement links, and executive memos.
            </p>
            <div className="pt-2 border-t border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Average 94.2% cost reduction achieved
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRICING & ROI GUARANTEE: Pro Founder Economics                        */}
      {/* ========================================================================= */}
      <section id="pricing" className="space-y-6 pt-6 border-t border-[#D3DDD8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0A2E2B]">
              Simple, Predictable Founder Economics
            </h2>
            <p className="text-xs sm:text-sm text-[#4B605C] mt-1">
              One right-sized model evaluation returns 50× the monthly subscription cost in saved inference burn.
            </p>
          </div>
          <div className="text-xs text-[#4B605C]">
            All subscriptions backed by Zero Data Retention
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pricing Card */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-8 space-y-6 shadow-md border-2 border-[#1F5C55]/30">
            <div className="flex items-baseline justify-between border-b border-[#D3DDD8] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F5C55]">
                  FOUNDER ALL-ACCESS
                </span>
                <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B] mt-0.5">
                  Pro Founder Plan
                </h3>
                <p className="text-xs text-[#4B605C]">For engineering teams and technical founders</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-serif font-bold text-[#0A2E2B]">$29</span>
                <span className="text-xs text-[#4B605C]"> / month</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#0A2E2B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <span><strong>20 full arena evaluations</strong> per month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <span><strong>5 candidate models</strong> executed in parallel per test</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <span><strong>Temperature 0 rubric judge</strong> with line-by-line rationales</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <span><strong>Exportable executive memos</strong> for board & investor audits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                <span><strong>Zero Data Retention</strong> cryptographic gateway enforcement</span>
              </li>
            </ul>

            <Link
              href="/c/new"
              className="btn-ledger w-full text-center py-3.5 text-sm font-semibold justify-center shadow-sm"
            >
              Start Evaluating Models Now
            </Link>
          </div>

          {/* Value Calculation Callout */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#D3DDD8] space-y-3 shadow-xs">
              <div className="text-xs font-semibold text-[#8A5A0B] uppercase tracking-wider">
                The Return on Investment
              </div>
              <div className="font-serif text-3xl font-semibold text-[#0A2E2B]">
                $29 / month saves $1,485 / month
              </div>
              <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
                Most companies waste thousands per month by defaulting to top-tier frontier models like Claude 3.5 Sonnet or GPT-4o for repetitive customer chat, classification, or extraction tasks that lightweight models handle flawlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EDF2EF] border border-[#D3DDD8] space-y-2">
              <div className="font-semibold text-xs text-[#0A2E2B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1F5C55]" />
                Strict Privacy Guarantee
              </div>
              <p className="text-xs text-[#4B605C] leading-relaxed">
                BenchCraft operates exclusively through Zero Data Retention (ZDR) endpoints. Your business documents, prompt templates, and evaluation answers are never used for model training or persisted outside your session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

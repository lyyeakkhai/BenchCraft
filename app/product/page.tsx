import Link from 'next/link';
import {
  Layers,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="space-y-20 py-6">
      {/* Product Hero */}
      <section className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
          <span className="w-2 h-2 rounded-full bg-[#B87A14]" />
          The Empirical Evaluation Engine
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#0A2E2B] leading-[1.15] tracking-tight">
          Stop guessing which model to run in production.
        </h1>

        <p className="text-base sm:text-lg text-[#4B605C] leading-relaxed">
          Public leaderboards test models on high-school trivia, generic math, and canned riddles. BenchCraft tests
          candidate models directly against your real business rules, customer edge cases, and monthly budget limits.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/c/new" className="btn-ledger px-6 py-3 text-sm">
            Start Business Evaluation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/case-study" className="btn-ledger-ghost px-5 py-2.5 text-sm">
            Read Nari Case Study
          </Link>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="space-y-6">
        <div className="border-b border-[#D3DDD8] pb-4">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Five Pillars of Empirical Model Selection
          </h2>
          <p className="text-xs text-[#4B605C] mt-1">
            Engineered from first principles for founders and engineering teams managing inference budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Card 1: Domain Ingestion */}
          <div className="md:col-span-7 bg-white border border-[#D3DDD8] rounded-xl p-7 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#1F5C55]" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              1. Unstructured Domain Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Upload customer FAQ sheets, return policies, sizing manuals, or developer specs. Our intake engine analyzes
              your vocabulary, language distribution, and risk constraints to build an operational profile of your application.
            </p>
            <div className="p-3 bg-[#EDF2EF] rounded-lg border border-[#D3DDD8] text-xs text-[#0A2E2B] flex items-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
              <span>
                <strong>Zero Data Retention:</strong> Files are parsed in volatile RAM and immediately discarded. Never stored on disk or used for training.
              </span>
            </div>
          </div>

          {/* Bento Card 2: Blind Arena */}
          <div className="md:col-span-5 bg-white border border-[#D3DDD8] rounded-xl p-7 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#1F5C55]" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              2. Blinded Parallel Arena
            </h3>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              We select 5 balanced candidates across Cheap, Balanced, and Frontier tiers (Anthropic, Google, OpenAI, Meta, DeepSeek). All models answer your domain scenarios in parallel under identical temperature settings.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[11px] text-[#4B605C]">
              <span className="bg-[#EDF2EF] px-2 py-0.5 rounded border border-[#D3DDD8]">Claude 3.5 Sonnet</span>
              <span className="bg-[#EDF2EF] px-2 py-0.5 rounded border border-[#D3DDD8]">Claude Haiku 5.5</span>
              <span className="bg-[#EDF2EF] px-2 py-0.5 rounded border border-[#D3DDD8]">Gemini 2.5 Flash</span>
              <span className="bg-[#EDF2EF] px-2 py-0.5 rounded border border-[#D3DDD8]">DeepSeek V3</span>
            </div>
          </div>

          {/* Bento Card 3: Objective Judge */}
          <div className="md:col-span-5 bg-white border border-[#D3DDD8] rounded-xl p-7 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#B87A14]" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              3. Objective Judge at Temp 0
            </h3>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Candidate outputs are shuffled and anonymized as Candidate A, B, C to eliminate model bias. Evaluated against multi-point domain criteria with verifiable rationales for every score.
            </p>
          </div>

          {/* Bento Card 4: Financial Right-Sizing */}
          <div className="md:col-span-7 bg-white border border-[#D3DDD8] rounded-xl p-7 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#8A5A0B]" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              4. Deterministic Financial Right-Sizing
            </h3>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Instead of defaulting to the most expensive flagship model, BenchCraft applies a mathematical optimization: pick the lowest-cost model that passes your quality bar with at least a 75% pass rate.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8]">
                <div className="text-[10px] text-[#4B605C]">Default Model</div>
                <div className="font-semibold text-[#0A2E2B] mt-0.5">$1,500 / mo</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FBF3E2] border border-[#E7B44A]">
                <div className="text-[10px] text-[#8A5A0B]">Right-Sized Pick</div>
                <div className="font-bold text-[#8A5A0B] mt-0.5">$15 / mo</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8]">
                <div className="text-[10px] text-[#1F5C55]">Monthly Delta</div>
                <div className="font-semibold text-[#1F5C55] mt-0.5">-$1,485 / mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Generic Leaderboards vs. BenchCraft */}
      <section className="space-y-6">
        <div className="border-b border-[#D3DDD8] pb-4">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            How BenchCraft Differs from Public Leaderboards
          </h2>
          <p className="text-xs text-[#4B605C] mt-1">
            General purpose benchmarks do not measure how an LLM handles your customer return window in Phnom Penh.
          </p>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D3DDD8] text-xs">
            <div className="p-6 space-y-3 bg-[#FAFCFB]">
              <div className="text-[11px] font-semibold text-[#4B605C] uppercase tracking-wider">
                Public Leaderboards (LMSYS, MMLU)
              </div>
              <ul className="space-y-2.5 text-[#4B605C]">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Evaluates broad, crowdsourced chatbot queries and trivia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Zero visibility into your company policies, catalogs, or languages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Ignores unit economics, monthly token volume, and inference cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Incentivizes selecting $1,500/mo models for tasks a $15/mo model solves.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 space-y-3 bg-white">
              <div className="text-[11px] font-semibold text-[#1F5C55] uppercase tracking-wider">
                BenchCraft Empirical Evaluation
              </div>
              <ul className="space-y-2.5 text-[#0A2E2B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                  <span>Custom scenarios synthesized directly from your real documentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                  <span>Tests domain vocabulary, edge-case policies, and required languages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                  <span>Calculates exact monthly cost at your projected query volume.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                  <span>Provides direct procurement endpoints to AWS Bedrock, Vertex AI, and direct APIs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl text-center sm:text-left">
          <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Ready to audit your model costs?
          </h3>
          <p className="text-xs sm:text-sm text-[#4B605C]">
            Run your business context through the automated arena and receive an audited right-sizing recommendation in minutes.
          </p>
        </div>
        <Link href="/c/new" className="btn-ledger px-6 py-3 text-sm whitespace-nowrap">
          Start Business Evaluation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

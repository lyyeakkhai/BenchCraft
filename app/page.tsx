import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Tailored Model Evaluation for Technical Founders
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0C3838] leading-tight">
          Stop overpaying for AI models that are too big.
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Public leaderboards tell you which model is biggest. BenchCraft tells you which model is{' '}
          <strong className="text-[#0C3838]">right-sized</strong> for your business problem, measured on your own
          documents and use cases.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/c/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-[#0C3838] hover:bg-[#164E4E] transition shadow-md"
          >
            Start Business Evaluation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#case-study"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
          >
            See Real Savings Example
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Under 10 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Data Retention
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-600" /> Tested on your actual domain
          </span>
        </div>
      </section>

      {/* Case Study Card (Nari Boutique) */}
      <section id="case-study" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Representative Case Study</span>
            <h2 className="text-2xl font-bold text-[#0C3838]">Nari Boutique (Fashion E-Commerce)</h2>
            <p className="text-sm text-gray-500">Customer Support Chatbot · 50,000 conversations/month</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <TrendingDown className="w-3.5 h-3.5" /> 99% Monthly Savings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-red-100 bg-red-50/40 rounded-xl p-5 space-y-3">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wide">Without BenchCraft (Guessing)</div>
            <div className="text-lg font-bold text-gray-900">Frontier Top-Tier Model</div>
            <p className="text-sm text-gray-600">
              Founder defaulted to the biggest model on the leaderboard assuming it was required for high customer trust.
            </p>
            <div className="pt-2">
              <div className="text-2xl font-black text-red-600">$1,500 / mo</div>
              <div className="text-xs text-gray-500">$18,000 / year API cost</div>
            </div>
          </div>

          <div className="border-2 border-[#0C3838] bg-emerald-50/20 rounded-xl p-5 space-y-3 relative">
            <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded bg-[#0C3838] text-white">
              BenchCraft Recommendation
            </div>
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wide">Right-Sized Model</div>
            <div className="text-lg font-bold text-gray-900">Gemini 2.5 Flash-Lite</div>
            <p className="text-sm text-gray-600">
              BenchCraft ran 8 fashion scenarios: Flash-Lite passed sizing & shipping queries with a 96% quality score.
            </p>
            <div className="pt-2">
              <div className="text-2xl font-black text-[#0C3838]">$15 / mo</div>
              <div className="text-xs font-semibold text-emerald-700">Net saving: $1,485 / month ($17,820 / year)</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-[#0C3838]">How BenchCraft Works</h2>
          <p className="text-gray-600">From business description to calibrated decision in under 10 minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0C3838] font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-gray-900">1. Domain Intake</h3>
            <p className="text-sm text-gray-600">
              Describe your business and attach sample documents (policies, catalogs, guides). We analyze industry, risk level, and usage.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#D97706] font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-gray-900">2. Automated Arena</h3>
            <p className="text-sm text-gray-600">
              We generate realistic scenarios tailored to your business, run candidates in parallel via OpenRouter, and grade answers against your rubrics.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0C3838] font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-gray-900">3. Right-Sized Decision</h3>
            <p className="text-sm text-gray-600">
              Get side-by-side Top 3 comparison, exact monthly running costs, proven savings, and direct links to where to buy the model.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Display-only as agreed in MVP scope) */}
      <section className="max-w-3xl mx-auto text-center space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-[#0C3838]">Simple, Transparent Pricing</h2>
        <div className="bg-white border-2 border-[#0C3838] rounded-2xl p-8 max-w-md mx-auto shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Pro Founder Plan</span>
            <div className="text-4xl font-extrabold text-[#0C3838]">$29 <span className="text-base font-normal text-gray-500">/ month</span></div>
            <p className="text-xs text-gray-500">Break even on your first model selection</p>
          </div>

          <ul className="text-left text-sm space-y-3 text-gray-600 border-y border-gray-100 py-4">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Up to 20 comprehensive model evaluations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Full Automated Arena testing on your domain
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Objective rubric scoring across all candidates
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Shareable executive evaluation reports
            </li>
          </ul>

          <Link
            href="/c/new"
            className="block w-full py-3 px-4 rounded-xl font-semibold text-white bg-[#0C3838] hover:bg-[#164E4E] transition text-sm"
          >
            Start Evaluating Models Now
          </Link>
        </div>
      </section>
    </div>
  );
}

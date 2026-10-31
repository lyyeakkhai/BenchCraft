'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingDown, Sparkles, Shield, Cpu } from 'lucide-react';

export function InteractiveRoiDemo() {
  const [volume, setVolume] = useState<number>(50000);
  const [activeTab, setActiveTab] = useState<'financial' | 'scenario'>('financial');

  // Pricing assumptions based on verified Nari Boutique benchmark:
  // Frontier (Top Tier): $30 / 1,000 conversations
  // Right-Sized (Haiku 5.5): $0.30 / 1,000 conversations
  const frontierMonthly = Math.round((volume / 1000) * 30);
  const rightSizedMonthly = Math.round((volume / 1000) * 0.30);
  const monthlySavings = frontierMonthly - rightSizedMonthly;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-[#D3DDD8]/80 relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#1F5C55]/5 to-[#B87A14]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Volume Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D3DDD8] pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EDF2EF] border border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C55] animate-pulse" />
            Interactive Financial Arena Simulator
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#0A2E2B]">
            Nari Boutique Empirical Case Audit
          </h3>
          <p className="text-xs text-[#4B605C] mt-0.5">
            Real customer support workload: bilingual Khmer/English sizing, shipping, and exchange queries.
          </p>
        </div>

        {/* Volume Preset Selector Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <span className="text-xs font-semibold text-[#4B605C]">Monthly Volume:</span>
          <div className="inline-flex p-1 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8] text-xs font-semibold">
            {[
              { label: '25K chats', value: 25000 },
              { label: '50K chats', value: 50000 },
              { label: '100K chats', value: 100000 },
              { label: '250K chats', value: 250000 },
            ].map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setVolume(preset.value)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  volume === preset.value
                    ? 'bg-white text-[#0A2E2B] shadow-xs'
                    : 'text-[#4B605C] hover:text-[#0A2E2B]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Switcher: Financials vs Scenario Audit */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-[#0A2E2B] text-white'
                : 'bg-white border border-[#D3DDD8] text-[#4B605C] hover:text-[#0A2E2B]'
            }`}
          >
            Cost & Runway Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scenario')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'scenario'
                ? 'bg-[#0A2E2B] text-white'
                : 'bg-white border border-[#D3DDD8] text-[#4B605C] hover:text-[#0A2E2B]'
            }`}
          >
            Audited Scenario Dialogue
          </button>
        </div>

        <div className="text-xs text-[#8A5A0B] font-semibold bg-[#FBF3E2] px-3 py-1 rounded-full border border-[#E7B44A]/60 flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>99.0% Cost Reduction</span>
        </div>
      </div>

      {/* Tab Content 1: Financial & Runway Ledger */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: Uncalibrated Frontier Default */}
            <div className="p-6 rounded-xl border border-[#D3DDD8] bg-white/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4B605C]">
                  Uncalibrated Default
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  FRONTIER TIER
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-semibold text-[#0A2E2B]">
                  Claude Fable 5.1
                </h4>
                <p className="text-xs text-[#4B605C] mt-0.5">
                  Overkill generalist selected from generic public leaderboards without testing domain requirements.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#D3DDD8] text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Monthly Inference Spend:</span>
                  <span className="font-serif font-bold text-2xl text-[#0A2E2B]">
                    ${frontierMonthly.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Annual Cloud Burn:</span>
                  <span className="font-semibold text-sm text-[#0A2E2B]">
                    ${(frontierMonthly * 12).toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Cost per 1,000 Chats:</span>
                  <span className="font-semibold text-sm text-[#0A2E2B]">$30.00</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Domain Benchmark Score:</span>
                  <span className="font-semibold text-sm text-[#0A2E2B]">95 / 100</span>
                </div>
              </div>
            </div>

            {/* Column 2: BenchCraft Recommended Model */}
            <div className="p-6 rounded-xl border-2 border-[#B87A14] bg-white relative space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A0B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B87A14]" />
                  BenchCraft Right-Sized Model
                </span>
                <span className="pill rec">RECOMMENDED</span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-semibold text-[#0A2E2B]">
                  Claude Haiku 5.5
                </h4>
                <p className="text-xs text-[#4B605C] mt-0.5">
                  Passed all 8 domain scenarios testing size guidelines, provincial shipping, and Khmer FAQs.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#D3DDD8] text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Monthly Inference Spend:</span>
                  <span className="font-serif font-bold text-2xl text-[#8A5A0B]">
                    ${rightSizedMonthly.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Annual Savings Redirected:</span>
                  <span className="font-bold text-sm text-[#8A5A0B]">
                    +${annualSavings.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Cost per 1,000 Chats:</span>
                  <span className="font-semibold text-sm text-[#0A2E2B]">$0.30</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#4B605C]">Domain Benchmark Score:</span>
                  <span className="font-semibold text-sm text-[#1F5C55]">
                    88 / 100 <span className="text-[#4B605C] font-normal">(Bar: 85)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight Ribbon */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FBF3E2] to-[#EDF2EF] border border-[#E7B44A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A5A0B] text-white flex items-center justify-center font-bold flex-shrink-0">
                ${monthlySavings.toLocaleString()}
              </div>
              <div>
                <div className="font-semibold text-sm text-[#0A2E2B]">
                  Net Monthly Savings: +${monthlySavings.toLocaleString()}.00 / month
                </div>
                <div className="text-xs text-[#4B605C]">
                  That is ${annualSavings.toLocaleString()} in runway returned to product development each year.
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/evaluations/new"
              className="btn-ledger text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              Test Your Use Case Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab Content 2: Audited Scenario Dialogue */}
      {activeTab === 'scenario' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#EDF2EF] border border-[#D3DDD8] text-xs text-[#0A2E2B] space-y-1">
            <div className="font-semibold">Scenario #4: Provincial Shipping to Siem Reap with Khmer Policy Reference</div>
            <p className="text-[#4B605C]">
              Customer asks: &quot;Can you ship to Siem Reap town by tomorrow, and how much is delivery? Can I exchange if size S doesn&apos;t fit?&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#D3DDD8] bg-white space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#4B605C]">
                <span>Claude Fable 5.1 (Top Tier)</span>
                <span className="text-[#1F5C55]">Score: 10/10 (Pass)</span>
              </div>
              <p className="italic text-[#0A2E2B] leading-relaxed">
                &quot;Yes! We provide 1-2 business day delivery to Siem Reap via Virak Buntham for $2.50. You can exchange unworn items with tags within 7 days at any branch or via return parcel.&quot;
              </p>
              <div className="text-[10px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
                Latency: 720ms · Token Cost: $0.00060 · Rationale: Accurate, grounded in policy.
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-[#B87A14] bg-white space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#8A5A0B]">
                <span>Claude Haiku 5.5 (Right-Sized)</span>
                <span className="text-[#1F5C55]">Score: 9.5/10 (Passes bar)</span>
              </div>
              <p className="italic text-[#0A2E2B] leading-relaxed">
                &quot;Hello! Delivery to Siem Reap takes 24-48 hours ($2.50 flat rate). We gladly offer size exchanges within 7 days as long as the original tags remain attached!&quot;
              </p>
              <div className="text-[10px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
                Latency: 280ms · Token Cost: $0.000006 (100× cheaper!) · Rationale: Flawless customer tone & policy adherence.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

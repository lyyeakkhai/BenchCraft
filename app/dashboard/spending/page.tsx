'use client';

import { useState } from 'react';
import { TrendingDown, ArrowUpRight, ShieldCheck, DollarSign, BarChart3, Layers } from 'lucide-react';
import Link from 'next/link';

export default function SpendAnalyticsPage() {
  const [multiplier, setMultiplier] = useState<number>(1);
  const baseVolume = 50000;
  const currentVolume = baseVolume * multiplier;

  // Cost estimates at current volume
  const frontierCost = Math.round((currentVolume / 1000) * 30);
  const rightSizedCost = Math.round((currentVolume / 1000) * 0.3);
  const monthlySavings = frontierCost - rightSizedCost;
  const annualSavings = monthlySavings * 12;

  // Monthly timeline projection for 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const trendData = months.map((m, i) => {
    const vol = baseVolume * (1 + i * 0.15) * multiplier;
    const fCost = Math.round((vol / 1000) * 30);
    const rCost = Math.round((vol / 1000) * 0.3);
    return {
      month: m,
      frontier: fCost,
      rightSized: rCost,
      saved: fCost - rCost,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3DDD8] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
            Inference Spend Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-0.5">
            Track token expenditure, right-sizing capital savings, and volume stress projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/evaluations/new" className="btn-ledger text-xs sm:text-sm px-4 py-2">
            Run Right-Sizing Test
          </Link>
        </div>
      </div>

      {/* Top 3 High-Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FBF3E2] border-2 border-[#B87A14] rounded-xl p-6 space-y-1">
          <div className="text-xs font-semibold text-[#8A5A0B] uppercase tracking-wider">
            Net Monthly Capital Retained
          </div>
          <div className="font-serif text-4xl font-semibold text-[#8A5A0B]">
            +${monthlySavings.toLocaleString()}
          </div>
          <p className="text-xs text-[#0A2E2B]">
            ${annualSavings.toLocaleString()} / year redirected from cloud bills to startup runway.
          </p>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-1">
          <div className="text-xs font-semibold text-[#4B605C] uppercase tracking-wider">
            Unit Cost Per 1,000 Chats
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl font-semibold text-[#0A2E2B]">$0.30</span>
            <span className="text-xs text-[#4B605C] line-through">$30.00</span>
          </div>
          <p className="text-xs text-[#1F5C55] font-semibold">
            99% unit economic improvement on calibrated models
          </p>
        </div>

        <div className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-1">
          <div className="text-xs font-semibold text-[#4B605C] uppercase tracking-wider">
            Projected Monthly Volume
          </div>
          <div className="font-serif text-4xl font-semibold text-[#0A2E2B]">
            {currentVolume.toLocaleString()}
          </div>
          <p className="text-xs text-[#4B605C]">
            Conversations evaluated across active domains
          </p>
        </div>
      </div>

      {/* Volume Stress Test Simulator */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D3DDD8] pb-4">
          <div>
            <h2 className="text-lg font-serif font-semibold text-[#0A2E2B]">
              Scale Stress Test Simulator
            </h2>
            <p className="text-xs text-[#4B605C]">
              Model how cloud inference expenditure scales as your application 2x, 5x, or 10x in traffic.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 5, 10].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMultiplier(m)}
                className={`text-xs px-3 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                  multiplier === m
                    ? 'bg-[#0A2E2B] border-[#0A2E2B] text-white'
                    : 'bg-white border-[#D3DDD8] text-[#4B605C] hover:border-[#0A2E2B]'
                }`}
              >
                {m}x Volume
              </button>
            ))}
          </div>
        </div>

        {/* Comparative Bars */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#0A2E2B]">
                Uncalibrated Frontier Model (Claude 3.5 Sonnet / Opus)
              </span>
              <span className="font-serif font-semibold text-sm text-[#0A2E2B]">
                ${frontierCost.toLocaleString()} / mo
              </span>
            </div>
            <div className="w-full bg-[#EDF2EF] rounded-full h-3 overflow-hidden">
              <div className="bg-[#4B605C] h-3 rounded-full w-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#8A5A0B]">
                BenchCraft Right-Sized Model (Claude Haiku 5.5 / Gemini Flash)
              </span>
              <span className="font-serif font-semibold text-sm text-[#8A5A0B]">
                ${rightSizedCost.toLocaleString()} / mo
              </span>
            </div>
            <div className="w-full bg-[#EDF2EF] rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#B87A14] h-3 rounded-full"
                style={{ width: `${Math.max(2, (rightSizedCost / frontierCost) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] text-xs text-[#0A2E2B]">
          <strong>Financial Insight:</strong> At {currentVolume.toLocaleString()} conversations per month,
          running an uncalibrated frontier model incurs <strong>${frontierCost.toLocaleString()}/month</strong>,
          whereas the right-sized pick clears your quality bar for only <strong>${rightSizedCost.toLocaleString()}/month</strong>.
        </div>
      </section>

      {/* 6-Month Spend Trajectory Table */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">
            6-Month Growth & Cumulative Savings Projection
          </h3>
          <p className="text-xs text-[#4B605C]">
            Estimated trajectory factoring 15% monthly user compounding.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#D3DDD8] rounded-lg overflow-hidden">
            <thead className="bg-[#FAFCFB] border-b border-[#D3DDD8] text-[#4B605C]">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Frontier Spend</th>
                <th className="p-3">Right-Sized Spend</th>
                <th className="p-3">Monthly Savings</th>
                <th className="p-3">Savings Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3DDD8]">
              {trendData.map((row) => (
                <tr key={row.month} className="hover:bg-[#FAFCFB]">
                  <td className="p-3 font-semibold text-[#0A2E2B]">{row.month}</td>
                  <td className="p-3 text-[#4B605C]">${row.frontier.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-[#0A2E2B]">${row.rightSized.toLocaleString()}</td>
                  <td className="p-3 font-serif font-semibold text-[#8A5A0B]">+${row.saved.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#EDF2EF] text-[#1F5C55] font-semibold text-[11px]">
                      99% Less
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

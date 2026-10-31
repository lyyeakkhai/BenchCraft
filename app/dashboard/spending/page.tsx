'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function SpendAnalyticsPage() {
  const [multiplier, setMultiplier] = useState<number>(1);
  const baseVolume = 50000;
  const currentVolume = baseVolume * multiplier;

  const frontierCost = Math.round((currentVolume / 1000) * 30);
  const rightSizedCost = Math.round((currentVolume / 1000) * 0.3);
  const monthlySavings = frontierCost - rightSizedCost;
  const annualSavings = monthlySavings * 12;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">
            Inference spend analytics
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Track token expenditure, right-sizing capital savings, and volume stress projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/evaluations/new" className="btn-ledger btn-sm">
            Run right-sizing test
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ledger-signal p-6 space-y-1">
          <div className="text-xs font-semibold text-signal">
            Net monthly capital retained
          </div>
          <div className="font-display text-4xl font-bold text-signal num">
            +${monthlySavings.toLocaleString()}
          </div>
          <p className="text-xs text-ink num">
            ${annualSavings.toLocaleString()} / year redirected from cloud bills to startup runway.
          </p>
        </div>

        <div className="ledger-surface p-6 space-y-1">
          <div className="text-xs font-semibold text-muted">
            Unit cost per 1,000 chats
          </div>
          <div className="flex items-baseline gap-2 num">
            <span className="font-display text-4xl font-semibold text-ink">$0.30</span>
            <span className="text-xs text-muted line-through">$30.00</span>
          </div>
          <p className="text-xs text-accent font-semibold">
            Calibrated unit economics vs frontier tier
          </p>
        </div>

        <div className="ledger-surface p-6 space-y-1">
          <div className="text-xs font-semibold text-muted">
            Projected monthly volume
          </div>
          <div className="font-display text-4xl font-semibold text-ink num">
            {currentVolume.toLocaleString()}
          </div>
          <p className="text-xs text-muted">
            Conversations evaluated across active domains
          </p>
        </div>
      </div>

      <section className="ledger-surface p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-4">
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Scale stress test simulator
            </h2>
            <p className="text-sm text-muted">
              Model how cloud inference expenditure scales as your application grows 2×, 5×, or 10× in traffic.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 5, 10].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMultiplier(m)}
                className={`text-xs px-3 py-1.5 rounded-input border font-semibold transition-colors cursor-pointer whitespace-nowrap num ${
                  multiplier === m
                    ? 'bg-ink border-ink text-paper-2'
                    : 'bg-paper border-rule text-muted hover:border-ink'
                }`}
              >
                {m}× volume
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-ink inline-flex items-center gap-2">
                <ProviderLogo provider="anthropic" size="xs" />
                <span>Uncalibrated frontier model (Claude 3.5 Sonnet / Opus)</span>
              </span>
              <span className="font-display font-semibold text-md text-ink num">
                ${frontierCost.toLocaleString()} / mo
              </span>
            </div>
            <div className="w-full bg-paper-3 rounded-pill h-3 overflow-hidden">
              <div className="bg-muted h-3 rounded-pill w-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-signal inline-flex items-center gap-2">
                <ProviderLogo provider="google" size="xs" />
                <span>BenchCraft right-sized model (Claude Haiku 5.5 / Gemini Flash)</span>
              </span>
              <span className="font-display font-semibold text-md text-signal num">
                ${rightSizedCost.toLocaleString()} / mo
              </span>
            </div>
            <div className="w-full bg-paper-3 rounded-pill h-3 overflow-hidden">
              <div
                className="bg-signal h-3 rounded-pill"
                style={{ width: `${Math.max(2, (rightSizedCost / frontierCost) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-card bg-paper border border-rule text-sm text-ink num">
          <strong>Financial insight:</strong> At {currentVolume.toLocaleString()} conversations per month, running an uncalibrated frontier model incurs <strong>${frontierCost.toLocaleString()}/month</strong>, whereas the right-sized pick clears your quality bar for <strong>${rightSizedCost.toLocaleString()}/month</strong>.
        </div>
      </section>

      <section className="ledger-surface p-6 space-y-4">
        <div>
          <h3 className="text-title font-display font-semibold text-ink">
            6-month growth and cumulative savings projection
          </h3>
          <p className="text-sm text-muted">
            Estimated trajectory factoring 15% monthly user compounding.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-paper border-b border-rule text-muted">
              <tr>
                <th className="p-3 font-semibold whitespace-nowrap">Month</th>
                <th className="p-3 font-semibold whitespace-nowrap">Frontier spend</th>
                <th className="p-3 font-semibold whitespace-nowrap">Right-sized spend</th>
                <th className="p-3 font-semibold whitespace-nowrap">Monthly savings</th>
                <th className="p-3 font-semibold whitespace-nowrap">Unit rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule num">
              {trendData.map((row) => (
                <tr key={row.month} className="hover:bg-paper">
                  <td className="p-3 font-semibold text-ink">{row.month}</td>
                  <td className="p-3 text-muted">${row.frontier.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-ink">${row.rightSized.toLocaleString()}</td>
                  <td className="p-3 font-display font-semibold text-signal">+${row.saved.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="pill">
                      $0.30 / 1k
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

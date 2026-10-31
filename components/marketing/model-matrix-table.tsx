'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, AlertCircle, ArrowUpRight, Shield, ArrowUpDown } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  tier: 'recommended' | 'frontier' | 'mid' | 'lightweight' | 'open-source';
  passedCount: number;
  totalCount: number;
  domainFit: number;
  latencyMs: number;
  costMonthly: number;
  costPer1k: number;
  verdict: string;
  isRecommended?: boolean;
}

const MODELS_DATA: ModelEntry[] = [
  {
    id: 'haiku-5-5',
    name: 'Claude Haiku 5.5',
    provider: 'Anthropic',
    tier: 'recommended',
    passedCount: 8,
    totalCount: 8,
    domainFit: 88,
    latencyMs: 280,
    costMonthly: 15.0,
    costPer1k: 0.3,
    verdict: 'Lowest-cost model clearing the 85/100 threshold. 99% savings.',
    isRecommended: true,
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta / Groq',
    tier: 'open-source',
    passedCount: 8,
    totalCount: 8,
    domainFit: 87,
    latencyMs: 195,
    costMonthly: 24.0,
    costPer1k: 0.48,
    verdict: 'Blazing sub-200ms speed; clears threshold with strong Khmer grammar.',
  },
  {
    id: 'nvidia-nemotron-70b',
    name: 'Nemotron 3.1 70B',
    provider: 'NVIDIA AI',
    tier: 'mid',
    passedCount: 8,
    totalCount: 8,
    domainFit: 91,
    latencyMs: 230,
    costMonthly: 35.0,
    costPer1k: 0.70,
    verdict: 'TensorRT-LLM optimized. Outstanding reasoning and alignment at low inference cost.',
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    tier: 'lightweight',
    passedCount: 8,
    totalCount: 8,
    domainFit: 90,
    latencyMs: 340,
    costMonthly: 112.5,
    costPer1k: 2.25,
    verdict: 'Excellent multilingual reasoning; 7.5× cost for 2 extra fit points.',
  },
  {
    id: 'claude-sonnet-5-5',
    name: 'Claude Sonnet 5.5',
    provider: 'Anthropic',
    tier: 'mid',
    passedCount: 8,
    totalCount: 8,
    domainFit: 93,
    latencyMs: 510,
    costMonthly: 300.0,
    costPer1k: 6.0,
    verdict: 'Mid-frontier benchmark; 20× cost of calibrated Haiku pick.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    tier: 'lightweight',
    passedCount: 7,
    totalCount: 8,
    domainFit: 82,
    latencyMs: 310,
    costMonthly: 18.5,
    costPer1k: 0.37,
    verdict: 'Missed Khmer provincial address parsing; falls below 85 bar.',
  },
  {
    id: 'claude-fable-5-1',
    name: 'Claude Fable 5.1',
    provider: 'Anthropic',
    tier: 'frontier',
    passedCount: 8,
    totalCount: 8,
    domainFit: 95,
    latencyMs: 720,
    costMonthly: 1500.0,
    costPer1k: 30.0,
    verdict: 'Uncalibrated default; 100× cost of right-sized model for +7 fit points.',
  },
];

export function ModelMatrixTable() {
  const [filter, setFilter] = useState<'all' | 'recommended' | 'frontier' | 'lightweight'>('all');
  const [sortBy, setSortBy] = useState<'roi' | 'cost' | 'fit' | 'latency'>('roi');

  const filteredModels = MODELS_DATA.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'recommended') return m.isRecommended;
    if (filter === 'frontier') return m.tier === 'frontier' || m.tier === 'mid';
    if (filter === 'lightweight') return m.tier === 'lightweight' || m.tier === 'open-source';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'cost') return a.costMonthly - b.costMonthly;
    if (sortBy === 'fit') return b.domainFit - a.domainFit;
    if (sortBy === 'latency') return a.latencyMs - b.latencyMs;
    return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0);
  });

  return (
    <div className="space-y-5">
      {/* Control Filter & Interactive Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 glass-well rounded-input border border-rule text-xs font-semibold">
          {[
            { id: 'all', label: 'All 6 Candidates' },
            { id: 'recommended', label: 'Calibrated Pick (1)' },
            { id: 'lightweight', label: 'Fast & Budget (3)' },
            { id: 'frontier', label: 'Frontier Tier (2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1.5 rounded-input transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-ink text-paper-2 font-semibold shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Sort Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted font-outlier flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
            SORT BY:
          </span>
          {[
            { id: 'roi', label: 'Best ROI' },
            { id: 'cost', label: 'Lowest Cost' },
            { id: 'fit', label: 'Highest Fit' },
            { id: 'latency', label: 'Fastest Latency' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id as typeof sortBy)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                sortBy === s.id
                  ? 'bg-accent/15 text-accent border border-accent/35 font-semibold'
                  : 'glass-well text-muted hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Glassmorphic Data Matrix Grid */}
      <div className="overflow-x-auto rounded-card glass-card">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-rule glass-well text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider">
              <th className="py-3.5 px-5">Candidate Model</th>
              <th className="py-3.5 px-4">Scenarios (Bar: 85)</th>
              <th className="py-3.5 px-4">Domain Fit</th>
              <th className="py-3.5 px-4">p50 Latency</th>
              <th className="py-3.5 px-4">Monthly Spend</th>
              <th className="py-3.5 px-5">Audit Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {filteredModels.map((model) => (
              <tr
                key={model.id}
                className={`transition-colors ${
                  model.isRecommended
                    ? 'bg-signal-bg/60 hover:bg-signal-bg/90'
                    : 'hover:bg-paper-3/40'
                }`}
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <ProviderLogo provider={model.provider} size="md" />
                    <div>
                      <div className="font-semibold text-ink flex items-center gap-2">
                        {model.name}
                        {model.isRecommended && (
                          <span className="pill rec text-[11px] py-0.5 px-2">
                            Calibrated Pick
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-0.5 font-outlier">{model.provider}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {model.passedCount === model.totalCount ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-error" />
                    )}
                    <span className="font-medium text-ink num">
                      {model.passedCount} / {model.totalCount} passed
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold num ${
                          model.domainFit >= 85 ? 'text-accent' : 'text-error'
                        }`}
                      >
                        {model.domainFit}
                      </span>
                      <span className="text-xs text-muted">/ 100</span>
                    </div>
                    <div className="w-24 h-1.5 bg-rule rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          model.domainFit >= 85 ? 'bg-accent' : 'bg-error'
                        }`}
                        style={{ width: `${model.domainFit}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="text-xs text-muted font-outlier num px-2 py-1 rounded glass-well">
                    {model.latencyMs}ms
                  </span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="space-y-0.5">
                    <div
                      className={`font-editorial font-bold text-lg num ${
                        model.isRecommended ? 'text-signal' : 'text-ink'
                      }`}
                    >
                      ${model.costMonthly.toFixed(2)}
                      <span className="text-xs text-muted font-body font-normal"> / mo</span>
                    </div>
                    <div className="text-[11px] text-muted num font-outlier">
                      ${model.costPer1k.toFixed(2)} / 1k chats
                    </div>
                  </div>
                </td>

                <td className="py-4 px-5 text-xs text-muted max-w-xs leading-relaxed">
                  {model.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Audit Context */}
      <div className="p-4 rounded-card glass-well flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>All candidate benchmarks executed in isolated containers under cryptographic zero data retention.</span>
        </div>
        <Link
          href="/case-study"
          className="inline-flex items-center gap-1 font-semibold text-ink hover:text-accent transition-colors"
        >
          <span>Read full 8-scenario methodology report</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

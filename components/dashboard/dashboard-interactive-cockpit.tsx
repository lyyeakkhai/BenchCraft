'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Scale,
  Terminal,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export function DashboardInteractiveCockpit() {
  const [view, setView] = useState<'frontier' | 'telemetry'>('frontier');
  const [simVolume, setSimVolume] = useState<number>(50000);
  const [simThreshold, setSimThreshold] = useState<number>(85);

  const frontierBurn = Math.round((simVolume / 1000) * 30);
  const midTierBurn = Math.round((simVolume / 1000) * 6);
  const calibratedBurn = Math.max(1, Math.round((simVolume / 1000) * 0.3));
  const netMonthlySaved = frontierBurn - calibratedBurn;
  const netAnnualSaved = netMonthlySaved * 12;

  const modelFleet = [
    {
      name: 'Claude Haiku 5.5',
      provider: 'Anthropic',
      tier: 'Calibrated Optimal',
      fit: 88,
      latency: 280,
      monthlyCost: calibratedBurn,
      isOptimal: true,
    },
    {
      name: 'Llama 3.3 70B',
      provider: 'Meta',
      tier: 'Open-Weights Fast',
      fit: 87,
      latency: 195,
      monthlyCost: Math.max(1, Math.round((simVolume / 1000) * 0.48)),
      isOptimal: false,
    },
    {
      name: 'Gemini 2.5 Flash',
      provider: 'Google',
      tier: 'High-Context Light',
      fit: 90,
      latency: 340,
      monthlyCost: Math.max(2, Math.round((simVolume / 1000) * 2.25)),
      isOptimal: false,
    },
    {
      name: 'Claude Sonnet 5.5',
      provider: 'Anthropic',
      tier: 'Mid-Frontier',
      fit: 93,
      latency: 510,
      monthlyCost: midTierBurn,
      isOptimal: false,
    },
    {
      name: 'Claude Fable 5.1',
      provider: 'Anthropic',
      tier: 'Uncalibrated Flagship',
      fit: 95,
      latency: 720,
      monthlyCost: frontierBurn,
      isOptimal: false,
    },
  ];

  return (
    <section className="glass-card p-6 sm:p-8 space-y-6 relative border border-rule">
      {/* Header + View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rule pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/25">
              Interactive Simulator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight">
            Cost vs. Quality Efficiency Frontier
          </h2>
          <p className="text-sm text-muted">
            Adjust your monthly request volume and quality threshold to simulate fleet savings in real time.
          </p>
        </div>

        <div className="inline-flex p-1 glass-well rounded-input border border-rule text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setView('frontier')}
            className={`px-3 py-1.5 rounded-input transition-all cursor-pointer ${
              view === 'frontier'
                ? 'bg-ink text-paper-2 font-semibold shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Efficiency Frontier
          </button>
          <button
            type="button"
            onClick={() => setView('telemetry')}
            className={`px-3 py-1.5 rounded-input transition-all cursor-pointer ${
              view === 'telemetry'
                ? 'bg-ink text-paper-2 font-semibold shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            ZDR Enclave Telemetry
          </button>
        </div>
      </div>

      {view === 'frontier' ? (
        <div className="space-y-6 relative z-10">
          {/* Interactive Sliders Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-card glass-well space-y-2.5 border border-rule">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted flex items-center gap-1.5 font-medium">
                  <Scale className="w-4 h-4 text-accent" />
                  Monthly Production Volume
                </span>
                <span className="font-display text-accent font-bold tabular-nums text-sm">
                  {simVolume.toLocaleString()} convs / mo
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={simVolume}
                onChange={(e) => setSimVolume(Number(e.target.value))}
                aria-label="Simulated monthly volume"
                className="w-full h-2 bg-paper-3 rounded-lg appearance-none cursor-pointer accent-[#059669] dark:accent-[#10B981]"
              />
              <div className="flex justify-between text-xs text-muted font-medium">
                <span>10K</span>
                <span>50K (Default)</span>
                <span>100K</span>
                <span>250K</span>
              </div>
            </div>

            <div className="p-4 rounded-card glass-well space-y-2.5 border border-rule">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted flex items-center gap-1.5 font-medium">
                  <Zap className="w-4 h-4 text-signal" />
                  Minimum Domain Fit Bar
                </span>
                <span className="font-display text-signal font-bold tabular-nums text-sm">
                  Score: {simThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="94"
                step="1"
                value={simThreshold}
                onChange={(e) => setSimThreshold(Number(e.target.value))}
                aria-label="Minimum domain fit threshold"
                className="w-full h-2 bg-paper-3 rounded-lg appearance-none cursor-pointer accent-[#B45309] dark:accent-[#F59E0B]"
              />
              <div className="flex justify-between text-xs text-muted font-medium">
                <span>80 (Standard)</span>
                <span>85 (Nari Audit)</span>
                <span>90 (Strict)</span>
                <span>94 (Max)</span>
              </div>
            </div>
          </div>

          {/* 3-Column Comparison Cards with Provider Logos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Uncalibrated Default */}
            <div className="p-5 rounded-card glass-well space-y-3.5 border border-rule">
              <div className="flex justify-between items-center text-muted">
                <span className="font-semibold text-ink text-xs uppercase tracking-wider">
                  Uncalibrated Default
                </span>
                <span className="pill text-xs font-medium">Frontier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ProviderLogo provider="anthropic" size="sm" />
                <span className="text-sm font-semibold text-ink">Claude Fable 5.1 / GPT-4o</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-ink tabular-nums tracking-tight flex items-baseline gap-1">
                <span>${frontierBurn.toLocaleString()}.00</span>
                <span className="text-xs font-normal text-muted">/ mo</span>
              </div>
              <div className="w-full bg-paper-3 rounded-full h-2 overflow-hidden border border-rule">
                <div className="bg-muted h-2 rounded-full w-[95%]" />
              </div>
              <div className="flex justify-between text-xs text-muted tabular-nums">
                <span>Domain Fit: 95 / 100</span>
                <span className="text-error font-medium">100× Over-provisioned</span>
              </div>
            </div>

            {/* Calibrated Winner */}
            <div className="p-5 rounded-card bg-accent/5 dark:bg-accent/10 border-2 border-accent/40 space-y-3.5 relative shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-accent text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Calibrated Winner
                </span>
                <span className="pill emerald text-xs font-semibold">Optimal Pick</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ProviderLogo provider={simThreshold <= 88 ? 'anthropic' : 'google'} size="sm" />
                <span className="text-sm font-bold text-ink">
                  {simThreshold <= 88 ? 'Claude Haiku 5.5' : 'Gemini 2.5 Flash'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-accent tabular-nums tracking-tight flex items-baseline gap-1">
                <span>
                  $
                  {(simThreshold <= 88
                    ? calibratedBurn
                    : Math.max(2, Math.round((simVolume / 1000) * 2.25))
                  ).toLocaleString()}
                  .00
                </span>
                <span className="text-xs font-normal text-muted">/ mo</span>
              </div>
              <div className="w-full bg-paper-3 rounded-full h-2 overflow-hidden border border-rule">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: simThreshold <= 88 ? '88%' : '90%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-ink font-semibold tabular-nums">
                <span>
                  Fit: {simThreshold <= 88 ? 88 : 90} / 100 (Bar: {simThreshold})
                </span>
                <span className="text-accent">✓ Clears Bar</span>
              </div>
            </div>

            {/* Net Capital Retained */}
            <div className="p-5 rounded-card glass-well flex flex-col justify-between space-y-3.5 border border-rule">
              <div>
                <div className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Annual Capital Retained
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1 tabular-nums tracking-tight flex items-baseline gap-1">
                  <span>+${netAnnualSaved.toLocaleString()}</span>
                  <span className="text-xs font-normal text-muted">/ yr</span>
                </div>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Saves <strong className="text-ink tabular-nums font-semibold">${netMonthlySaved.toLocaleString()}/mo</strong> while preserving domain accuracy above your {simThreshold}/100 threshold.
                </p>
              </div>
              <div className="pt-2 border-t border-rule">
                <Link
                  href="/dashboard/evaluations/new"
                  className="btn-ledger btn-sm w-full justify-center"
                >
                  <span>Evaluate next workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Live Fleet Qualification Matrix with Provider Logos */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">
              Fleet Qualification vs. Bar ({simThreshold}/100)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {modelFleet.map((m) => {
                const passes = m.fit >= simThreshold;
                return (
                  <div
                    key={m.name}
                    className={`p-3.5 rounded-card border text-xs transition-all ${
                      passes
                        ? 'glass-well border-rule shadow-xs'
                        : 'bg-paper-3/40 border-rule opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={m.provider} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold text-ink truncate text-xs">{m.name}</div>
                        <div className="text-xs text-muted truncate">{m.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-rule tabular-nums">
                      <span className={passes ? 'text-accent font-semibold' : 'text-error font-medium'}>
                        {m.fit}/100 {passes ? '✓' : '✗'}
                      </span>
                      <span className="font-bold text-ink">${m.monthlyCost}/mo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Live ZDR Enclave Telemetry */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10 text-xs">
          <div className="md:col-span-7 p-5 rounded-card glass-well space-y-3 border border-rule">
            <div className="flex items-center justify-between border-b border-rule pb-2.5">
              <span className="text-sm font-semibold text-ink flex items-center gap-2">
                <ProviderLogo provider="openrouter" size="sm" />
                Gateway Enclave Inspection
              </span>
              <span className="pill emerald text-xs font-medium">zdr: true verified</span>
            </div>
            <pre className="text-xs font-outlier leading-relaxed text-ink/90 overflow-x-auto p-3.5 rounded-input bg-paper dark:bg-paper-3/60 border border-rule">
              <span className="text-accent font-bold">POST</span> /api/v1/arena/dispatch <span className="text-muted">HTTP/2</span>{'\n'}
              <span className="text-muted">Host:</span> gateway.benchcraft.dev{'\n'}
              <span className="text-muted">X-OpenRouter-Data-Collection:</span> <span className="text-error font-semibold">deny</span>{'\n'}
              <span className="text-muted">X-BenchCraft-ZDR-Enclave:</span> <span className="text-accent font-semibold">volatile-ram-only</span>{'\n'}
              <span className="text-muted">X-Judge-Determinism:</span> temperature=0.0, seed=42{'\n'}{'\n'}
              <span className="text-accent font-bold">STATUS:</span> 200 OK · 0 bytes persisted to disk
            </pre>
          </div>

          <div className="md:col-span-5 p-5 rounded-card glass-well flex flex-col justify-between space-y-3 border border-rule">
            <div className="space-y-2.5">
              <div className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Zero Data Retention Guarantee
              </div>
              <p className="text-muted leading-relaxed text-xs">
                All policy documents and customer prompts uploaded in this workspace execute strictly in volatile memory and are purged immediately after rubric scoring.
              </p>
            </div>
            <Link
              href="/dashboard/spending"
              className="btn-ledger-ghost btn-sm w-full justify-center"
            >
              Open Full Spend Analytics
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

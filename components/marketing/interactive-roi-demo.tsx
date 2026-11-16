'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Zap,
  ArrowRight,
  Terminal,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

interface WorkloadPreset {
  id: string;
  label: string;
  domain: string;
  frontierModel: string;
  frontierProvider: string;
  frontierCostPer1k: number;
  frontierFit: number;
  frontierLatency: number;
  calibratedModel: string;
  calibratedProvider: string;
  calibratedCostPer1k: number;
  calibratedFit: number;
  calibratedLatency: number;
  threshold: number;
  scenarioTitle: string;
  promptText: string;
  frontierReply: string;
  calibratedReply: string;
}

const WORKLOADS: WorkloadPreset[] = [
  {
    id: 'nari',
    label: 'Nari Boutique (Support)',
    domain: 'Bilingual Khmer & English sizing, shipping, and exchange policy',
    frontierModel: 'Claude Fable 5.1',
    frontierProvider: 'Anthropic',
    frontierCostPer1k: 30.0,
    frontierFit: 95,
    frontierLatency: 720,
    calibratedModel: 'Claude Haiku 5.5',
    calibratedProvider: 'Anthropic',
    calibratedCostPer1k: 0.3,
    calibratedFit: 88,
    calibratedLatency: 280,
    threshold: 85,
    scenarioTitle: 'Scenario 04 // Provincial Shipping to Siem Reap + Khmer Exchange Rule',
    promptText:
      '“Can you ship to Siem Reap town by tomorrow, and how much is delivery? Can I exchange if size S doesn’t fit?”',
    frontierReply:
      '“Yes. We provide 1 to 2 business day delivery to Siem Reap via Virak Buntham for $2.50. You can exchange unworn items with tags within 7 days.”',
    calibratedReply:
      '“Hello! Delivery to Siem Reap takes 24–48 hours ($2.50 flat rate). We offer size exchanges within 7 days as long as original tags remain attached.”',
  },
  {
    id: 'krama',
    label: 'Krama FinTech (JSON)',
    domain: 'Multi-currency invoice parsing & strict JSON schema extraction',
    frontierModel: 'GPT-4o (2025-08)',
    frontierProvider: 'OpenAI',
    frontierCostPer1k: 18.0,
    frontierFit: 96,
    frontierLatency: 640,
    calibratedModel: 'Gemini 2.5 Flash',
    calibratedProvider: 'Google',
    calibratedCostPer1k: 0.45,
    calibratedFit: 92,
    calibratedLatency: 210,
    threshold: 90,
    scenarioTitle: 'Scenario 02 // Dual-Currency USD/KHR Merchant Receipt Extraction',
    promptText:
      'Extract line items, VAT 10%, and convert KHR change (4,100 KHR/USD) into strict ISO-4217 JSON.',
    frontierReply:
      '{"merchant":"Phnom Penh Roasters","subtotal_usd":14.50,"vat_usd":1.45,"change_khr":2050,"change_usd_equiv":0.50,"valid":true}',
    calibratedReply:
      '{"merchant":"Phnom Penh Roasters","subtotal_usd":14.50,"vat_usd":1.45,"change_khr":2050,"change_usd_equiv":0.50,"valid":true}',
  },
  {
    id: 'angkor',
    label: 'Angkor Logistics (Triage)',
    domain: 'Cold-chain customs SLA routing & carrier exception handling',
    frontierModel: 'Claude Sonnet 5.5',
    frontierProvider: 'Anthropic',
    frontierCostPer1k: 12.0,
    frontierFit: 94,
    frontierLatency: 510,
    calibratedModel: 'Llama 3.3 70B',
    calibratedProvider: 'Meta',
    calibratedCostPer1k: 0.48,
    calibratedFit: 89,
    calibratedLatency: 195,
    threshold: 85,
    scenarioTitle: 'Scenario 07 // Sihanoukville Port Reefer Container Temp Excursion',
    promptText:
      'Container #KH-8841 spiked to +6.2°C for 18 mins. Classify severity per SLA §4.2 and assign escalation.',
    frontierReply:
      'Severity: Tier-2 Warning (under 30-min threshold). Action: Trigger automated diesel gen check; notify port supervisor.',
    calibratedReply:
      'Severity: Tier-2 Warning (<30m excursion limit). Action: Dispatch reefer technician check and alert port ops lead.',
  },
];

export function InteractiveRoiDemo() {
  const [selectedWorkloadId, setSelectedWorkloadId] = useState<string>('nari');
  const [volume, setVolume] = useState<number>(50000);
  const [activeTab, setActiveTab] = useState<'financial' | 'scenario' | 'gateway'>('financial');
  const [raceKey, setRaceKey] = useState<number>(0);

  const workload = WORKLOADS.find((w) => w.id === selectedWorkloadId) ?? WORKLOADS[0];

  const frontierMonthly = Math.round((volume / 1000) * workload.frontierCostPer1k);
  const rightSizedMonthly = Math.max(1, Math.round((volume / 1000) * workload.calibratedCostPer1k));
  const monthlySavings = frontierMonthly - rightSizedMonthly;
  const annualSavings = monthlySavings * 12;
  const savingsPercent = (((frontierMonthly - rightSizedMonthly) / frontierMonthly) * 100).toFixed(1);

  return (
    <div className="glass-card p-5 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Ambient Light Orbs Refracting Through Frosted Glass */}
      <div className="absolute -top-28 -right-24 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-24 w-72 h-72 bg-signal/12 rounded-full blur-3xl pointer-events-none" />

      {/* Top Specular Edge Shimmer */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none" />

      {/* 1. Cockpit Window Header + Workload Switcher */}
      <div className="flex flex-col gap-4 border-b border-rule pb-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-error/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-signal/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            </div>
            <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider pl-1">
              [SYS // ARENA-COCKPIT-v2.4]
            </span>
          </div>

          <button
            type="button"
            onClick={() => setRaceKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/25 hover:bg-accent/20 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-run 5-model race</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              Empirical Right-Sizing Simulator
            </h3>
            <p className="text-xs text-muted mt-0.5">{workload.domain}</p>
          </div>

          {/* 3-Tab View Switcher */}
          <div className="inline-flex p-1 glass-well rounded-input border border-rule text-xs font-semibold self-start sm:self-auto">
            {[
              { id: 'financial', label: 'Unit Economics' },
              { id: 'scenario', label: 'Blinded Diff' },
              { id: 'gateway', label: 'ZDR Trace' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-2.5 py-1.5 rounded-input transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-ink text-paper-2 font-semibold shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workload Preset Selector Pills with Provider Icons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-outlier text-muted mr-1">WORKLOAD:</span>
          {WORKLOADS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setSelectedWorkloadId(w.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedWorkloadId === w.id
                  ? 'bg-accent text-accent-ink font-semibold shadow-xs'
                  : 'bg-paper/70 border border-rule text-muted hover:text-ink'
              }`}
            >
              <span>{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Volume Slider Control */}
      <div className="space-y-2.5 glass-well p-4 rounded-card relative z-10">
        <div className="flex items-center justify-between text-xs font-semibold text-ink">
          <span className="text-muted flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-accent" />
            <span>Monthly Production Volume:</span>
          </span>
          <span className="font-outlier text-accent bg-paper-2/90 px-2.5 py-1 rounded border border-rule text-xs sm:text-sm num shadow-2xs">
            {volume.toLocaleString()} requests / mo
          </span>
        </div>

        <input
          type="range"
          min="10000"
          max="250000"
          step="5000"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Simulate monthly query volume"
          className="w-full h-1.5 bg-rule-2 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
        />

        <div className="flex items-center justify-between text-[11px] text-muted font-outlier">
          {[
            { label: '25K', val: 25000 },
            { label: '50K (Audit baseline)', val: 50000 },
            { label: '100K', val: 100000 },
            { label: '250K (Scale)', val: 250000 },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => setVolume(preset.val)}
              className={`hover:text-ink transition-colors cursor-pointer ${
                volume === preset.val ? 'text-accent font-bold underline' : ''
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Financial Right-Sizing Ledger */}
      {activeTab === 'financial' && (
        <div key={raceKey} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Uncalibrated Frontier Card */}
            <div className="p-4 sm:p-5 rounded-card glass-well space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider">
                  Uncalibrated Default
                </span>
                <span className="pill text-[11px] py-0.5">Frontier Tier</span>
              </div>

              <div className="flex items-center gap-3">
                <ProviderLogo provider={workload.frontierProvider} size="md" />
                <div>
                  <h4 className="text-base font-bold text-ink">{workload.frontierModel}</h4>
                  <p className="text-xs text-muted">{workload.frontierProvider}</p>
                </div>
              </div>

              {/* Latency & Fit Bars */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px] font-outlier text-muted">
                  <span>Domain Fit ({workload.frontierFit}/100)</span>
                  <span>p50: {workload.frontierLatency}ms</span>
                </div>
                <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted rounded-full transition-all duration-500"
                    style={{ width: `${workload.frontierFit}%` }}
                  />
                </div>
              </div>

              <dl className="space-y-2 pt-3 border-t border-rule text-xs">
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Monthly spend</dt>
                  <dd className="font-editorial font-bold text-2xl text-ink num">
                    ${frontierMonthly.toLocaleString()}.00
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Annual cloud burn</dt>
                  <dd className="font-semibold text-ink num">
                    ${(frontierMonthly * 12).toLocaleString()}.00
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Unit rate / 1k reqs</dt>
                  <dd className="font-outlier text-muted num">
                    ${workload.frontierCostPer1k.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right-Sized Calibrated Card */}
            <div className="p-4 sm:p-5 rounded-card ledger-signal space-y-4 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-outlier font-semibold text-signal uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Right-Sized Pick
                </span>
                <span className="pill rec text-[11px] py-0.5">Calibrated Winner</span>
              </div>

              <div className="flex items-center gap-3">
                <ProviderLogo provider={workload.calibratedProvider} size="md" />
                <div>
                  <h4 className="text-base font-bold text-ink">{workload.calibratedModel}</h4>
                  <p className="text-xs text-muted">{workload.calibratedProvider}</p>
                </div>
              </div>

              {/* Latency & Fit Bars */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px] font-outlier text-ink">
                  <span className="text-accent font-semibold">
                    Domain Fit ({workload.calibratedFit}/100 · Bar: {workload.threshold})
                  </span>
                  <span className="text-signal font-semibold">p50: {workload.calibratedLatency}ms</span>
                </div>
                <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${workload.calibratedFit}%` }}
                  />
                </div>
              </div>

              <dl className="space-y-2 pt-3 border-t border-rule text-xs">
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Monthly spend</dt>
                  <dd className="font-editorial font-bold text-2xl text-signal num">
                    ${rightSizedMonthly.toLocaleString()}.00
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Annual capital kept</dt>
                  <dd className="font-bold text-signal num">
                    +${annualSavings.toLocaleString()}.00
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="text-muted">Unit rate / 1k reqs</dt>
                  <dd className="font-outlier text-signal font-semibold num">
                    ${workload.calibratedCostPer1k.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Net Impact Footer Banner */}
          <div className="p-4 rounded-card glass-well flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill emerald text-xs font-bold num">
                  {savingsPercent}% Cost Reduction
                </span>
                <span className="font-editorial font-bold text-lg text-ink num">
                  +${monthlySavings.toLocaleString()}.00 / mo saved
                </span>
              </div>
              <p className="text-xs text-muted">
                Redirects <strong className="text-ink num">${annualSavings.toLocaleString()}/yr</strong> from redundant cloud inference straight into engineering runway.
              </p>
            </div>

            <Link
              href="/dashboard/evaluations/new"
              className="btn-ledger btn-sm whitespace-nowrap self-stretch sm:self-auto"
            >
              <span>Audit your prompts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: Blinded Dialogue Transcript Diff */}
      {activeTab === 'scenario' && (
        <div className="space-y-4 relative z-10">
          <div className="p-3.5 rounded-card glass-well text-xs text-ink space-y-1">
            <div className="font-outlier font-semibold text-accent flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{workload.scenarioTitle}</span>
            </div>
            <p className="text-muted pt-0.5">{workload.promptText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-card glass-well space-y-2.5">
              <div className="flex items-center justify-between text-muted font-semibold">
                <span className="flex items-center gap-2 text-ink">
                  <ProviderLogo provider={workload.frontierProvider} size="sm" />
                  <span>{workload.frontierModel}</span>
                </span>
                <span className="pill text-[10px]">Judge: {workload.frontierFit}/100</span>
              </div>
              <p className="text-ink leading-relaxed font-outlier text-[11px] bg-paper-2/60 p-2.5 rounded border border-rule">
                {workload.frontierReply}
              </p>
              <div className="text-[11px] text-muted pt-1 flex justify-between num font-outlier">
                <span>p50: {workload.frontierLatency}ms</span>
                <span>${workload.frontierCostPer1k.toFixed(2)} / 1k</span>
              </div>
            </div>

            <div className="p-4 rounded-card ledger-signal space-y-2.5">
              <div className="flex items-center justify-between text-signal font-semibold">
                <span className="flex items-center gap-2 text-ink">
                  <ProviderLogo provider={workload.calibratedProvider} size="sm" />
                  <span>{workload.calibratedModel}</span>
                </span>
                <span className="pill rec text-[10px]">Judge: {workload.calibratedFit}/100</span>
              </div>
              <p className="text-ink leading-relaxed font-outlier text-[11px] bg-paper-2/70 p-2.5 rounded border border-signal-border">
                {workload.calibratedReply}
              </p>
              <div className="text-[11px] text-signal font-semibold pt-1 flex justify-between num font-outlier">
                <span>p50: {workload.calibratedLatency}ms (2.6× faster)</span>
                <span>${workload.calibratedCostPer1k.toFixed(2)} / 1k</span>
              </div>
            </div>
          </div>

          <div className="p-3 glass-well rounded-card text-xs text-muted flex flex-wrap items-center justify-between gap-2">
            <span>Temperature-0 Judge Verdict: Both models pass strict factual &amp; policy rubrics.</span>
            <span className="font-outlier font-semibold text-accent">STATUS: CALIBRATED_PASS</span>
          </div>
        </div>
      )}

      {/* TAB 3: Zero Data Retention Gateway Inspector */}
      {activeTab === 'gateway' && (
        <div className="space-y-4 relative z-10">
          <div className="p-4 rounded-card glass-well font-outlier text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-rule pb-2 text-muted">
              <span className="flex items-center gap-2 text-ink font-semibold">
                <ProviderLogo provider="openrouter" size="sm" />
                POST https://openrouter.ai/api/v1/chat/completions
              </span>
              <span className="pill emerald text-[10px]">TLS 1.3 · RAM Enclave</span>
            </div>

            <pre className="text-[11px] leading-relaxed text-ink overflow-x-auto">
{`{
  "model": "${workload.calibratedModel.toLowerCase().replace(/\s+/g, '-')}",
  "provider": {
    "data_collection": "deny",
    "zdr": true,
    "allow_fallbacks": false
  },
  "temperature": 0.0,
  "audit_retention_ms": 0
}`}
            </pre>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rule text-[11px]">
              <div>
                <span className="text-muted block">Disk Persistence</span>
                <span className="text-accent font-semibold">0 Bytes Written</span>
              </div>
              <div>
                <span className="text-muted block">Training Opt-Out</span>
                <span className="text-accent font-semibold">Cryptographic Deny</span>
              </div>
              <div>
                <span className="text-muted block">Memory Purge</span>
                <span className="text-ink font-semibold">Immediate post-eval</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

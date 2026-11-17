'use client';

import { useState } from 'react';
import { ProviderLogo, ProviderKey, getProviderMeta } from '@/components/brand/provider-logo';
import { Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface ProviderSpotlight {
  key: ProviderKey;
  providerName: string;
  tagline: string;
  flagshipModel: string;
  flagshipCostPer1MIn: number;
  flagshipCostPer1MOut: number;
  flagshipLatencyMs: number;
  flagshipFit: number;
  calibratedModel: string;
  calibratedCostPer1MIn: number;
  calibratedCostPer1MOut: number;
  calibratedLatencyMs: number;
  calibratedFit: number;
  savingsPct: string;
  bestUseCase: string;
}

const PROVIDERS_DATA: ProviderSpotlight[] = [
  {
    key: 'anthropic',
    providerName: 'Anthropic Claude',
    tagline: 'Nuanced instruction following, bilingual Khmer/English tone & strict policy guardrails.',
    flagshipModel: 'Claude Sonnet 5.5 / Opus',
    flagshipCostPer1MIn: 3.0,
    flagshipCostPer1MOut: 15.0,
    flagshipLatencyMs: 510,
    flagshipFit: 93,
    calibratedModel: 'Claude Haiku 5.5',
    calibratedCostPer1MIn: 0.25,
    calibratedCostPer1MOut: 1.25,
    calibratedLatencyMs: 280,
    calibratedFit: 88,
    savingsPct: '91.7%',
    bestUseCase: 'Customer support, return policy enforcement & multi-turn agentic chat',
  },
  {
    key: 'openai',
    providerName: 'OpenAI GPT',
    tagline: 'High-reliability structured outputs, tool calling & broad domain synthesis.',
    flagshipModel: 'GPT-4o (Flagship)',
    flagshipCostPer1MIn: 2.5,
    flagshipCostPer1MOut: 10.0,
    flagshipLatencyMs: 610,
    flagshipFit: 94,
    calibratedModel: 'GPT-4o mini',
    calibratedCostPer1MIn: 0.15,
    calibratedCostPer1MOut: 0.6,
    calibratedLatencyMs: 310,
    calibratedFit: 85,
    savingsPct: '94.0%',
    bestUseCase: 'English ticket classification, function calling & high-throughput APIs',
  },
  {
    key: 'google',
    providerName: 'Google Gemini',
    tagline: 'Massive context windows with ultra-low cost multimodal document & PDF parsing.',
    flagshipModel: 'Gemini 2.5 Pro',
    flagshipCostPer1MIn: 1.25,
    flagshipCostPer1MOut: 5.0,
    flagshipLatencyMs: 540,
    flagshipFit: 94,
    calibratedModel: 'Gemini 2.5 Flash',
    calibratedCostPer1MIn: 0.075,
    calibratedCostPer1MOut: 0.3,
    calibratedLatencyMs: 210,
    calibratedFit: 90,
    savingsPct: '94.0%',
    bestUseCase: 'Long-document policy extraction, dual-currency receipts & catalog indexing',
  },
  {
    key: 'meta',
    providerName: 'Meta Llama (Groq / Bedrock)',
    tagline: 'Open-weights sovereignty with sub-200ms LPU inference speeds and zero lock-in.',
    flagshipModel: 'Llama 3.1 405B Instruct',
    flagshipCostPer1MIn: 3.0,
    flagshipCostPer1MOut: 3.0,
    flagshipLatencyMs: 490,
    flagshipFit: 91,
    calibratedModel: 'Llama 3.3 70B Versatile',
    calibratedCostPer1MIn: 0.59,
    calibratedCostPer1MOut: 0.79,
    calibratedLatencyMs: 195,
    calibratedFit: 87,
    savingsPct: '80.3%',
    bestUseCase: 'Real-time voice/chat triage, logistics routing & low-latency pipelines',
  },
  {
    key: 'deepseek',
    providerName: 'DeepSeek (ZDR Enclave)',
    tagline: 'Frontier-grade math, code & chain-of-thought reasoning at disruptive unit economics.',
    flagshipModel: 'DeepSeek R1 (Reasoning)',
    flagshipCostPer1MIn: 0.55,
    flagshipCostPer1MOut: 2.19,
    flagshipLatencyMs: 820,
    flagshipFit: 95,
    calibratedModel: 'DeepSeek V3',
    calibratedCostPer1MIn: 0.14,
    calibratedCostPer1MOut: 0.28,
    calibratedLatencyMs: 360,
    calibratedFit: 89,
    savingsPct: '87.2%',
    bestUseCase: 'Financial reconciliation, SQL generation & complex logic verification',
  },
  {
    key: 'mistral',
    providerName: 'Mistral AI',
    tagline: 'European precision models engineered for high-efficiency enterprise deployment.',
    flagshipModel: 'Mistral Large 2',
    flagshipCostPer1MIn: 2.0,
    flagshipCostPer1MOut: 6.0,
    flagshipLatencyMs: 460,
    flagshipFit: 90,
    calibratedModel: 'Mistral Small 3',
    calibratedCostPer1MIn: 0.1,
    calibratedCostPer1MOut: 0.3,
    calibratedLatencyMs: 225,
    calibratedFit: 86,
    savingsPct: '95.0%',
    bestUseCase: 'High-volume multilingual routing, compliance tagging & EU/regional workloads',
  },
  {
    key: 'alibaba',
    providerName: 'Alibaba Cloud (Qwen)',
    tagline: 'High-performing multilingual open weights with outstanding math and coding accuracy.',
    flagshipModel: 'Qwen 2.5 72B Instruct',
    flagshipCostPer1MIn: 0.35,
    flagshipCostPer1MOut: 0.4,
    flagshipLatencyMs: 310,
    flagshipFit: 88,
    calibratedModel: 'Qwen 2.5 7B Instruct',
    calibratedCostPer1MIn: 0.05,
    calibratedCostPer1MOut: 0.1,
    calibratedLatencyMs: 180,
    calibratedFit: 82,
    savingsPct: '85.7%',
    bestUseCase: 'Asian language tasks, mathematical calculation & high-throughput code generation',
  },
  {
    key: 'nvidia',
    providerName: 'NVIDIA AI (NIM)',
    tagline: 'TensorRT-LLM accelerated inference with state-of-the-art Nemotron & ChatQA architectures.',
    flagshipModel: 'Nemotron 4 340B / Nemotron 70B',
    flagshipCostPer1MIn: 1.20,
    flagshipCostPer1MOut: 2.40,
    flagshipLatencyMs: 380,
    flagshipFit: 94,
    calibratedModel: 'Nemotron 3.5 Lightning / Minitron 8B',
    calibratedCostPer1MIn: 0.20,
    calibratedCostPer1MOut: 0.30,
    calibratedLatencyMs: 160,
    calibratedFit: 89,
    savingsPct: '85.7%',
    bestUseCase: 'Enterprise agentic workflows, conversational QA, RAG & hardware-accelerated microservices',
  },
];

export function InteractiveProviderDock() {
  const [activeKey, setActiveKey] = useState<ProviderKey>('anthropic');

  const current = PROVIDERS_DATA.find((p) => p.key === activeKey) ?? PROVIDERS_DATA[0];
  const meta = getProviderMeta(activeKey);

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Dynamic Brand-Tinted Ambient Glow */}
      <div
        className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
        style={{ background: meta.bgGlow }}
      />

      {/* Top Header + Interactive Logo Dock */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-rule pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-well">
              [PROVIDER ECOSYSTEM DOCK]
            </span>
            <span className="pill emerald text-[11px]">Click a provider logo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight">
            Cross-Provider Right-Sizing Explorer
          </h3>
        </div>

        {/* Raycast / macOS Style Interactive Provider Logo Dock */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 glass-well rounded-2xl border border-rule">
          {PROVIDERS_DATA.map((p) => {
            const isSelected = p.key === activeKey;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setActiveKey(p.key)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'glass-card shadow-md scale-[1.03] border-accent/40'
                    : 'opacity-75 hover:opacity-100 hover:bg-paper-2/40'
                }`}
              >
                <ProviderLogo provider={p.key} size="sm" />
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    isSelected ? 'text-ink' : 'text-muted group-hover:text-ink'
                  }`}
                >
                  {p.providerName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Provider Visual Telemetry Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: Provider Profile & Best Use Case */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <ProviderLogo provider={current.key} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-ink">{current.providerName}</h4>
                <span className="pill emerald text-[10px]">ZDR Enclave</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{current.tagline}</p>
            </div>
          </div>

          <div className="p-4 rounded-card glass-well space-y-2 text-xs">
            <div className="font-outlier font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Optimal Workload Fit
            </div>
            <p className="text-ink font-medium leading-relaxed">{current.bestUseCase}</p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-card ledger-signal text-xs">
            <span className="font-semibold text-ink">Intra-Family Right-Sizing Delta:</span>
            <span className="font-editorial font-bold text-xl text-signal num">
              -{current.savingsPct} cost
            </span>
          </div>
        </div>

        {/* Right: Visual Flagship vs. Calibrated Pick Telemetry Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Flagship Tier */}
          <div className="p-5 rounded-card glass-well space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProviderLogo provider={current.key} size="sm" />
                <div>
                  <span className="text-[10px] font-outlier text-muted uppercase block">
                    Flagship Default
                  </span>
                  <span className="text-sm font-bold text-ink">{current.flagshipModel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-outlier text-[11px]">
                <span className="text-muted">Domain Fit</span>
                <span className="text-ink font-semibold num">{current.flagshipFit} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted rounded-full transition-all duration-500"
                  style={{ width: `${current.flagshipFit}%` }}
                />
              </div>

              <div className="flex justify-between font-outlier text-[11px] pt-1">
                <span className="text-muted">p50 Speed</span>
                <span className="text-muted num">{current.flagshipLatencyMs}ms</span>
              </div>
              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-rule-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (current.flagshipLatencyMs / 900) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-rule flex items-baseline justify-between text-xs font-outlier num">
              <span className="text-muted">1M Token Rate</span>
              <span className="text-ink font-bold">
                ${current.flagshipCostPer1MIn.toFixed(2)} in · ${current.flagshipCostPer1MOut.toFixed(2)} out
              </span>
            </div>
          </div>

          {/* Right-Sized Tier */}
          <div className="p-5 rounded-card ledger-signal space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProviderLogo provider={current.key} size="sm" />
                <div>
                  <span className="text-[10px] font-outlier text-signal font-semibold uppercase block">
                    Right-Sized Champion
                  </span>
                  <span className="text-sm font-bold text-ink">{current.calibratedModel}</span>
                </div>
              </div>
              <span className="pill rec text-[10px]">
                <Zap className="w-3 h-3" />
                Optimal
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-outlier text-[11px]">
                <span className="text-muted">Domain Fit (Bar: 85)</span>
                <span className="text-accent font-bold num">{current.calibratedFit} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${current.calibratedFit}%` }}
                />
              </div>

              <div className="flex justify-between font-outlier text-[11px] pt-1">
                <span className="text-muted">p50 Speed</span>
                <span className="text-signal font-bold num">{current.calibratedLatencyMs}ms</span>
              </div>
              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-signal rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (current.calibratedLatencyMs / 900) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-rule flex items-baseline justify-between text-xs font-outlier num">
              <span className="text-muted">1M Token Rate</span>
              <span className="text-signal font-bold">
                ${current.calibratedCostPer1MIn.toFixed(2)} in · ${current.calibratedCostPer1MOut.toFixed(2)} out
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

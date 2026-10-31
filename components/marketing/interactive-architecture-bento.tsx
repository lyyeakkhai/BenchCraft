'use client';

import { useState } from 'react';
import {
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';
import { ClerkBentoChassis } from '@/components/brand/clerk-grid';

const POLICY_CLAUSES = [
  {
    id: 'returns',
    clauseLabel: '§2.1 Return & Tag Policy',
    sourceSnippet: '“Items must be unworn with original barcode tags attached within 7 calendar days.”',
    synthesizedPrompt:
      '“I bought a silk dress 5 days ago in Phnom Penh, wore it once to dinner, but kept the tag in my bag. Can I exchange for size M?”',
    rubricRule: 'Must reject exchange politely because item was worn, even though 7-day window and tag exist.',
  },
  {
    id: 'shipping',
    clauseLabel: '§3.4 Provincial Courier SLA',
    sourceSnippet: '“Siem Reap & Battambang: 24–48h via Virak Buntham ($2.50 flat fee). Express air: unavailable.”',
    synthesizedPrompt:
      '“បង! ផ្ញើទៅសៀមរាបថ្ងៃនេះ បានដល់ល្ងាចម៉ោង ៥ អត់? ខ្ញុំថែមលុយថ្លៃសេវាឲ្យ!” (Can you deliver to Siem Reap by 5 PM today if I pay extra?)',
    rubricRule: 'Must reply in natural Khmer/English that same-day delivery is impossible; state 24–48h SLA & $2.50 fee.',
  },
  {
    id: 'refund',
    clauseLabel: '§5.2 ABA KHQR Refund Window',
    sourceSnippet: '“Approved refunds settle to original ABA Bank KHQR account within 2 business days.”',
    synthesizedPrompt:
      '“I paid via ABA KHQR yesterday. Can you refund me in physical USD cash at the BKK1 showroom right now?”',
    rubricRule: 'Must enforce original payment rail policy (ABA KHQR 2-day settlement, no cash payouts).',
  },
];

export function InteractiveArchitectureBento() {
  const [selectedClauseId, setSelectedClauseId] = useState<string>('returns');
  const [threshold, setThreshold] = useState<number>(85);
  const [hoveredModel, setHoveredModel] = useState<string>('Claude Haiku 5.5');

  const activeClause = POLICY_CLAUSES.find((c) => c.id === selectedClauseId) ?? POLICY_CLAUSES[0];

  const arenaCandidates = [
    {
      code: 'Candidate α',
      model: 'Claude Haiku 5.5',
      provider: 'Anthropic',
      score: 88,
      latency: 280,
      cost: '$15/mo',
      xPct: 12, // low cost
      yPct: 72, // high fit
      winner: true,
    },
    {
      code: 'Candidate β',
      model: 'Llama 3.3 70B',
      provider: 'Meta',
      score: 87,
      latency: 195,
      cost: '$24/mo',
      xPct: 24,
      yPct: 68,
      winner: false,
    },
    {
      code: 'Candidate γ',
      model: 'Gemini 2.5 Flash',
      provider: 'Google',
      score: 90,
      latency: 340,
      cost: '$112/mo',
      xPct: 48,
      yPct: 79,
      winner: false,
    },
    {
      code: 'Candidate δ',
      model: 'Claude Sonnet 5.5',
      provider: 'Anthropic',
      score: 93,
      latency: 510,
      cost: '$300/mo',
      xPct: 70,
      yPct: 87,
      winner: false,
    },
    {
      code: 'Candidate ε',
      model: 'GPT-4o mini',
      provider: 'OpenAI',
      score: 82,
      latency: 310,
      cost: '$18.50/mo',
      xPct: 18,
      yPct: 44,
      winner: false,
    },
    {
      code: 'Candidate ζ',
      model: 'Claude Fable 5.1',
      provider: 'Anthropic',
      score: 95,
      latency: 720,
      cost: '$1,500/mo',
      xPct: 90,
      yPct: 93,
      winner: false,
    },
  ];

  const selectedNode =
    arenaCandidates.find((c) => c.model === hoveredModel) ?? arenaCandidates[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* CARD 1: Interactive Policy-to-Scenario Synthesizer (6 cols) */}
      <div className="lg:col-span-6">
        <ClerkBentoChassis>
          <div className="glass-card glass-card-interactive p-6 sm:p-7 space-y-5 relative overflow-hidden h-full">
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 border-b border-rule pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-input bg-accent/12 border border-accent/30 text-accent font-outlier text-xs font-bold inline-flex items-center justify-center">
                  01
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">Domain Scenario Synthesis</h3>
                  <p className="text-xs text-muted">Click a policy rule to synthesize an adversarial test prompt</p>
                </div>
              </div>
              <span className="pill emerald text-[11px]">
                <Lock className="w-3 h-3" />
                Volatile RAM
              </span>
            </div>

            {/* Interactive Policy Selector */}
            <div className="flex flex-wrap gap-1.5 relative z-10">
              {POLICY_CLAUSES.map((clause) => (
                <button
                  key={clause.id}
                  type="button"
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`px-3 py-1.5 rounded-input text-xs font-semibold transition-all cursor-pointer ${
                    selectedClauseId === clause.id
                      ? 'bg-ink text-paper-2 shadow-xs'
                      : 'glass-well text-muted hover:text-ink'
                  }`}
                >
                  {clause.clauseLabel}
                </button>
              ))}
            </div>

            {/* Visual Transformation Pipeline */}
            <div className="space-y-3 relative z-10 text-xs">
              <div className="p-3.5 rounded-card glass-well space-y-1">
                <div className="flex items-center justify-between text-[11px] font-outlier text-muted">
                  <span>SOURCE PDF EXTRACT</span>
                  <span>nari_policy_v4.pdf</span>
                </div>
                <p className="text-ink font-medium">{activeClause.sourceSnippet}</p>
              </div>

              <div className="p-3.5 rounded-card glass-well border-accent/30 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-outlier text-accent font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    SYNTHESIZED ADVERSARIAL SCENARIO
                  </span>
                  <span>Edge-Case Trap</span>
                </div>
                <p className="text-ink leading-relaxed">{activeClause.synthesizedPrompt}</p>
                <div className="pt-2 border-t border-rule text-[11px] text-muted font-outlier">
                  <strong className="text-ink">Judge Rubric:</strong> {activeClause.rubricRule}
                </div>
              </div>
            </div>
          </div>
        </ClerkBentoChassis>
      </div>

      {/* CARD 2: Interactive Quality Threshold & Blinded Arena with Provider Logos (6 cols) */}
      <div className="lg:col-span-6">
        <ClerkBentoChassis>
          <div className="glass-card glass-card-interactive p-6 sm:p-7 space-y-5 relative overflow-hidden h-full">
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-signal/12 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 border-b border-rule pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-input bg-signal/15 border border-signal/35 text-signal font-outlier text-xs font-bold inline-flex items-center justify-center">
                  02
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">Blinded Arena &amp; Threshold</h3>
                  <p className="text-xs text-muted">Drag your minimum quality bar to filter qualifying models</p>
                </div>
              </div>
              <span className="pill rec text-[11px]">Temp 0.0 Judge</span>
            </div>

            {/* Interactive Quality Bar Slider */}
            <div className="p-3.5 rounded-card glass-well space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted">Required Quality Bar:</span>
                <span className="font-outlier font-bold text-accent num">
                  Min Score: {threshold} / 100
                </span>
              </div>
              <input
                type="range"
                min="78"
                max="94"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="Minimum domain quality threshold"
                className="w-full h-1.5 bg-rule-2 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
            </div>

            {/* Live Candidate Bars with Provider Logos */}
            <div className="space-y-2 relative z-10">
              {arenaCandidates.slice(0, 5).map((c) => {
                const clearsBar = c.score >= threshold;
                return (
                  <div
                    key={c.code}
                    className={`p-2.5 rounded-input border transition-all text-xs ${
                      clearsBar
                        ? 'glass-well border-rule'
                        : 'bg-paper/40 border-rule opacity-45'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <ProviderLogo provider={c.provider} size="sm" />
                        <span className="font-semibold text-ink">{c.model}</span>
                        {clearsBar && c.cost === '$15/mo' && threshold <= 88 && (
                          <span className="pill rec text-[10px] py-0 px-2">Lowest Cost Winner</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-outlier num text-[11px]">
                        <span className="text-muted">{c.latency}ms</span>
                        <span className={clearsBar ? 'text-accent font-semibold' : 'text-error'}>
                          {c.score}/100
                        </span>
                        <span className="font-bold text-ink">{c.cost}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          clearsBar ? 'bg-accent' : 'bg-error/60'
                        }`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ClerkBentoChassis>
      </div>

      {/* CARD 3: Interactive 2D Visual Pareto Scatter Map with Clickable Provider Logo Nodes (12 cols) */}
      <div className="lg:col-span-12">
        <ClerkBentoChassis>
          <div className="glass-card glass-card-interactive p-6 sm:p-8 relative overflow-hidden h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Explanation + Selected Model Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-input bg-accent/12 border border-accent/30 text-accent font-outlier text-xs font-bold inline-flex items-center justify-center">
                    03
                  </span>
                  <span className="text-xs font-outlier font-semibold uppercase tracking-wider text-accent">
                    Interactive 2D Pareto Frontier
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  Click any model node on the frontier map.
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  The shaded emerald zone marks models that clear your <strong className="text-ink">{threshold}/100 quality bar</strong> at under $150/mo.
                </p>

                {/* Active Hovered/Clicked Node Inspector Card */}
                <div className="p-4 rounded-card ledger-signal space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ProviderLogo provider={selectedNode.provider} size="md" />
                      <div>
                        <div className="text-sm font-bold text-ink">{selectedNode.model}</div>
                        <div className="text-[11px] font-outlier text-muted">{selectedNode.provider}</div>
                      </div>
                    </div>
                    <span className="font-editorial font-bold text-2xl text-signal num">
                      {selectedNode.cost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-outlier pt-2 border-t border-rule num">
                    <span>Domain Fit: <strong className="text-accent">{selectedNode.score}/100</strong></span>
                    <span>p50 Speed: <strong>{selectedNode.latency}ms</strong></span>
                    <span className={selectedNode.score >= threshold ? 'text-accent font-bold' : 'text-error font-bold'}>
                      {selectedNode.score >= threshold ? 'CLEARS BAR' : 'BELOW BAR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Visual 2D Coordinate Plane with Provider Logo Nodes */}
              <div className="lg:col-span-7">
                <div className="relative h-64 sm:h-72 w-full rounded-card glass-well border border-rule p-4 overflow-hidden select-none">
                  {/* Optimal Sweet Spot Zone Shading */}
                  <div
                    className="absolute left-0 top-0 w-[55%] bg-accent/10 border-r border-b border-accent/30 rounded-br-xl pointer-events-none transition-all duration-300"
                    style={{
                      height: `${Math.max(20, Math.min(75, 100 - (threshold - 75) * 3.5))}%`,
                    }}
                  >
                    <span className="text-[10px] font-outlier font-bold text-accent uppercase tracking-wider px-2.5 py-1 inline-block">
                      ★ Optimal Right-Sized Zone
                    </span>
                  </div>

                  {/* Horizontal Quality Threshold Line */}
                  <div
                    className="absolute inset-x-0 border-t-2 border-dashed border-accent/60 pointer-events-none transition-all duration-300"
                    style={{
                      bottom: `${Math.max(18, Math.min(82, (threshold - 75) * 3.5))}%`,
                    }}
                  >
                    <span className="absolute right-2 -top-5 text-[10px] font-outlier font-semibold text-accent bg-paper-2/90 px-1.5 py-0.5 rounded border border-accent/30">
                      Quality Bar: {threshold}/100
                    </span>
                  </div>

                  {/* Plotted Provider Logo Nodes */}
                  {arenaCandidates.map((node) => {
                    const isSelected = node.model === selectedNode.model;
                    const passes = node.score >= threshold;
                    return (
                      <button
                        key={node.model}
                        type="button"
                        onClick={() => setHoveredModel(node.model)}
                        onMouseEnter={() => setHoveredModel(node.model)}
                        style={{
                          left: `${node.xPct}%`,
                          bottom: `${node.yPct}%`,
                        }}
                        className={`absolute -translate-x-1/2 translate-y-1/2 group flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
                          isSelected ? 'scale-115 z-20' : 'hover:scale-110 z-10'
                        } ${passes ? 'opacity-100' : 'opacity-50'}`}
                      >
                        <div
                          className={`p-1 rounded-xl transition-shadow ${
                            isSelected
                              ? 'ring-2 ring-accent shadow-lg bg-paper-2'
                              : 'bg-paper-2/80'
                          }`}
                        >
                          <ProviderLogo provider={node.provider} size="sm" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-outlier font-semibold whitespace-nowrap glass-card text-ink shadow-xs">
                          {node.model.split(' ').slice(0, 2).join(' ')} ({node.cost})
                        </span>
                      </button>
                    );
                  })}

                  {/* Axis Labels */}
                  <div className="absolute bottom-2 left-3 text-[10px] font-outlier text-muted">
                    ← Lower Cost ($15/mo)
                  </div>
                  <div className="absolute bottom-2 right-3 text-[10px] font-outlier text-muted">
                    Higher Cost ($1,500/mo) →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClerkBentoChassis>
      </div>
    </div>
  );
}

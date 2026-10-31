'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Zap,
  TrendingDown,
  CheckCircle2,
  XCircle,
  FileCode2,
  Sparkles,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { ClerkBentoChassis, ClerkCrosshair } from '@/components/brand/clerk-grid';
import { ProviderLogo } from '@/components/brand/provider-logo';

export function ClerkSpecimenGrid() {
  // Specimen 1: ZDR Enclave State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditTimestamp, setAuditTimestamp] = useState<string>('12:44:02.109 UTC');
  const [auditHash, setAuditHash] = useState<string>('e3b0c442...982fc171');

  // Specimen 2: Arbitrage Ticker State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(75000);
  const [selectedBaseline, setSelectedBaseline] = useState<'sonnet' | 'gpt4o'>('sonnet');
  const [selectedCandidate, setSelectedCandidate] = useState<'haiku' | 'flash' | 'deepseek'>('haiku');

  // Specimen 3: Rubric Judge Mode
  const [adversarialMode, setAdversarialMode] = useState<boolean>(false);

  // Math for Arbitrage
  const baselineCostPer1k = selectedBaseline === 'sonnet' ? 0.015 : 0.0125;
  const candidateCostPer1k =
    selectedCandidate === 'haiku' ? 0.001 : selectedCandidate === 'flash' ? 0.0003 : 0.0007;

  const baselineMonthly = Math.round(monthlyVolume * baselineCostPer1k);
  const candidateMonthly = Math.round(monthlyVolume * candidateCostPer1k);
  const savedAnnual = (baselineMonthly - candidateMonthly) * 12;
  const pctSaved = Math.round(((baselineMonthly - candidateMonthly) / baselineMonthly) * 100);

  const runEnclaveAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const now = new Date();
      setAuditTimestamp(now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds() + ' UTC');
      setAuditHash(
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
          '...' +
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      );
      setIsAuditing(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Clerk-Style Architectural Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-dashed border-rule">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
          <span className="text-xs font-outlier font-semibold uppercase tracking-wider text-accent">
            Live Specimen Rack // Clerk-Grade Architecture
          </span>
        </div>
        <span className="text-xs text-muted font-outlier">
          Active Gateway Protocol: <span className="text-ink font-semibold">ZDR-v2.8-ENCLAVE</span>
        </span>
      </div>

      {/* 3-Cell Recessed Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SPECIMEN 01: Cryptographic ZDR Enclave Shield (4 cols) */}
        <div className="lg:col-span-4">
          <ClerkBentoChassis className="h-full">
            <div className="glass-card p-6 sm:p-7 h-full flex flex-col justify-between space-y-5 relative overflow-hidden">
              {/* Emerald Laser Scan Bar when Auditing */}
              {isAuditing && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-laser-sweep z-30" />
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-input bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">ZDR Enclave Shield</h3>
                      <p className="text-[11px] text-muted font-outlier">Cryptographic Gateway</p>
                    </div>
                  </div>
                  <span className="pill emerald text-[10px] uppercase font-outlier tracking-wider">
                    zdr: true
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  Every payload is buffered in volatile Linux <code className="font-outlier text-accent">tmpfs</code> RAM and cryptographically scrubbed after model scoring. Zero disk persistence.
                </p>

                {/* Live Enclave Telemetry Terminal */}
                <div className="p-3.5 rounded-card glass-well font-outlier text-[11px] space-y-2 border border-rule">
                  <div className="flex justify-between items-center text-muted">
                    <span>RAM Mount:</span>
                    <span className="text-ink font-semibold">/dev/shm/enclave0</span>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Purge Latency:</span>
                    <span className="text-accent font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      0.02ms verified
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Ephemeral Hash:</span>
                    <span className="text-ink font-mono">{auditHash}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted pt-1 border-t border-rule/60">
                    <span>Scrub Log:</span>
                    <span className="text-muted text-[10px]">{auditTimestamp}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Audit Trigger Button */}
              <button
                type="button"
                onClick={runEnclaveAudit}
                disabled={isAuditing}
                className="w-full btn-ledger-ghost text-xs py-2.5 flex items-center justify-center gap-2 cursor-pointer hover:border-accent hover:text-accent transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-accent' : ''}`} />
                <span>{isAuditing ? 'Executing Memory Scrub...' : 'Simulate Live Enclave Audit'}</span>
              </button>
            </div>
          </ClerkBentoChassis>
        </div>

        {/* SPECIMEN 02: Real-Time Model Arbitrage Ticker (4 cols) */}
        <div className="lg:col-span-4">
          <ClerkBentoChassis className="h-full">
            <div className="glass-card p-6 sm:p-7 h-full flex flex-col justify-between space-y-5 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-input bg-signal/15 border border-signal/30 flex items-center justify-center text-signal">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">Live Cost Arbitrage</h3>
                      <p className="text-[11px] text-muted font-outlier">Real-Time Right-Sizing</p>
                    </div>
                  </div>
                  <span className="pill rec text-[10px] uppercase font-outlier tracking-wider">
                    {pctSaved}% Saved
                  </span>
                </div>

                {/* Model Pair Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted text-[11px] font-outlier uppercase">Candidate:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate('haiku')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
                          selectedCandidate === 'haiku'
                            ? 'bg-ink text-paper-2'
                            : 'glass-well text-muted hover:text-ink'
                        }`}
                      >
                        Haiku 5.5
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate('flash')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
                          selectedCandidate === 'flash'
                            ? 'bg-ink text-paper-2'
                            : 'glass-well text-muted hover:text-ink'
                        }`}
                      >
                        Gemini Flash
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate('deepseek')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
                          selectedCandidate === 'deepseek'
                            ? 'bg-ink text-paper-2'
                            : 'glass-well text-muted hover:text-ink'
                        }`}
                      >
                        DeepSeek V3
                      </button>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="p-3 rounded-card glass-well space-y-2 border border-rule">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted text-[11px] font-outlier">Monthly Chats:</span>
                      <span className="font-editorial font-bold text-ink num">
                        {monthlyVolume.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={250000}
                      step={5000}
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer h-1.5 bg-rule rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Visual Arbitrage Delta */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-card glass-well border border-rule">
                    <span className="text-[10px] font-outlier text-muted uppercase block">Legacy Bill</span>
                    <span className="text-base font-editorial font-bold text-muted line-through num">
                      ${baselineMonthly.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-muted block">Claude Sonnet</span>
                  </div>
                  <div className="p-2.5 rounded-card bg-accent/10 border border-accent/30 text-accent">
                    <span className="text-[10px] font-outlier uppercase font-bold block">Right-Sized</span>
                    <span className="text-lg font-editorial font-bold num text-accent">
                      ${candidateMonthly.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-semibold block">BenchCraft Pick</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-rule flex items-center justify-between text-xs">
                <span className="text-muted text-[11px] font-outlier">Annual Cloud Delta:</span>
                <span className="font-editorial font-bold text-accent text-sm num flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +${savedAnnual.toLocaleString()} / yr
                </span>
              </div>
            </div>
          </ClerkBentoChassis>
        </div>

        {/* SPECIMEN 03: Deterministic Rubric Judge Specimen (4 cols) */}
        <div className="lg:col-span-4">
          <ClerkBentoChassis className="h-full">
            <div className="glass-card p-6 sm:p-7 h-full flex flex-col justify-between space-y-5 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-input bg-ink/10 border border-ink/20 flex items-center justify-center text-ink dark:text-paper-2">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">Temp-0 Rubric Judge</h3>
                      <p className="text-[11px] text-muted font-outlier">Deterministic Audit</p>
                    </div>
                  </div>
                  <span className="pill text-[10px] font-outlier uppercase tracking-wider">
                    4/4 Assertions
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-input glass-well border border-rule text-xs">
                  <span className="text-[11px] font-outlier text-muted">Test Scenario Mode:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAdversarialMode(false)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
                        !adversarialMode ? 'bg-ink text-paper-2' : 'text-muted hover:text-ink'
                      }`}
                    >
                      Normal Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdversarialMode(true)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
                        adversarialMode ? 'bg-signal text-paper-2' : 'text-muted hover:text-ink'
                      }`}
                    >
                      Adversarial Attack
                    </button>
                  </div>
                </div>

                {/* 4 Deterministic Rule Checks */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded glass-well border border-rule/60">
                    <span className="font-mono text-[11px] text-ink">Rule §2.1 Worn Tag Reject</span>
                    <span className="inline-flex items-center gap-1 text-accent font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASS (100%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded glass-well border border-rule/60">
                    <span className="font-mono text-[11px] text-ink">Rule §3.4 Provincial SLA</span>
                    <span className="inline-flex items-center gap-1 text-accent font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASS (100%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded glass-well border border-rule/60">
                    <span className="font-mono text-[11px] text-ink">Rule §5.2 KHQR Rail Lock</span>
                    {adversarialMode ? (
                      <span className="inline-flex items-center gap-1 text-signal font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        TRIPPED (Catch)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-accent font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASS (100%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded glass-well border border-rule/60">
                    <span className="font-mono text-[11px] text-ink">Khmer/English Code-Switch</span>
                    <span className="inline-flex items-center gap-1 text-accent font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASS (100%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-card bg-paper-3 dark:bg-black/30 border border-rule/80 text-[11px] font-outlier text-muted leading-tight">
                {adversarialMode ? (
                  <span className="text-signal font-medium">
                    [Adversarial Catch] Model correctly refused off-rail USD cash settlement despite user offering $20 bribe.
                  </span>
                ) : (
                  <span className="text-accent font-medium">
                    [Audit OK] Deterministic temperature-0 judge verified zero rubric hallucinations across all 4 rules.
                  </span>
                )}
              </div>
            </div>
          </ClerkBentoChassis>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeArenaEvaluationAction } from '@/actions/evaluations';
import { CheckCircle2, Clock, Zap, ShieldCheck, Terminal, Lock } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

interface ArenaClientProps {
  comparisonId: string;
  candidates: {
    id: string;
    modelId: string;
    tier: string;
    name: string | null;
    provider: string | null;
  }[];
}

const GREEK_CODES = ['Candidate α', 'Candidate β', 'Candidate γ', 'Candidate δ', 'Candidate ε'];

export function ArenaClient({ comparisonId, candidates }: ArenaClientProps) {
  const router = useRouter();
  const [stage, setStage] = useState<'running' | 'judging' | 'completed'>('running');
  const [progress, setProgress] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      executeArenaEvaluationAction(comparisonId)
        .then(() => {
          if (isMounted) {
            setProgress(100);
            setStage('completed');
          }
          router.push(`/dashboard/evaluations/${comparisonId}`);
        })
        .catch((err) => {
          console.error('Arena execution failed:', err);
          if (isMounted) {
            setError(err.message || 'Execution error');
          }
        });
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev;
        if (prev > 45) setStage('judging');
        return prev + Math.floor(Math.random() * 7 + 3);
      });
    }, 1100);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [comparisonId, router]);

  if (error) {
    return (
      <div className="glass-card border-error p-8 space-y-4 text-center">
        <h2 className="text-title font-display font-bold text-error">Arena execution error</h2>
        <p className="text-sm text-muted">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-ledger btn-sm"
        >
          Retry arena evaluation
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-10 space-y-8 relative overflow-hidden">
      {/* Ambient Light Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-signal/12 rounded-full blur-3xl pointer-events-none" />

      {/* Top Stage Header */}
      <div className="space-y-3 text-center max-w-xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-well">
            [02 // BLINDED PARALLEL ARENA]
          </span>
          <span className="pill emerald text-xs">
            <Lock className="w-3 h-3" />
            zdr: true
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">
          Racing candidate models in{' '}
          <span className="font-editorial italic font-semibold text-accent">
            volatile RAM.
          </span>
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Dispatching your domain scenarios across all candidate models simultaneously and grading anonymized outputs with our deterministic temperature-0 rubric judge.
        </p>
      </div>

      {/* Master Telemetry Progress Bar */}
      <div className="space-y-2.5 max-w-xl mx-auto relative z-10">
        <div className="w-full glass-well rounded-pill h-3.5 overflow-hidden p-0.5">
          <div
            className="bg-accent h-full rounded-pill transition-transform duration-700 ease-out origin-left"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted font-semibold">
          <span className="flex items-center gap-1.5 text-ink">
            <Zap className="w-3.5 h-3.5 text-signal" aria-hidden="true" />
            {stage === 'running'
              ? 'Streaming parallel candidate completions…'
              : 'Evaluating anonymized transcripts against rubric (temp 0.0)…'}
          </span>
          <span className="font-outlier text-accent font-bold num">{progress}%</span>
        </div>
      </div>

      {/* Live Candidate Race Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left max-w-2xl mx-auto relative z-10">
        {candidates.map((cand, idx) => {
          const isDone = progress > (idx + 1) * 18;
          const blindCode = GREEK_CODES[idx] || `Candidate #${idx + 1}`;
          const candProgress = isDone
            ? 100
            : Math.min(95, Math.max(15, progress + (5 - idx) * 6));

          return (
            <div
              key={cand.id}
              className={`p-4 rounded-card transition-all space-y-2.5 ${
                isDone ? 'ledger-signal' : 'glass-well'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider={cand.provider || cand.name} size="md" />
                  <div>
                    <span className="text-[10px] font-outlier font-semibold text-muted uppercase tracking-wider">
                      {blindCode} · {cand.provider}
                    </span>
                    <div className="text-sm font-bold text-ink mt-0.5">
                      {cand.name || cand.modelId}
                    </div>
                  </div>
                </div>
                {isDone ? (
                  <span className="pill emerald text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Scored
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-signal font-outlier font-semibold">
                    <Clock className="w-3.5 h-3.5 keep-motion animate-spin" aria-hidden="true" />
                    <span>{candProgress}%</span>
                  </div>
                )}
              </div>

              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDone ? 'bg-accent' : 'bg-signal'
                  }`}
                  style={{ width: `${candProgress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Gateway Enclave Stream */}
      <div className="p-4 glass-well rounded-card text-xs font-outlier text-muted max-w-2xl mx-auto space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-ink font-semibold border-b border-rule pb-1.5">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            ENCLAVE TELEMETRY STREAM
          </span>
          <span className="text-accent text-[11px]">TLS 1.3 · 0 Bytes Disk Write</span>
        </div>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span>
            <ShieldCheck className="w-3.5 h-3.5 text-accent inline mr-1" />
            Responses shuffled &amp; stripped of provider headers prior to rubric scoring.
          </span>
          <span className="text-signal num">Judge: temp=0.0</span>
        </div>
      </div>
    </div>
  );
}

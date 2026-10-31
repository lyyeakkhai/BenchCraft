'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeArenaEvaluationAction } from '@/actions/evaluations';
import { CheckCircle2, Clock, Zap, ShieldCheck } from 'lucide-react';

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
          router.push(`/c/${comparisonId}`);
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
        if (prev >= 92) return prev;
        if (prev > 50) setStage('judging');
        return prev + Math.floor(Math.random() * 8 + 3);
      });
    }, 1200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [comparisonId, router]);

  if (error) {
    return (
      <div className="ledger-surface border-error p-8 space-y-4 text-center">
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
    <div className="ledger-surface p-8 sm:p-10 text-center space-y-8">
      <div className="space-y-3 max-w-lg mx-auto">
        <div className="pill" role="status">
          <span>Step 2 of 3: Parallel arena testing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink tracking-tight">
          Testing models in parallel
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Executing your business scenarios against each candidate model and scoring with an objective rubric judge.
        </p>
      </div>

      <div className="space-y-2.5 max-w-md mx-auto">
        <div className="w-full bg-paper rounded-pill h-3.5 overflow-hidden border border-rule p-0.5">
          <div
            className="bg-accent h-full rounded-pill transition-transform duration-700 ease-out origin-left"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted font-semibold">
          <span className="flex items-center gap-1.5 text-ink">
            <Zap className="w-3.5 h-3.5 text-signal" aria-hidden="true" />
            {stage === 'running' ? 'Executing candidate responses…' : 'Judging against objective rubrics…'}
          </span>
          <span className="font-outlier text-accent num">{progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-2">
        {candidates.map((cand, idx) => (
          <div
            key={cand.id}
            className="p-4 rounded-card border border-rule bg-paper flex items-center justify-between"
          >
            <div>
              <div className="text-xs text-muted font-semibold">{cand.provider}</div>
              <div className="text-sm font-semibold text-ink mt-0.5">{cand.name || cand.modelId}</div>
            </div>
            {progress > (idx + 1) * 20 ? (
              <CheckCircle2 className="w-5 h-5 text-accent" aria-hidden="true" />
            ) : (
              <Clock className="w-4 h-4 text-signal animate-spin keep-motion" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-paper border border-rule rounded-card text-xs text-ink flex items-center justify-center gap-2 max-w-lg mx-auto">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
        <span>Answers are anonymized and shuffled before judging to eliminate provider bias.</span>
      </div>
    </div>
  );
}

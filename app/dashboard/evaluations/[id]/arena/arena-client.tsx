'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeArenaEvaluationAction } from '@/actions/evaluations';
import { Sparkles, CheckCircle2, Clock, Zap, ShieldCheck } from 'lucide-react';

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

  useEffect(() => {
    let isMounted = true;

    // Start arena execution action
    executeArenaEvaluationAction(comparisonId)
      .then(() => {
        if (isMounted) {
          setProgress(100);
          setStage('completed');
          router.push(`/dashboard/evaluations/${comparisonId}`);
        }
      })
      .catch((err) => {
        console.error('Arena execution failed:', err);
        if (isMounted) {
          setError(err.message || 'Execution error');
        }
      });

    // Animate progress smoothly
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
      <div className="glass-panel border-red-200 rounded-2xl p-8 space-y-4 text-center">
        <h2 className="text-lg font-serif font-bold text-red-800">Arena Execution Error</h2>
        <p className="text-xs text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-ledger text-xs px-4 py-2 cursor-pointer"
        >
          Retry Arena Evaluation
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#1F5C55]/6 via-[#B87A14]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-3 max-w-lg mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#B87A14] animate-ping" />
          <span>Step 2 · Blinded Parallel Arena</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#0A2E2B] tracking-tight">
          Testing Models in Parallel
        </h1>
        <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
          Executing your business scenarios against each candidate model simultaneously and scoring answers with an objective rubric judge at temperature 0.
        </p>
      </div>

      {/* Progress Bar & Stage Indicator */}
      <div className="space-y-2.5 max-w-md mx-auto relative z-10">
        <div className="w-full bg-[#EDF2EF] rounded-full h-3.5 overflow-hidden border border-[#D3DDD8] p-0.5">
          <div
            className="bg-[#1F5C55] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#4B605C] font-semibold">
          <span className="flex items-center gap-1.5 text-[#0A2E2B]">
            <Zap className="w-3.5 h-3.5 text-[#B87A14]" />
            {stage === 'running' ? 'Executing candidate responses in parallel...' : 'Judging against objective rubrics (Temp 0)...'}
          </span>
          <span className="font-mono text-[#1F5C55]">{progress}%</span>
        </div>
      </div>

      {/* Candidate Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-2 relative z-10">
        {candidates.map((cand, idx) => (
          <div
            key={cand.id}
            className="p-4 rounded-xl border border-[#D3DDD8] bg-white/90 flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="text-[11px] text-[#4B605C] font-semibold uppercase">{cand.provider}</div>
              <div className="text-sm font-semibold text-[#0A2E2B] mt-0.5">{cand.name || cand.modelId}</div>
            </div>
            {progress > (idx + 1) * 18 ? (
              <CheckCircle2 className="w-5 h-5 text-[#1F5C55]" />
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#B87A14] font-semibold">
                <Clock className="w-4 h-4 animate-spin text-[#B87A14]" />
                <span className="text-[11px]">Benchmarking</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ZDR & Anonymization Strip */}
      <div className="p-3.5 bg-white/70 border border-[#D3DDD8] rounded-xl text-xs text-[#0A2E2B] flex items-center justify-center gap-2 max-w-lg mx-auto shadow-xs relative z-10">
        <ShieldCheck className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
        <span>Answers are anonymized and shuffled before judging to eliminate provider bias.</span>
      </div>
    </div>
  );
}

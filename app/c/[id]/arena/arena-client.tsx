'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeArenaEvaluationAction } from '@/actions/evaluations';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';

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
          router.push(`/c/${comparisonId}`);
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 text-center">
        <h2 className="text-lg font-bold text-red-800">Arena Execution Error</h2>
        <p className="text-xs text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#0A2E2B] text-white rounded-lg text-xs font-semibold hover:bg-[#1F5C55] transition"
        >
          Retry Arena Evaluation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white border border-[#D3DDD8] rounded-xl p-8 shadow-xs text-center">
      <div className="space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF2EF] border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
          <span className="w-2 h-2 rounded-full bg-[#B87A14] animate-ping" />
          Step 2 of 3: Parallel Arena Testing
        </div>
        <h1 className="text-3xl font-semibold text-[#0A2E2B]">
          Testing Models in Parallel
        </h1>
        <p className="text-xs text-[#4B605C]">
          Executing your business scenarios against each candidate model and scoring with an objective rubric judge.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-[#EDF2EF] rounded-full h-3 overflow-hidden border border-[#D3DDD8]">
          <div
            className="bg-[#1F5C55] h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#4B605C] font-semibold">
          <span>{stage === 'running' ? 'Executing candidate responses...' : 'Judging against objective rubrics...'}</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Candidate Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-2">
        {candidates.map((cand, idx) => (
          <div
            key={cand.id}
            className="p-3.5 rounded-lg border border-[#D3DDD8] bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-[#4B605C] font-medium">{cand.provider}</div>
              <div className="text-sm font-semibold text-[#0A2E2B]">{cand.name || cand.modelId}</div>
            </div>
            {progress > (idx + 1) * 20 ? (
              <CheckCircle2 className="w-5 h-5 text-[#1F5C55]" />
            ) : (
              <Clock className="w-4 h-4 text-[#B87A14] animate-spin" />
            )}
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#EDF2EF] border border-[#D3DDD8] rounded-lg text-xs text-[#0A2E2B] flex items-center justify-center gap-2 max-w-lg mx-auto">
        <Sparkles className="w-4 h-4 text-[#B87A14]" />
        <span>Answers are automatically anonymized and shuffled before judging to eliminate bias.</span>
      </div>
    </div>
  );
}

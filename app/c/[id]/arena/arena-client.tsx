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
        if (prev >= 90) return prev;
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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-red-700">Arena Execution Error</h2>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          Retry Arena Evaluation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-[#0C3838]">
          <span className="w-2 h-2 rounded-full bg-[#0C3838] animate-ping" />
          Step 3 of 3: Live Arena Benchmark
        </div>
        <h1 className="text-3xl font-extrabold text-[#0C3838]">Testing Models in Parallel</h1>
        <p className="text-sm text-gray-500">
          Sending your business scenarios to each candidate model and scoring with an objective rubric judge.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#0C3838] h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>{stage === 'running' ? 'Executing candidate responses...' : 'Scoring against rubrics...'}</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Candidate Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {candidates.map((cand, idx) => (
          <div
            key={cand.id}
            className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between"
          >
            <div>
              <div className="text-xs text-gray-500 font-medium">{cand.provider}</div>
              <div className="text-sm font-bold text-gray-900">{cand.name || cand.modelId}</div>
            </div>
            {progress > (idx + 1) * 18 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500 animate-spin" />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-teal-50/60 rounded-xl text-xs text-teal-900 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-[#0C3838]" />
        <span>Answers are automatically anonymized and shuffled before judging to eliminate bias.</span>
      </div>
    </div>
  );
}

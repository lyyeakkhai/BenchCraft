'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

const STAGES = [
  {
    code: '01',
    label: 'Document intake',
    detail: 'Parsing business policies & uploaded context',
  },
  {
    code: '02',
    label: 'Scenario synthesis',
    detail: 'Synthesizing domain test scenarios and rubrics',
  },
  {
    code: '03',
    label: 'Model selection',
    detail: 'Selecting right-sized candidates across tiers',
  },
  {
    code: '04',
    label: 'Arena calibration',
    detail: 'Calibrating blinded arena & cost thresholds',
  },
] as const;

// Elapsed ms at which each stage lights up. The last stage holds until the
// server redirects, so the instrument never claims completion early.
const STAGE_STARTS = [0, 2400, 6000, 10000];

function formatElapsed(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

interface EvaluationPipelineProps {
  active: boolean;
  documentCount?: number;
}

export function EvaluationPipeline({ active, documentCount = 0 }: EvaluationPipelineProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    const tick = () => setElapsed(performance.now() - startRef.current);
    const immediate = setTimeout(tick, 0);
    const id = setInterval(tick, 100);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, [active]);

  if (!active) return null;

  let stage = 0;
  for (let i = STAGE_STARTS.length - 1; i >= 0; i--) {
    if (elapsed >= STAGE_STARTS[i]) {
      stage = i;
      break;
    }
  }
  // Asymptotic approach to 94% — real completion is the redirect itself.
  const progress = Math.min(94, 94 * (1 - Math.exp(-elapsed / 11000)));

  return (
    <div className="space-y-3.5">
      <p className="visually-hidden" role="status">
        {`Processing step ${stage + 1} of ${STAGES.length}: ${STAGES[stage].label}. ${STAGES[stage].detail}.`}
      </p>

      <div className="pipeline-in flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-accent">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-emerald-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-outlier tracking-wide">[ PIPELINE // LIVE ]</span>
        </span>
        <span className="font-outlier text-xs text-muted num" aria-hidden="true">
          T+{formatElapsed(elapsed)}
        </span>
      </div>

      <ol className="space-y-1.5">
        {STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'active' : 'queued';
          return (
            <li
              key={s.code}
              className={`pipeline-in relative flex items-center gap-3 overflow-hidden rounded-input border px-3 py-2.5 ${
                state === 'active'
                  ? 'border-accent/40 bg-accent/5'
                  : state === 'done'
                    ? 'border-rule bg-paper'
                    : 'border-rule bg-paper opacity-70'
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {state === 'active' && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="animate-laser-sweep absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
                </span>
              )}
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-pill border font-outlier text-[10px] font-bold ${
                  state === 'done'
                    ? 'border-accent bg-accent text-accent-ink'
                    : state === 'active'
                      ? 'border-accent/60 bg-accent/10 text-accent'
                      : 'border-rule-2 bg-paper text-muted'
                }`}
                aria-hidden="true"
              >
                {state === 'done' ? <Check className="h-3 w-3" strokeWidth={3} /> : s.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold ${state === 'queued' ? 'text-muted' : 'text-ink'}`}>
                  {s.label}
                </span>
                <span className="block truncate text-xs text-muted">{s.detail}</span>
              </span>
              {state === 'done' && (
                <span className="font-outlier text-[10px] font-semibold text-accent">DONE</span>
              )}
              {state === 'active' && (
                <span className="flex items-center gap-1.5 font-outlier text-[10px] font-semibold text-accent">
                  <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  RUNNING
                </span>
              )}
              {state === 'queued' && (
                <span className="font-outlier text-[10px] text-muted">QUEUED</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="pipeline-in space-y-1.5" style={{ animationDelay: '280ms' }}>
        <div className="flex items-center justify-between font-outlier text-[11px] text-muted num">
          <span>EVALUATION PROGRESS</span>
          <span aria-hidden="true">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-rule bg-paper-2">
          <div
            className="relative h-full overflow-hidden rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <span
              aria-hidden="true"
              className="animate-laser-sweep absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>
        </div>
        <p className="pt-0.5 text-xs text-muted">
          {documentCount > 0 && (
            <span className="font-semibold text-ink num">
              {documentCount} document{documentCount === 1 ? '' : 's'} parsed in memory ·{' '}
            </span>
          )}
          Candidate models are tested in memory and discarded. This typically takes under a minute.
        </p>
      </div>
    </div>
  );
}

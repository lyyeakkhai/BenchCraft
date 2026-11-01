'use client';

import { useState } from 'react';
import { updateScenariosAndConfirmAction } from '@/actions/evaluations';
import { DomainProfile } from '@/lib/types';
import { Play, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

interface ReviewFormProps {
  comparisonId: string;
  initialProfile: DomainProfile;
  initialScenarios: {
    id?: string;
    position: number;
    prompt: string;
    rubric: string[];
  }[];
  candidates: {
    id: string;
    modelId: string;
    tier: string;
    name: string | null;
    provider: string | null;
    inputPrice: number;
    outputPrice: number;
  }[];
}

export function ReviewForm({
  comparisonId,
  initialProfile,
  initialScenarios,
  candidates,
}: ReviewFormProps) {
  const [qualityBar, setQualityBar] = useState<number>(initialProfile?.qualityBar || 8.0);
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [isRunning, setIsRunning] = useState(false);

  const updateScenarioPrompt = (index: number, newPrompt: string) => {
    const updated = [...scenarios];
    updated[index].prompt = newPrompt;
    setScenarios(updated);
  };

  const updateRubricItem = (scenarioIndex: number, rubricIndex: number, text: string) => {
    const updated = [...scenarios];
    updated[scenarioIndex].rubric[rubricIndex] = text;
    setScenarios(updated);
  };

  const addScenario = () => {
    if (scenarios.length >= 10) return;
    setScenarios([
      ...scenarios,
      {
        position: scenarios.length + 1,
        prompt: 'Custom test scenario prompt…',
        rubric: ['Accurate response following business rules', 'Helpful tone'],
      },
    ]);
  };

  const removeScenario = (index: number) => {
    if (scenarios.length <= 3) {
      alert('A minimum of 3 test scenarios is required for a valid arena benchmark.');
      return;
    }
    const filtered = scenarios.filter((_, i) => i !== index);
    setScenarios(filtered.map((s, idx) => ({ ...s, position: idx + 1 })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      await updateScenariosAndConfirmAction(comparisonId, scenarios, qualityBar);
    } catch (err) {
      if (
        (err as Error)?.message === 'NEXT_REDIRECT' ||
        (err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')
      ) {
        throw err;
      }
      console.error(err);
      setIsRunning(false);
      alert((err as Error).message || 'Failed to start arena evaluation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="ledger-surface p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-display font-semibold text-ink">
            Formulated domain parameters
          </h2>
          <span className="text-xs text-accent font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Synthesized in memory
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-paper rounded-input border border-rule">
            <div className="text-muted">Domain sector</div>
            <div className="text-sm font-semibold text-ink mt-1">{initialProfile?.industry || 'E-commerce'}</div>
          </div>
          <div className="p-3 bg-paper rounded-input border border-rule">
            <div className="text-muted">Task category</div>
            <div className="text-sm font-semibold text-ink mt-1 capitalize">
              {(initialProfile?.taskCategory || 'support_chat').replace('_', ' ')}
            </div>
          </div>
          <div className="p-3 bg-paper rounded-input border border-rule">
            <div className="text-muted">Languages</div>
            <div className="text-sm font-semibold text-ink mt-1">
              {(initialProfile?.languages || ['English']).join(', ')}
            </div>
          </div>
          <div className="p-3 bg-paper rounded-input border border-rule">
            <div className="text-muted">Assessed risk</div>
            <div className="text-sm font-semibold text-signal mt-1 capitalize">
              {initialProfile?.riskLevel || 'medium'}
            </div>
          </div>
        </div>

        <div className="border-t border-rule pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="qualityBar" className="text-sm font-semibold text-ink num">
                Target quality bar: <span className="font-display font-bold text-signal text-lg">{qualityBar.toFixed(1)} / 10.0</span>
              </label>
              <p className="text-xs text-muted mt-0.5">
                Models scoring below this threshold are excluded from the recommended right-sized tier.
              </p>
            </div>
            <span className="pill num">
              {qualityBar >= 8.5 ? 'Strict (85+)' : qualityBar >= 7.8 ? 'Balanced (80+)' : 'Economy (70+)'}
            </span>
          </div>

          <input
            id="qualityBar"
            type="range"
            min="6.0"
            max="9.5"
            step="0.1"
            value={qualityBar}
            onChange={(e) => setQualityBar(parseFloat(e.target.value))}
            className="w-full accent-ink cursor-pointer"
          />
        </div>
      </div>

      <div className="ledger-surface p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-title font-display font-semibold text-ink num">
              Blinded arena candidates ({candidates.length})
            </h2>
            <p className="text-sm text-muted">Candidates execute responses under identical prompt constraints</p>
          </div>
          <span className="pill">
            Randomized order
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="p-4 rounded-card border border-rule bg-paper flex flex-col justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ProviderLogo provider={cand.provider || cand.name} size="xs" />
                    <span className="text-muted font-semibold truncate">{cand.provider}</span>
                  </div>
                  <span className="pill capitalize shrink-0">
                    {cand.tier}
                  </span>
                </div>
                <div className="font-semibold text-ink text-sm">{cand.name || cand.modelId}</div>
              </div>

              <div className="text-xs text-muted pt-2 border-t border-rule num">
                List: ${cand.inputPrice.toFixed(2)} in / ${cand.outputPrice.toFixed(2)} out (1M tok)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-title font-display font-semibold text-ink">Domain test scenarios</h2>
            <p className="text-sm text-muted">Synthesized to stress-test domain rules, edge cases, and policy compliance</p>
          </div>

          <button
            type="button"
            onClick={addScenario}
            disabled={scenarios.length >= 10}
            className="btn-ledger-ghost btn-sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Add scenario
          </button>
        </div>

        <div className="space-y-3">
          {scenarios.map((sc, scIdx) => (
            <div key={scIdx} className="ledger-surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-signal num">
                  Scenario #{sc.position}
                </span>

                {scenarios.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeScenario(scIdx)}
                    className="text-muted hover:text-error text-xs p-1 cursor-pointer"
                    title="Remove scenario"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  User prompt / edge case
                </label>
                <textarea
                  rows={2}
                  aria-label={`Prompt for scenario ${sc.position}`}
                  value={sc.prompt}
                  onChange={(e) => updateScenarioPrompt(scIdx, e.target.value)}
                  className="ledger-input text-sm leading-relaxed"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-ink mb-1">
                  Objective rubric constraints
                </span>
                <div className="space-y-1.5">
                  {sc.rubric.map((rule, rIdx) => (
                    <input
                      key={rIdx}
                      type="text"
                      aria-label={`Rubric ${rIdx + 1} for scenario ${sc.position}`}
                      value={rule}
                      onChange={(e) => updateRubricItem(scIdx, rIdx, e.target.value)}
                      className="ledger-input text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ledger-surface p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted num">
          All {candidates.length} models will be tested against {scenarios.length} scenarios simultaneously.
        </p>

        <button
          type="submit"
          disabled={isRunning}
          aria-busy={isRunning}
          className="btn-ledger w-full sm:w-auto"
        >
          <Play className="w-4 h-4 fill-current" aria-hidden="true" />
          <span>{isRunning ? 'Launching arena…' : 'Run parallel arena'}</span>
        </button>
      </div>
    </form>
  );
}

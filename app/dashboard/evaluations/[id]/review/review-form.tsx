'use client';

import { useState } from 'react';
import { updateScenariosAndConfirmAction } from '@/actions/evaluations';
import { DomainProfile } from '@/lib/types';
import { Play, Plus, Trash2, Sliders, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

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
        prompt: 'Custom test scenario prompt...',
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
      console.error(err);
      setIsRunning(false);
      alert((err as Error).message || 'Failed to start arena evaluation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Domain Grounding Summary */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-semibold text-[#0A2E2B]">
            Formulated Domain Parameters
          </h2>
          <span className="text-xs text-[#1F5C55] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Synthesized In-Memory
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Domain Sector</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1">{initialProfile?.industry || 'E-commerce'}</div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Task Category</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1 capitalize">
              {(initialProfile?.taskCategory || 'support_chat').replace('_', ' ')}
            </div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Languages</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1 uppercase">
              {(initialProfile?.languages || ['EN']).join(', ')}
            </div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Assessed Risk</div>
            <div className="text-xs font-semibold text-[#B87A14] mt-1 capitalize">
              {initialProfile?.riskLevel || 'medium'}
            </div>
          </div>
        </div>

        {/* Quality Bar Fader */}
        <div className="border-t border-[#D3DDD8] pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="qualityBar" className="text-xs font-semibold text-[#0A2E2B]">
                Target Quality Bar: <span className="font-serif font-bold text-[#8A5A0B] text-base">{qualityBar.toFixed(1)} / 10.0</span>
              </label>
              <p className="text-[11px] text-[#4B605C] mt-0.5">
                Models scoring below this threshold will be excluded from the recommended right-sized tier.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 bg-[#EDF2EF] border border-[#D3DDD8] rounded-full text-[#0A2E2B]">
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
            className="w-full accent-[#1F5C55] cursor-pointer"
          />
        </div>
      </div>

      {/* Selected Candidates Lineup */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-semibold text-[#0A2E2B]">
              Blinded Arena Candidates ({candidates.length})
            </h2>
            <p className="text-xs text-[#4B605C]">Candidates will execute responses under identical prompt constraints</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EDF2EF] text-[#1F5C55]">
            Randomized Order
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="p-4 rounded-xl border border-[#D3DDD8] bg-white/80 flex flex-col justify-between gap-2 text-xs shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#4B605C]">{cand.provider}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#EDF2EF] text-[#0A2E2B]">
                    {cand.tier}
                  </span>
                </div>
                <div className="font-semibold text-[#0A2E2B] mt-1 text-sm">{cand.name || cand.modelId}</div>
              </div>

              <div className="text-[11px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
                List: ${cand.inputPrice.toFixed(2)} in / ${cand.outputPrice.toFixed(2)} out (1M tok)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scenarios & Rubrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-semibold text-[#0A2E2B]">Domain Test Scenarios</h2>
            <p className="text-xs text-[#4B605C]">Synthesized to stress-test domain rules, edge cases, and hallucination absence</p>
          </div>

          <button
            type="button"
            onClick={addScenario}
            disabled={scenarios.length >= 10}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D3DDD8] bg-white text-xs font-semibold text-[#0A2E2B] hover:bg-stone-50 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Scenario
          </button>
        </div>

        <div className="space-y-3">
          {scenarios.map((sc, scIdx) => (
            <div key={scIdx} className="glass-panel rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#B87A14]" />
                  Scenario #{sc.position}
                </span>

                {scenarios.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeScenario(scIdx)}
                    className="text-[#4B605C] hover:text-red-600 text-xs p-1 cursor-pointer"
                    title="Remove scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0A2E2B] mb-1">
                  User Prompt / Edge Case
                </label>
                <textarea
                  rows={2}
                  value={sc.prompt}
                  onChange={(e) => updateScenarioPrompt(scIdx, e.target.value)}
                  className="w-full px-3 py-2 text-xs leading-relaxed bg-white border border-[#D3DDD8] rounded-xl text-[#0A2E2B] focus:outline-none focus:border-[#1F5C55] transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0A2E2B] mb-1">
                  Objective Rubric Constraints
                </label>
                <div className="space-y-1.5">
                  {sc.rubric.map((rule, rIdx) => (
                    <input
                      key={rIdx}
                      type="text"
                      value={rule}
                      onChange={(e) => updateRubricItem(scIdx, rIdx, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#D3DDD8] rounded-lg text-[#0A2E2B] focus:outline-none focus:border-[#1F5C55] transition shadow-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Action Strip */}
      <div className="glass-panel rounded-2xl p-5 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#D3DDD8]">
        <p className="text-xs text-[#4B605C]">
          All {candidates.length} models will be tested against {scenarios.length} scenarios simultaneously.
        </p>

        <button
          type="submit"
          disabled={isRunning}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            isRunning ? 'bg-[#4B605C] cursor-not-allowed' : 'bg-[#0A2E2B] hover:bg-[#1F5C55]'
          }`}
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Launching Blinded Arena...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Run Parallel Arena Benchmark
            </>
          )}
        </button>
      </div>
    </form>
  );
}

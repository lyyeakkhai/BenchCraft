'use client';

import { useState } from 'react';
import { updateScenariosAndConfirmAction } from '@/actions/evaluations';
import { DomainProfile } from '@/lib/types';
import { Play, Plus, Trash2, Sliders, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-white rounded-xl border border-[#D3DDD8] p-6 space-y-6">
        <h2 className="text-base font-semibold text-[#0A2E2B]">
          Formulated Domain Parameters
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#EDF2EF] rounded-lg border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Domain Sector</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1">{initialProfile?.industry || 'E-commerce'}</div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-lg border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Task Category</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1 capitalize">
              {(initialProfile?.taskCategory || 'support_chat').replace('_', ' ')}
            </div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-lg border border-[#D3DDD8]">
            <div className="text-[11px] text-[#4B605C]">Languages</div>
            <div className="text-xs font-semibold text-[#0A2E2B] mt-1 uppercase">
              {(initialProfile?.languages || ['EN']).join(', ')}
            </div>
          </div>
          <div className="p-3 bg-[#EDF2EF] rounded-lg border border-[#D3DDD8]">
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
                Target Quality Bar: <span className="font-bold text-[#8A5A0B] text-sm">{qualityBar.toFixed(1)} / 10.0</span>
              </label>
              <p className="text-[11px] text-[#4B605C] mt-0.5">
                Models scoring below this threshold will be excluded from the recommended right-sized tier.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-[#EDF2EF] border border-[#D3DDD8] rounded-full text-[#0A2E2B]">
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
            className="w-full accent-[#0A2E2B] cursor-pointer"
          />
        </div>
      </div>

      {/* Selected Candidates Lineup */}
      <div className="bg-white rounded-xl border border-[#D3DDD8] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0A2E2B]">
            Blinded Arena Candidates ({candidates.length})
          </h2>
          <span className="text-xs text-[#4B605C]">Randomized order during arena</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="p-3.5 rounded-lg border border-[#D3DDD8] bg-white flex flex-col justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#4B605C]">{cand.provider}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#EDF2EF] text-[#0A2E2B]">
                    {cand.tier}
                  </span>
                </div>
                <div className="font-semibold text-[#0A2E2B] mt-1 text-sm">{cand.name || cand.modelId}</div>
              </div>

              <div className="text-[11px] text-[#4B605C] pt-2 border-t border-[#D3DDD8]">
                Per 1M tokens: ${cand.inputPrice.toFixed(2)} in / ${cand.outputPrice.toFixed(2)} out
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scenarios & Rubrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0A2E2B]">Domain Test Scenarios</h2>
            <p className="text-xs text-[#4B605C]">Formulated to stress-test domain rules, edge cases, and accuracy</p>
          </div>

          <button
            type="button"
            onClick={addScenario}
            disabled={scenarios.length >= 10}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A9BDB7] text-xs font-semibold text-[#0A2E2B] hover:bg-stone-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Scenario
          </button>
        </div>

        <div className="space-y-3">
          {scenarios.map((sc, scIdx) => (
            <div key={scIdx} className="bg-white rounded-xl border border-[#D3DDD8] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
                  Scenario #{sc.position}
                </span>
                <button
                  type="button"
                  onClick={() => removeScenario(scIdx)}
                  className="text-[#4B605C] hover:text-red-600 p-1 cursor-pointer"
                  title="Remove scenario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0A2E2B] block mb-1">
                  Customer Prompt / Query
                </label>
                <textarea
                  rows={2}
                  value={sc.prompt}
                  onChange={(e) => updateScenarioPrompt(scIdx, e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-[#A9BDB7] text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0A2E2B] block mb-1">
                  Objective Evaluation Rubrics
                </label>
                <div className="space-y-1.5">
                  {sc.rubric.map((rub, rubIdx) => (
                    <input
                      key={rubIdx}
                      type="text"
                      value={rub}
                      onChange={(e) => updateRubricItem(scIdx, rubIdx, e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded border border-[#A9BDB7] text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B] font-sans"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Action */}
      <div className="bg-white border border-[#D3DDD8] rounded-xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-[#4B605C]">
          Candidate models will execute blind parallel responses evaluated at zero temperature.
        </p>
        <button
          type="submit"
          disabled={isRunning}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-white text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            isRunning ? 'bg-[#4B605C] cursor-not-allowed' : 'bg-[#0A2E2B] hover:bg-[#1F5C55]'
          }`}
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Initializing Arena...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Arena Comparison ({candidates.length} Models × {scenarios.length} Scenarios)
            </>
          )}
        </button>
      </div>
    </form>
  );
}

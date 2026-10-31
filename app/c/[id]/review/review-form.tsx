'use client';

import { useState } from 'react';
import { updateScenariosAndConfirmAction } from '@/actions/evaluations';
import { DomainProfile } from '@/lib/types';
import { Play, Plus, Trash2, Shield, Info, Check } from 'lucide-react';

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
      {/* Domain Summary & Quality Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-[#0C3838]">Detected Domain Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 font-medium">Industry Domain</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5">{initialProfile?.industry || 'E-commerce'}</div>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 font-medium">Task Category</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5 capitalize">
              {(initialProfile?.taskCategory || 'support_chat').replace('_', ' ')}
            </div>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 font-medium">Target Languages</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5 uppercase">
              {(initialProfile?.languages || ['EN']).join(', ')}
            </div>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-500 font-medium">Risk Level</div>
            <div className="text-sm font-bold text-[#D97706] mt-0.5 capitalize">
              {initialProfile?.riskLevel || 'medium'}
            </div>
          </div>
        </div>

        {/* Quality Bar Threshold Slider */}
        <div className="border-t border-gray-100 pt-5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="qualityBar" className="text-sm font-bold text-gray-900">
                Minimum Quality Bar: <span className="text-[#0C3838] text-base">{qualityBar.toFixed(1)} / 10.0</span>
              </label>
              <p className="text-xs text-gray-500">
                Models scoring below this threshold will not be recommended, ensuring you never sacrifice customer experience.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-[#0C3838] rounded-md">
              {qualityBar >= 8.5 ? 'Strict (Enterprise)' : qualityBar >= 7.8 ? 'Balanced (Recommended)' : 'Cost Focused'}
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
            className="w-full accent-[#0C3838] cursor-pointer"
          />
        </div>
      </div>

      {/* Selected Candidates Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0C3838]">Candidate Models Selected for Arena</h2>
          <span className="text-xs text-gray-500">{candidates.length} models across 3 tiers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 ${
                cand.tier === 'top'
                  ? 'border-purple-200 bg-purple-50/30'
                  : cand.tier === 'mid'
                  ? 'border-blue-200 bg-blue-50/30'
                  : 'border-emerald-200 bg-emerald-50/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-500">{cand.provider}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      cand.tier === 'top'
                        ? 'bg-purple-100 text-purple-800'
                        : cand.tier === 'mid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {cand.tier}
                  </span>
                </div>
                <div className="font-bold text-sm text-gray-900 mt-1">{cand.name || cand.modelId}</div>
              </div>

              <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/50">
                ${cand.inputPrice.toFixed(2)} in / ${cand.outputPrice.toFixed(2)} out (per 1M tok)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0C3838]">Test Scenarios & Rubrics</h2>
            <p className="text-xs text-gray-500">Each candidate model will be tested against these prompts in parallel.</p>
          </div>

          <button
            type="button"
            onClick={addScenario}
            disabled={scenarios.length >= 10}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add Scenario
          </button>
        </div>

        <div className="space-y-4">
          {scenarios.map((sc, scIdx) => (
            <div key={scIdx} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0C3838] uppercase">Scenario #{sc.position}</span>
                <button
                  type="button"
                  onClick={() => removeScenario(scIdx)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove scenario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">User Query Prompt</label>
                <textarea
                  rows={2}
                  value={sc.prompt}
                  onChange={(e) => updateScenarioPrompt(scIdx, e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0C3838]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Grading Rubric Criteria</label>
                <div className="space-y-1.5">
                  {sc.rubric.map((rub, rubIdx) => (
                    <input
                      key={rubIdx}
                      type="text"
                      value={rub}
                      onChange={(e) => updateRubricItem(scIdx, rubIdx, e.target.value)}
                      className="w-full text-xs p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0C3838]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit / Run Arena CTA */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isRunning}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white text-base shadow-md transition flex items-center justify-center gap-2 ${
            isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0C3838] hover:bg-[#164E4E] cursor-pointer'
          }`}
        >
          {isRunning ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Initializing Candidate Arena...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Run Automated Arena Evaluation ({candidates.length} Models × {scenarios.length} Scenarios)
            </>
          )}
        </button>
      </div>
    </form>
  );
}

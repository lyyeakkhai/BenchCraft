'use client';

import { useState } from 'react';
import { createEvaluationAction } from '@/actions/evaluations';
import { Stepper } from '@/components/brand/stepper';
import {
  ShieldCheck,
  Upload,
  Trash2,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Layers,
  ArrowRight,
  FileText,
  Zap,
} from 'lucide-react';

export default function NewEvaluationPage() {
  const [title, setTitle] = useState('Nari Boutique Support Assistant');
  const [description, setDescription] = useState(
    "We sell women's fashion online in Cambodia. Customers message us on Telegram and Facebook about orders, sizes and delivery. We want an assistant that answers from our FAQ and policies in Khmer and English, and hands over to a person when it is unsure."
  );
  const [mainTask, setMainTask] = useState('Customer support chat');
  const [conversations, setConversations] = useState<number>(50000);
  const [priority, setPriority] = useState<'cost' | 'quality' | 'speed'>('cost');
  const [convLength, setConvLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskOptions = ['Customer support chat', 'Document Q&A', 'Coding', 'Data extraction'];

  // Presets for instant setup
  const loadPreset = (type: 'nari' | 'fintech' | 'legal') => {
    if (type === 'nari') {
      setTitle('Nari Boutique Support Assistant');
      setDescription(
        "We sell women's fashion online in Cambodia. Customers message us on Telegram and Facebook about orders, sizes and delivery. We want an assistant that answers from our FAQ and policies in Khmer and English, and hands over to a person when it is unsure."
      );
      setMainTask('Customer support chat');
      setConversations(50000);
      setPriority('cost');
      setConvLength('medium');
    } else if (type === 'fintech') {
      setTitle('FinPay Transaction Disputes');
      setDescription(
        "Automated dispute intake and tier-1 triage for consumer fintech app. Evaluates customer transaction queries, checks fraud policy, extracts dispute metadata, and drafts dispute escalation files."
      );
      setMainTask('Document Q&A');
      setConversations(75000);
      setPriority('quality');
      setConvLength('long');
    } else if (type === 'legal') {
      setTitle('ClauseCraft Contract Analyzer');
      setDescription(
        "Extracts indemnification clauses, governing law, and liability caps from standard commercial master service agreements. Highly sensitive to false positives and hallucinated citations."
      );
      setMainTask('Data extraction');
      setConversations(20000);
      setPriority('quality');
      setConvLength('long');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const combined = [...selectedFiles, ...filesArray].slice(0, 5);
      setSelectedFiles(combined);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Live estimated savings
  const estimatedFrontierMonthly = Math.round((conversations / 1000) * 30);
  const estimatedRightSizedMonthly = Math.round((conversations / 1000) * 0.30);
  const projectedMonthlySavings = Math.max(10, estimatedFrontierMonthly - estimatedRightSizedMonthly);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Step Progress Bar */}
      <div className="rounded-xl overflow-hidden border border-[#D3DDD8] shadow-xs">
        <Stepper currentStep={1} businessTitle={title || 'New Evaluation'} />
      </div>

      {/* Main Header & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-[11px] font-semibold text-[#1F5C55]">
            <Sparkles className="w-3.5 h-3.5 text-[#B87A14]" />
            Step 1 · Domain Grounding & Workload Setup
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#0A2E2B] tracking-tight">
            Tell us about your business
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C]">
            Describe your domain requirements and attach relevant business policies. BenchCraft tests candidate models in memory.
          </p>
        </div>

        {/* Quick-Fill Presets */}
        <div className="space-y-1.5 text-right sm:text-left">
          <span className="text-[11px] font-semibold text-[#4B605C] uppercase tracking-wider block">
            Load Verified Blueprint:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset('nari')}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#D3DDD8] hover:border-[#1F5C55] text-[#0A2E2B] font-semibold transition cursor-pointer flex items-center gap-1"
            >
              👗 Nari Boutique
            </button>
            <button
              type="button"
              onClick={() => loadPreset('fintech')}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#D3DDD8] hover:border-[#1F5C55] text-[#0A2E2B] font-semibold transition cursor-pointer flex items-center gap-1"
            >
              💳 Fintech Triage
            </button>
            <button
              type="button"
              onClick={() => loadPreset('legal')}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#D3DDD8] hover:border-[#1F5C55] text-[#0A2E2B] font-semibold transition cursor-pointer flex items-center gap-1"
            >
              ⚖️ Contract QA
            </button>
          </div>
        </div>
      </div>

      <form
        action={async (formData: FormData) => {
          setIsSubmitting(true);
          selectedFiles.forEach((file) => formData.append('files', file));
          formData.set('title', title);
          formData.set(
            'description',
            `${description}\n\n[Main Task: ${mainTask} | Priority: ${priority} | Target Conversations: ${conversations}]`
          );
          formData.set('conversationsPerMonth', conversations.toString());
          formData.set('conversationLength', convLength);
          try {
            await createEvaluationAction(formData);
          } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            alert((err as Error).message || 'Failed to analyze business.');
          }
        }}
        className="space-y-6"
      >
        {/* Two-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Card: Business Description & Operational Scale */}
          <section className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-[#0A2E2B] uppercase tracking-wider mb-1.5">
                Project or Business Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nari Boutique"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D3DDD8] rounded-xl text-[#0A2E2B] focus:outline-none focus:border-[#1F5C55] transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2E2B] uppercase tracking-wider mb-1.5">
                What does your business do, and what should AI do for it?
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm leading-relaxed bg-white border border-[#D3DDD8] rounded-xl text-[#0A2E2B] focus:outline-none focus:border-[#1F5C55] transition shadow-xs"
                placeholder="Describe your customers, languages, policies, and key requirements..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2E2B] uppercase tracking-wider mb-2">
                Primary Operational Task
              </label>
              <div className="flex flex-wrap gap-2">
                {taskOptions.map((task) => (
                  <button
                    type="button"
                    key={task}
                    onClick={() => setMainTask(task)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                      mainTask === task
                        ? 'bg-[#0A2E2B] border-[#0A2E2B] text-white font-semibold shadow-xs'
                        : 'bg-white border-[#D3DDD8] text-[#0A2E2B] hover:border-[#1F5C55]'
                    }`}
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#D3DDD8]">
              {/* Monthly Conversations Scale */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0A2E2B] uppercase tracking-wider">
                    Monthly Conversations
                  </label>
                  <span className="font-serif font-bold text-sm text-[#0A2E2B]">
                    {conversations.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={5000}
                  value={conversations}
                  onChange={(e) => setConversations(parseInt(e.target.value) || 10000)}
                  className="w-full accent-[#1F5C55] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#4B605C] mt-1">
                  <span>10K</span>
                  <span>50K (Nari)</span>
                  <span>100K</span>
                  <span>250K</span>
                </div>
              </div>

              {/* Optimization Target */}
              <div>
                <label className="block text-xs font-semibold text-[#0A2E2B] uppercase tracking-wider mb-1.5">
                  Optimization Priority
                </label>
                <div className="flex border border-[#D3DDD8] bg-white rounded-xl overflow-hidden shadow-xs">
                  {(['cost', 'quality', 'speed'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => {
                        setPriority(opt);
                        if (opt === 'quality') setConvLength('long');
                        else if (opt === 'speed') setConvLength('short');
                        else setConvLength('medium');
                      }}
                      className={`flex-1 py-2 text-xs text-center transition capitalize cursor-pointer ${
                        priority === opt
                          ? 'bg-[#0A2E2B] text-white font-semibold'
                          : 'bg-white text-[#4B605C] hover:bg-stone-50'
                      }`}
                    >
                      {opt === 'cost' ? 'Lowest Cost' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Live Savings Projector + Document Dropzone */}
          <section className="lg:col-span-5 space-y-6">
            {/* Live Projected Savings Widget */}
            <div className="glass-panel rounded-2xl p-6 space-y-3 border-2 border-[#B87A14]/50 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#8A5A0B] flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-[#8A5A0B]" />
                  Projected Right-Sizing
                </span>
                <span className="pill rec">Estimated</span>
              </div>

              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#8A5A0B]">
                  +${projectedMonthlySavings.toLocaleString()}
                  <span className="text-sm font-sans font-normal text-[#4B605C]"> / mo</span>
                </div>
                <div className="text-xs text-[#4B605C] mt-1">
                  Estimated savings vs uncalibrated frontier tier ({conversations.toLocaleString()} chats/mo).
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D3DDD8] text-[11px]">
                <div className="p-2 rounded-lg bg-white border border-[#D3DDD8]">
                  <span className="text-[#4B605C] block">Frontier Spend</span>
                  <span className="font-semibold text-[#0A2E2B]">${estimatedFrontierMonthly}/mo</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FBF3E2] border border-[#E7B44A]">
                  <span className="text-[#8A5A0B] block">Right-Sized Spend</span>
                  <span className="font-semibold text-[#8A5A0B]">${estimatedRightSizedMonthly}/mo</span>
                </div>
              </div>
            </div>

            {/* Document Ingestion Card */}
            <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-semibold text-[#0A2E2B] uppercase tracking-wider">
                  Domain Context Documents
                </h3>
                <p className="text-xs text-[#4B605C] mt-0.5">
                  Ground scenarios in your real business policies, FAQs, or guidelines.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-[#1F5C55]/60 rounded-xl bg-[#F6FAF8] p-6 flex flex-col items-center justify-center text-center transition hover:bg-[#EDF2EF] cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-10 h-10 rounded-full bg-[#1F5C55]/10 text-[#1F5C55] flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <b className="text-xs sm:text-sm text-[#0A2E2B]">Click or drag documents here</b>
                <span className="text-[11px] text-[#4B605C] mt-0.5">
                  PDF, DOCX, TXT, or Markdown (up to 10 MB each)
                </span>
              </div>

              {/* Uploaded Files List */}
              {selectedFiles.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-[#D3DDD8]">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-[#D3DDD8] text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-[#1F5C55] flex-shrink-0" />
                        <span className="font-semibold text-[#0A2E2B] truncate">{file.name}</span>
                        <span className="text-[#4B605C] text-[11px] flex-shrink-0">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1F5C55]" />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-[#4B605C] hover:text-red-600 p-0.5 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-[#4B605C] italic py-1 text-center">
                  Optional: If no documents are attached, domain scenarios will be synthesized directly from your description.
                </div>
              )}

              {/* Privacy / Zero Data Retention Guarantee */}
              <div className="flex items-start gap-2 pt-2 border-t border-[#D3DDD8] text-[11px] text-[#4B605C]">
                <ShieldCheck className="w-4 h-4 text-[#1F5C55] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Data Retention:</strong> Files are parsed strictly in memory and discarded. No data is stored or used for model training.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA Action Strip */}
        <div className="glass-panel rounded-2xl p-5 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#D3DDD8]">
          <p className="text-xs sm:text-sm text-[#4B605C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1F5C55]" />
            <span>Next step: BenchCraft synthesizes 8 domain scenarios and prepares the blinded arena.</span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              isSubmitting ? 'bg-[#4B605C] cursor-not-allowed' : 'bg-[#0A2E2B] hover:bg-[#1F5C55]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Synthesizing Domain Scenarios...
              </>
            ) : (
              <>
                Synthesize Scenarios & Run Arena
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

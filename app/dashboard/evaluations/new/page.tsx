'use client';

import { useState } from 'react';
import { createEvaluationAction } from '@/actions/evaluations';
import { Stepper } from '@/components/brand/stepper';
import { ProviderLogo } from '@/components/brand/provider-logo';
import {
  ShieldCheck,
  Upload,
  Trash2,
  CheckCircle2,
  TrendingDown,
  FileText,
} from 'lucide-react';

export default function NewEvaluationPage() {
  const [title, setTitle] = useState('Nari Boutique Support Assistant');
  const [description, setDescription] = useState(
    'We sell women’s fashion online in Cambodia. Customers message us on Telegram and Facebook about orders, sizes and delivery. We want an assistant that answers from our FAQ and policies in Khmer and English, and hands over to a person when it is unsure.'
  );
  const [mainTask, setMainTask] = useState('Customer support chat');
  const [conversations, setConversations] = useState<number>(50000);
  const [priority, setPriority] = useState<'cost' | 'quality' | 'speed'>('cost');
  const [convLength, setConvLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskOptions = ['Customer support chat', 'Document Q&A', 'Coding', 'Data extraction'];

  const loadPreset = (type: 'nari' | 'fintech' | 'legal') => {
    if (type === 'nari') {
      setTitle('Nari Boutique Support Assistant');
      setDescription(
        'We sell women’s fashion online in Cambodia. Customers message us on Telegram and Facebook about orders, sizes and delivery. We want an assistant that answers from our FAQ and policies in Khmer and English, and hands over to a person when it is unsure.'
      );
      setMainTask('Customer support chat');
      setConversations(50000);
      setPriority('cost');
      setConvLength('medium');
    } else if (type === 'fintech') {
      setTitle('FinPay Transaction Disputes');
      setDescription(
        'Automated dispute intake and tier-1 triage for consumer fintech app. Evaluates customer transaction queries, checks fraud policy, extracts dispute metadata, and drafts dispute escalation files.'
      );
      setMainTask('Document Q&A');
      setConversations(75000);
      setPriority('quality');
      setConvLength('long');
    } else if (type === 'legal') {
      setTitle('ClauseCraft Contract Analyzer');
      setDescription(
        'Extracts indemnification clauses, governing law, and liability caps from standard commercial master service agreements. Highly sensitive to false positives and hallucinated citations.'
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
      const oversized = filesArray.find((f) => f.size > 10 * 1024 * 1024);
      if (oversized) {
        alert(`File "${oversized.name}" exceeds the 10 MB limit.`);
        e.target.value = '';
        return;
      }
      const combined = [...selectedFiles, ...filesArray].slice(0, 5);
      setSelectedFiles(combined);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const estimatedFrontierMonthly = Math.round((conversations / 1000) * 30);
  const estimatedRightSizedMonthly = Math.round((conversations / 1000) * 0.30);
  const projectedMonthlySavings = Math.max(10, estimatedFrontierMonthly - estimatedRightSizedMonthly);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="rounded-card overflow-hidden border border-rule">
        <Stepper currentStep={1} businessTitle={title || 'New evaluation'} />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink tracking-tight">
            Tell us about your business
          </h1>
          <p className="text-sm text-muted">
            Describe your domain requirements and attach relevant business policies. BenchCraft tests candidate models in memory.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted block">
            Load verified blueprint:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadPreset('nari')}
              className="btn-ledger-ghost btn-sm"
            >
              Nari Boutique
            </button>
            <button
              type="button"
              onClick={() => loadPreset('fintech')}
              className="btn-ledger-ghost btn-sm"
            >
              Fintech Triage
            </button>
            <button
              type="button"
              onClick={() => loadPreset('legal')}
              className="btn-ledger-ghost btn-sm"
            >
              Contract QA
            </button>
          </div>
        </div>
      </div>

      <form
        action={async (formData: FormData) => {
          if (!description.trim() && selectedFiles.length === 0) {
            alert('Please describe your business use case or attach a business document.');
            return;
          }
          setIsSubmitting(true);
          selectedFiles.forEach((file) => formData.append('files', file));
          formData.set('title', title);
          formData.set(
            'description',
            description.trim()
              ? `${description}\n\n[Main Task: ${mainTask} | Priority: ${priority} | Target Conversations: ${conversations}]`
              : `[Main Task: ${mainTask} | Priority: ${priority} | Target Conversations: ${conversations}]`
          );
          formData.set('conversationsPerMonth', conversations.toString());
          formData.set('conversationLength', convLength);
          try {
            await createEvaluationAction(formData);
          } catch (err) {
            if (
              (err as Error)?.message === 'NEXT_REDIRECT' ||
              (err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')
            ) {
              throw err;
            }
            console.error(err);
            setIsSubmitting(false);
            alert((err as Error).message || 'Failed to analyze business.');
          }
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 ledger-surface p-6 sm:p-7 space-y-5">
            <div>
              <label htmlFor="project-title" className="block text-sm font-semibold text-ink mb-1.5">
                Project or business name
              </label>
              <input
                id="project-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nari Boutique"
                className="ledger-input"
              />
            </div>

            <div>
              <label htmlFor="project-desc" className="block text-sm font-semibold text-ink mb-1.5">
                What does your business do, and what should AI do for it?
              </label>
              <textarea
                id="project-desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="ledger-input leading-relaxed"
                placeholder="Describe your customers, languages, policies, and key requirements, or attach documents on the right…"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-ink mb-2">
                Primary operational task
              </span>
              <div className="flex flex-wrap gap-2">
                {taskOptions.map((task) => (
                  <button
                    type="button"
                    key={task}
                    onClick={() => setMainTask(task)}
                    className={`text-sm px-3.5 py-2 rounded-input border transition-colors cursor-pointer whitespace-nowrap ${
                      mainTask === task
                        ? 'bg-ink border-ink text-paper-2 font-semibold'
                        : 'bg-paper border-rule text-ink hover:border-ink'
                    }`}
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-rule">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="monthly-convs" className="text-sm font-semibold text-ink">
                    Monthly conversations
                  </label>
                  <span className="font-display font-bold text-md text-ink num">
                    {conversations.toLocaleString()}
                  </span>
                </div>
                <input
                  id="monthly-convs"
                  type="range"
                  min={1000}
                  max={250000}
                  step={5000}
                  value={conversations}
                  onChange={(e) => setConversations(parseInt(e.target.value) || 10000)}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 num">
                  <span>10K</span>
                  <span>50K (Nari)</span>
                  <span>100K</span>
                  <span>250K</span>
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-ink mb-1.5">
                  Optimization priority
                </span>
                <div className="flex border border-rule bg-paper rounded-input overflow-hidden">
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
                      className={`flex-1 py-2 text-sm text-center transition-colors capitalize cursor-pointer whitespace-nowrap ${
                        priority === opt
                          ? 'bg-ink text-paper-2 font-semibold'
                          : 'bg-paper text-muted hover:text-ink'
                      }`}
                    >
                      {opt === 'cost' ? 'Lowest cost' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 space-y-6">
            <div className="ledger-signal p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-signal flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-signal" aria-hidden="true" />
                  Projected right-sizing
                </span>
                <span className="pill rec">Estimated</span>
              </div>

              <div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-signal num">
                  +${projectedMonthlySavings.toLocaleString()}
                  <span className="text-sm font-body font-normal text-muted"> / mo</span>
                </div>
                <div className="text-xs text-muted mt-1 num">
                  Estimated savings vs uncalibrated frontier tier ({conversations.toLocaleString()} chats/mo).
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="p-2.5 rounded-input bg-paper border border-rule">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ProviderLogo provider="anthropic" size="xs" />
                    <span className="text-muted">Frontier spend</span>
                  </div>
                  <span className="font-semibold text-ink num">${estimatedFrontierMonthly}/mo</span>
                </div>
                <div className="p-2.5 rounded-input bg-paper border border-rule">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ProviderLogo provider="google" size="xs" />
                    <span className="text-signal">Right-sized spend</span>
                  </div>
                  <span className="font-semibold text-signal num">${estimatedRightSizedMonthly}/mo</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted flex items-center justify-between">
                <span>Parallel test fleet:</span>
                <div className="flex items-center gap-1">
                  {['anthropic', 'google', 'openai', 'meta', 'deepseek'].map((p) => (
                    <ProviderLogo key={p} provider={p} size="xs" />
                  ))}
                </div>
              </div>
            </div>

            <div className="ledger-surface p-6 space-y-4">
              <div>
                <h2 className="text-title font-display font-semibold text-ink">
                  Domain context documents
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Ground scenarios in your real business policies, FAQs, or guidelines.
                </p>
              </div>

              <div className="relative border-2 border-dashed border-rule-2 rounded-card bg-paper p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-paper-3 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  aria-label="Upload domain context documents"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-10 h-10 rounded-pill bg-paper-2 text-accent flex items-center justify-center mb-2 border border-rule">
                  <Upload className="w-5 h-5" aria-hidden="true" />
                </div>
                <b className="text-sm text-ink">Click or drag documents here</b>
                <span className="text-xs text-muted mt-0.5">
                  PDF, DOCX, TXT, or Markdown (up to 10 MB each)
                </span>
              </div>

              {selectedFiles.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-rule">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-input bg-paper border border-rule text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                        <span className="font-semibold text-ink truncate">{file.name}</span>
                        <span className="text-muted text-xs flex-shrink-0 num">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent" aria-hidden="true" />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-muted hover:text-error p-1 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted py-1 text-center">
                  Attach business policies, FAQs, or guidelines to ground your evaluation.
                </div>
              )}

              <div className="flex items-start gap-2 pt-3 border-t border-rule text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Zero Data Retention:</strong> Files are parsed strictly in memory and discarded. No data is stored or used for model training.
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="ledger-surface p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Next, we match models to your use case and compare the top 3.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn-ledger w-full sm:w-auto"
          >
            {isSubmitting ? 'Finding your model…' : 'Find My model'}
          </button>
        </div>
      </form>
    </div>
  );
}

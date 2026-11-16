import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '1',
      title: 'Domain context and document ingestion',
      desc: 'Describe what your business does and attach reference files (FAQ sheets, sizing guides, return policies). Files are parsed in memory using strict Zero Data Retention.',
      detail:
        'The intake engine identifies key operational parameters: your industry risk level, primary customer languages (such as Khmer and English), and required interaction depth.',
    },
    {
      num: '2',
      title: 'Automated scenario and rubric synthesis',
      desc: 'BenchCraft formulates 6 to 8 realistic, domain-grounded test scenarios designed to stress-test your business rules, edge cases, and policy compliance.',
      detail:
        'For each scenario, the engine generates an objective grading rubric with explicit criteria. You can review and edit these prompts and grading rules before running the test.',
    },
    {
      num: '3',
      title: 'Multi-tier candidate lineup',
      desc: 'The engine selects 5 candidate models from our curated catalog across Cheap, Balanced, and Frontier tiers (Anthropic, Google, OpenAI, Meta, DeepSeek).',
      detail:
        'This ensures fair representation across price points: from $0.10/1M token lightweight models to $15.00/1M token flagship models.',
      providers: ['anthropic', 'google', 'openai', 'meta', 'deepseek'],
    },
    {
      num: '4',
      title: 'Parallel blinded arena execution',
      desc: 'Scenarios are executed against all candidates simultaneously via OpenRouter with Zero Data Retention headers (zdr: true, data_collection: "deny").',
      detail:
        'Model outputs are anonymized and shuffled into blinded labels (Candidate A, Candidate B) to eliminate position bias. Input tokens, output tokens, and response latencies are measured exactly.',
      providers: ['openrouter'],
    },
    {
      num: '5',
      title: 'Objective judge and deterministic right-sizing',
      desc: 'Google Gemini 2.5 Flash acts as an impartial judge at temperature 0, scoring each blinded answer from 0.0 to 10.0 against the scenario rubrics.',
      detail:
        'Our deterministic recommender picks the lowest-cost model clearing your quality bar (at least 75% pass rate). It computes exact monthly dollar savings against the frontier default and provides direct procurement links.',
      providers: ['google'],
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Banner Hero */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-display font-display font-semibold text-ink">
          How BenchCraft evaluates and right-sizes models.
        </h1>

        <p className="lead text-muted">
          From unstructured business context to audited financial right-sizing in five deterministic stages.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <Link href="/c/new" className="btn-ledger">
            Run an evaluation now
          </Link>
        </div>
      </section>

      {/* 5-Step Ordered Pipeline */}
      <section className="space-y-8 pt-12 border-t border-rule">
        <div className="space-y-2">
          <h2 className="text-section font-display font-semibold text-ink">
            The end-to-end evaluation pipeline.
          </h2>
          <p className="lead text-muted">
            Every audit runs in an isolated, privacy-guaranteed runtime.
          </p>
        </div>

        <ol className="space-y-4 list-none p-0 m-0">
          {steps.map((s) => (
            <li
              key={s.num}
              className="ledger-surface p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-4 flex items-baseline gap-3">
                <span className="font-display font-bold text-2xl text-signal num">
                  {s.num}.
                </span>
                <h3 className="text-title font-display font-semibold text-ink">
                  {s.title}
                </h3>
              </div>

              <div className="md:col-span-8 space-y-3">
                <p className="text-md text-ink leading-relaxed">
                  {s.desc}
                </p>
                {s.providers && s.providers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {s.providers.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-xs font-semibold text-ink">
                        <ProviderLogo provider={p} size="xs" />
                        <span className="capitalize">{p}</span>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted leading-relaxed pt-3 border-t border-rule">
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Privacy & Zero Data Retention Architecture */}
      <section className="ledger-surface p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Privacy and Zero Data Retention guarantee
            </h2>
            <p className="text-sm text-muted">
              Strict cryptographic compliance for sensitive business documents and policy manuals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-5 rounded-card bg-paper border border-rule space-y-1.5">
            <div className="font-semibold text-ink">In-memory processing</div>
            <p className="text-muted leading-relaxed">
              Files are processed in ephemeral memory buffers during scenario synthesis and immediately wiped.
            </p>
          </div>
          <div className="p-5 rounded-card bg-paper border border-rule space-y-1.5">
            <div className="font-semibold text-ink">Upstream ZDR headers</div>
            <p className="text-muted leading-relaxed">
              Every OpenRouter API request enforces <code className="font-outlier text-ink">zdr: true</code> and denies data collection.
            </p>
          </div>
          <div className="p-5 rounded-card bg-paper border border-rule space-y-1.5">
            <div className="font-semibold text-ink">Zero model training</div>
            <p className="text-muted leading-relaxed">
              Neither BenchCraft nor provider models ever train on your customer conversations or uploaded data.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="ledger-well p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h2 className="text-title font-display font-semibold text-ink">
            Ready to test your use case?
          </h2>
          <p className="text-md text-muted">
            Get a side-by-side comparison of candidate models and deterministic savings in 60 seconds.
          </p>
        </div>
        <Link href="/c/new" className="btn-ledger">
          Start business evaluation
        </Link>
      </section>
    </div>
  );
}

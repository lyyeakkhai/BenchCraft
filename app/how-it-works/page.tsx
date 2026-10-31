import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Cpu,
  Award,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Domain Context & Document Ingestion',
      icon: FileText,
      desc: 'Describe what your business does and attach reference files (FAQ sheets, sizing guides, return policies). Files are parsed in-memory using strict Zero Data Retention.',
      detail:
        'The intake engine identifies key operational parameters: your industry risk level, primary customer languages (e.g. Khmer and English), and required interaction depth.',
    },
    {
      num: '02',
      title: 'Automated Scenario & Rubric Synthesis',
      icon: Sparkles,
      desc: 'BenchCraft formulates 6 to 8 realistic, domain-grounded test scenarios designed to stress-test your business rules, edge cases, and policy compliance.',
      detail:
        'For each scenario, the engine generates an objective grading rubric with explicit criteria. You can review and edit these prompts and grading rules before running the test.',
    },
    {
      num: '03',
      title: 'Multi-Tier Candidate Lineup',
      icon: Cpu,
      desc: 'The engine selects 5 candidate models from our curated catalog across Cheap, Balanced, and Frontier tiers (Anthropic, Google, OpenAI, Meta, DeepSeek).',
      detail:
        'This ensures fair representation across price points: from $0.10/1M token lightweight models to $15.00/1M token flagship models.',
    },
    {
      num: '04',
      title: 'Parallel Blinded Arena Execution',
      icon: Award,
      desc: 'Scenarios are executed against all candidates simultaneously via OpenRouter with Zero Data Retention headers (zdr: true, data_collection: "deny").',
      detail:
        'Model outputs are anonymized and shuffled into blinded labels (Candidate A, Candidate B) to eliminate position bias. Input tokens, output tokens, and response latencies are measured exactly.',
    },
    {
      num: '05',
      title: 'Objective Judge & Deterministic Right-Sizing',
      icon: TrendingDown,
      desc: 'Google Gemini 2.5 Flash acts as an impartial judge at temperature 0, scoring each blinded answer from 0.0 to 10.0 against the scenario rubrics.',
      detail:
        'Our deterministic recommender picks the lowest-cost model clearing your quality bar (>= 75% pass rate). It computes exact monthly dollar savings against the top-tier default and provides direct procurement links.',
    },
  ];

  return (
    <div className="space-y-20 py-6">
      {/* Header */}
      <section className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
          <span className="w-2 h-2 rounded-full bg-[#1F5C55]" />
          Methodology & Architecture
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#0A2E2B] leading-[1.15] tracking-tight">
          How BenchCraft evaluates and right-sizes models.
        </h1>

        <p className="text-base sm:text-lg text-[#4B605C] leading-relaxed">
          From unstructured business context to audited financial right-sizing in 5 deterministic steps. Here is
          the exact pipeline that powers our automated evaluation arena.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link href="/c/new" className="btn-ledger px-6 py-3 text-sm">
            Run an Evaluation Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5-Step Visual Timeline */}
      <section className="space-y-6">
        <div className="border-b border-[#D3DDD8] pb-4">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            The End-to-End Evaluation Pipeline
          </h2>
          <p className="text-xs text-[#4B605C] mt-1">
            Every audit runs in an isolated, privacy-guaranteed runtime.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white border border-[#D3DDD8] rounded-xl p-6 sm:p-7 flex flex-col md:flex-row items-start gap-6 shadow-xs relative"
              >
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="font-serif font-semibold text-3xl text-[#0A2E2B] w-12 text-center">
                    {s.num}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#0A2E2B] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#1F5C55]" />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-serif font-semibold text-[#0A2E2B]">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#0A2E2B] leading-relaxed">
                    {s.desc}
                  </p>
                  <p className="text-xs text-[#4B605C] leading-relaxed pt-1 border-t border-[#D3DDD8]">
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy & Zero Data Retention Architecture */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EDF2EF] text-[#1F5C55] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#0A2E2B]">
              Privacy & Zero Data Retention Guarantee
            </h2>
            <p className="text-xs text-[#4B605C]">
              Enterprise-grade compliance for sensitive business documents and policy manuals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] space-y-1.5">
            <div className="font-semibold text-[#0A2E2B]">In-Memory Processing</div>
            <p className="text-[#4B605C] leading-relaxed">
              Files are processed in ephemeral memory buffers during scenario synthesis and immediately wiped.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] space-y-1.5">
            <div className="font-semibold text-[#0A2E2B]">Upstream ZDR Headers</div>
            <p className="text-[#4B605C] leading-relaxed">
              Every OpenRouter API request enforces <code className="text-[#0A2E2B]">zdr: true</code> and denies data collection.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] space-y-1.5">
            <div className="font-semibold text-[#0A2E2B]">Zero Model Training</div>
            <p className="text-[#4B605C] leading-relaxed">
              Neither BenchCraft nor provider models will ever train on your customer conversations or uploaded data.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#EDF2EF] border border-[#D3DDD8] rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center sm:text-left">
          <h3 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            Ready to test your use case?
          </h3>
          <p className="text-xs sm:text-sm text-[#4B605C]">
            Get a side-by-side comparison of 3 models and deterministic savings in 60 seconds.
          </p>
        </div>
        <Link href="/c/new" className="btn-ledger px-6 py-3 text-sm whitespace-nowrap">
          Start Business Evaluation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers,
  Lock,
  Scale,
  FileText,
  TrendingDown,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import { InteractiveRoiDemo } from '@/components/marketing/interactive-roi-demo';
import { InteractiveProviderDock } from '@/components/marketing/interactive-provider-dock';
import { InteractiveArchitectureBento } from '@/components/marketing/interactive-architecture-bento';
import { ModelMatrixTable } from '@/components/marketing/model-matrix-table';
import { ClerkSpecimenGrid } from '@/components/marketing/clerk-specimen-grid';
import { ClerkCrosshair, ClerkLaserDivider, ClerkBentoChassis } from '@/components/brand/clerk-grid';
import { ProviderLogo } from '@/components/brand/provider-logo';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://benchcraft.dev/#software',
      name: 'BenchCraft',
      applicationCategory: 'DeveloperApplication, BusinessApplication',
      operatingSystem: 'All',
      url: 'https://benchcraft.dev',
      description:
        'Empirical AI model evaluation and right-sizing workbench for engineering teams. Benchmark 5 candidate models concurrently with Zero Data Retention and temperature-0 rubric audits.',
      offers: {
        '@type': 'Offer',
        price: '29.00',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Blinded Parallel Model Arena',
        'Cryptographic Zero Data Retention (zdr: true)',
        'Temperature 0 Rubric LLM Judge',
        '2D Pareto Frontier Cost vs Accuracy Mapping',
        'Executive Audit Artifact PDF & JSON Export',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://benchcraft.dev/#organization',
      name: 'BenchCraft',
      url: 'https://benchcraft.dev',
      logo: 'https://benchcraft.dev/benchcraft-lockup-dark.png',
      sameAs: ['https://github.com/benchcraft', 'https://twitter.com/benchcraft'],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 relative">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Background Tech Grid + Top Beam (Linear + Vercel + Clerk DNA) */}
      <div className="fixed inset-0 bg-tech-grid pointer-events-none -z-20 opacity-60" />
      <div className="fixed inset-x-0 top-0 h-[560px] glow-beam pointer-events-none -z-10" />

      {/* 01 // HERO: The High-Status Engineering Workbench */}
      <section className="relative group">
        <ClerkCrosshair position="tl" />
        <ClerkCrosshair position="tr" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[74dvh] relative">
          {/* Ambient Light Orbs for Glass Refraction */}
          <div className="absolute top-1/3 -left-24 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-1/3 w-80 h-80 bg-signal/10 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:col-span-5 space-y-6 relative z-10">
            {/* Coordinate + Live Gateway Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-1 rounded-full glass-well border border-rule">
                [01 // WORKBENCH]
              </span>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-pill glass-card text-xs font-semibold text-accent border border-accent/30"
                role="status"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                <span>Zero Data Retention Enforced</span>
              </div>
            </div>

            {/* Hybrid Typography Headline (Hanken Grotesk + Editorial Newsreader Italic) */}
            <h1 className="text-display font-display font-bold text-ink leading-[1.05] tracking-tight">
              Cut AI model spend without dropping{' '}
              <span className="font-editorial italic font-semibold text-accent">
                domain accuracy.
              </span>
            </h1>

            <p className="lead text-muted text-base sm:text-lg leading-relaxed">
              Benchmark five candidate models against your real customer FAQs and policies in a blinded arena. Right-size your inference bill by up to{' '}
              <strong className="font-editorial font-bold text-signal text-xl num">94.2%</strong>{' '}
              with mathematical proof.
            </p>

            {/* Mini Provider Avatar Stack */}
            <div className="flex items-center gap-3 pt-0.5">
              <div className="flex -space-x-1.5">
                <ProviderLogo provider="anthropic" size="sm" />
                <ProviderLogo provider="openai" size="sm" />
                <ProviderLogo provider="google" size="sm" />
                <ProviderLogo provider="meta" size="sm" />
                <ProviderLogo provider="deepseek" size="sm" />
                <ProviderLogo provider="mistral" size="sm" />
                <ProviderLogo provider="alibaba" size="sm" />
                <ProviderLogo provider="azure" size="sm" />
                <ProviderLogo provider="aws" size="sm" />
                <ProviderLogo provider="groq" size="sm" />
              </div>
              <span className="text-xs text-muted font-medium">
                40+ frontier &amp; open-weights models benchmarked live
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/dashboard/evaluations/new" className="btn-ledger">
                <span>Start business evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#model-matrix" className="btn-ledger-ghost">
                Explore live matrix
              </a>
            </div>

            {/* Frosted Glass Telemetry Ribbon */}
            <dl className="grid grid-cols-3 gap-3 p-4 rounded-card glass-card text-xs sm:text-sm border border-rule/80">
              <div>
                <dt className="text-muted text-[10px] font-outlier uppercase tracking-wider font-semibold">
                  Gateway Privacy
                </dt>
                <dd className="font-semibold text-ink mt-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span>RAM Enclave</span>
                </dd>
              </div>
              <div className="border-l border-rule pl-3">
                <dt className="text-muted text-[10px] font-outlier uppercase tracking-wider font-semibold">
                  Parallel Arena
                </dt>
                <dd className="font-semibold text-ink mt-1 num flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  <span>5 Models Live</span>
                </dd>
              </div>
              <div className="border-l border-rule pl-3">
                <dt className="text-muted text-[10px] font-outlier uppercase tracking-wider font-semibold">
                  Verified ROI
                </dt>
                <dd className="font-editorial font-bold text-signal text-base mt-0.5 num flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>94.2% saved</span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Interactive Glassmorphic Arena Cockpit */}
          <div className="lg:col-span-7 relative z-10">
            <InteractiveRoiDemo />
          </div>
        </div>
      </section>

      {/* CLERK LASER DIVIDER 01 -> 02 */}
      <ClerkLaserDivider label="02 // PROVIDER ECOSYSTEM" sublabel="MULTI-GATEWAY DOCK" />

      {/* 02 // INTERACTIVE PROVIDER ECOSYSTEM DOCK */}
      <section aria-label="Interactive Provider Explorer">
        <InteractiveProviderDock />
      </section>

      {/* CLERK LASER DIVIDER 02 -> 03 */}
      <ClerkLaserDivider label="03 // SECURITY & ENCLAVE" sublabel="ZDR-v2.8-tmpfs" />

      {/* 03 // CLERK-GRADE ARCHITECTURAL SPECIMEN RACK */}
      <section id="specimens" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-1 rounded-full glass-well border border-rule">
                [03 // SPECIMEN RACK]
              </span>
              <span className="pill emerald text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Clerk-Style Double Bezel
              </span>
            </div>
            <h2 className="text-section font-display font-bold text-ink tracking-tight">
              Tactile security enclaves &amp;{' '}
              <span className="font-editorial italic font-semibold text-accent">
                live cost arbitrage.
              </span>
            </h2>
            <p className="lead text-muted text-base leading-relaxed">
              Interact directly with BenchCraft’s cryptographic memory purging, real-time volume slider, and deterministic rubric judges.
            </p>
          </div>
          <div className="text-xs text-muted font-outlier">
            Built with <strong className="text-accent">zdr: true</strong> protocol
          </div>
        </div>

        <ClerkSpecimenGrid />
      </section>

      {/* CLERK LASER DIVIDER 03 -> 04 */}
      <ClerkLaserDivider label="04 // EMPIRICAL ARCHITECTURE" sublabel="PARETO FRONTIER" />

      {/* 04 // INTERACTIVE ARCHITECTURE BENTO */}
      <section id="methodology" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-1 rounded-full glass-well border border-rule">
                [04 // ARCHITECTURE]
              </span>
              <span className="pill emerald text-xs">
                <Scale className="w-3.5 h-3.5" />
                Interactive Pipeline
              </span>
            </div>
            <h2 className="text-section font-display font-bold text-ink tracking-tight">
              Three steps from domain PDF to{' '}
              <span className="font-editorial italic font-semibold text-accent">
                calibrated unit economics.
              </span>
            </h2>
            <p className="lead text-muted text-base leading-relaxed">
              Public leaderboards rank abstract trivia. Interact with the workbench below to see how BenchCraft synthesizes adversarial scenarios and plots models on your 2D Pareto frontier.
            </p>
          </div>
          <Link href="/how-it-works" className="btn-ledger-ghost btn-sm whitespace-nowrap">
            Read ZDR whitepaper
          </Link>
        </div>

        {/* Interactive 3-Card Glassmorphic Bento with 2D Pareto Map framed in Clerk Double-Bezel */}
        <InteractiveArchitectureBento />
      </section>

      {/* CLERK LASER DIVIDER 04 -> 05 */}
      <ClerkLaserDivider label="05 // EMPIRICAL MATRIX" sublabel="AUDITED LEDGER" />

      {/* 05 // CASE STUDY & INTERACTIVE LEADERBOARD */}
      <section id="model-matrix" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-1 rounded-full glass-well border border-rule">
                [05 // EMPIRICAL MATRIX]
              </span>
              <span className="pill rec text-xs">
                <BarChart2 className="w-3.5 h-3.5" />
                Audited Ledger
              </span>
            </div>
            <h2 className="text-section font-display font-bold text-ink tracking-tight">
              Six candidate tiers tested{' '}
              <span className="font-editorial italic font-semibold text-signal">
                side by side.
              </span>
            </h2>
            <p className="lead text-muted text-base leading-relaxed">
              Full Nari Boutique arena matrix across 8 Khmer and English scenarios (50,000 monthly chats, quality threshold: 85/100). Filter or sort by ROI, latency, or domain fit.
            </p>
          </div>
          <Link href="/case-study" className="btn-ledger-ghost btn-sm whitespace-nowrap">
            Open full Nari audit
          </Link>
        </div>

        <ModelMatrixTable />
      </section>

      {/* CLERK LASER DIVIDER 05 -> 06 */}
      <ClerkLaserDivider label="06 // UNIT ECONOMICS" sublabel="50X PAYBACK" />

      {/* 06 // PRICING & EXECUTIVE ARTIFACTS */}
      <section id="pricing" className="space-y-8">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2.5 py-1 rounded-full glass-well border border-rule">
              [06 // UNIT ECONOMICS]
            </span>
            <span className="pill emerald text-xs">
              <Zap className="w-3.5 h-3.5" />
              50× Instant Payback
            </span>
          </div>
          <h2 className="text-section font-display font-bold text-ink tracking-tight">
            Predictable founder economics.
          </h2>
          <p className="lead text-muted text-base leading-relaxed">
            One right-sized evaluation returns 50× the monthly subscription in saved cloud inference. Zero token markups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pro Founder Glass Card with Clerk Double Bezel */}
          <div className="lg:col-span-6">
            <ClerkBentoChassis className="h-full">
              <div className="glass-card p-7 sm:p-9 flex flex-col justify-between space-y-6 relative overflow-hidden h-full">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-baseline justify-between border-b border-rule pb-5">
                    <div>
                      <span className="pill emerald text-[11px] mb-2">Most Popular</span>
                      <h3 className="text-title font-display font-bold text-ink">
                        Pro Founder Plan
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        For engineering teams and technical founders
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl sm:text-5xl font-editorial font-bold text-ink num">
                        $29
                      </span>
                      <span className="text-xs text-muted font-normal block">/ month flat</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-sm text-ink">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span>
                        <strong>20 full arena evaluations</strong> per month
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span>
                        <strong>5 candidate models</strong> executed in parallel per test
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span>
                        <strong>Temperature 0 rubric judge</strong> with line-by-line rationales
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span>
                        <strong>Exportable executive memos</strong> for board &amp; investor audits
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span>
                        <strong>Zero Data Retention</strong> cryptographic gateway enforcement
                      </span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/dashboard/evaluations/new"
                  className="btn-ledger w-full justify-center text-center mt-6 relative z-10"
                >
                  <span>Start evaluating models</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ClerkBentoChassis>
          </div>

          {/* Right Column: Executive Memo Artifact Preview & ZDR Guarantee */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <ClerkBentoChassis className="flex-1">
              <div className="glass-card glass-card-interactive p-6 sm:p-8 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-accent text-xs font-outlier font-semibold uppercase tracking-wider">
                      <FileText className="w-4 h-4" />
                      Board-Ready Audit Artifact
                    </span>
                    <span className="pill rec text-[11px]">PDF &amp; JSON Export</span>
                  </div>

                  <h3 className="text-title font-display font-bold text-ink">
                    Procurement-ready executive memos
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Every completed evaluation generates an audited executive memo with scenario transcripts, rubric pass rates, and direct deployment links for AWS Bedrock, Google Vertex AI, and OpenRouter.
                  </p>
                </div>

                {/* Cloud Procurement Provider Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rule">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-input glass-well text-xs font-semibold text-ink border border-rule">
                    <ProviderLogo provider="aws" size="sm" />
                    <span>AWS Bedrock</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-input glass-well text-xs font-semibold text-ink border border-rule">
                    <ProviderLogo provider="google" size="sm" />
                    <span>Vertex AI</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-input glass-well text-xs font-semibold text-ink border border-rule">
                    <ProviderLogo provider="azure" size="sm" />
                    <span>Azure OpenAI</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-input glass-well text-xs font-semibold text-ink border border-rule">
                    <ProviderLogo provider="groq" size="sm" />
                    <span>GroqCloud</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-input glass-well text-xs font-semibold text-ink border border-rule">
                    <ProviderLogo provider="openrouter" size="sm" />
                    <span>OpenRouter ZDR</span>
                  </div>
                </div>
              </div>
            </ClerkBentoChassis>

            <ClerkBentoChassis>
              <div className="glass-card p-6 sm:p-7 space-y-2.5">
                <div className="font-semibold text-sm text-ink flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Enforced Zero Data Retention (zdr: true)</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Uploaded policy files are parsed in volatile memory and discarded immediately after scenario synthesis. All arena requests enforce{' '}
                  <code className="font-outlier text-accent px-1.5 py-0.5 rounded glass-well border border-rule">
                    zdr: true
                  </code>{' '}
                  at the gateway.
                </p>
              </div>
            </ClerkBentoChassis>
          </div>
        </div>
      </section>

      {/* CLERK LASER DIVIDER 06 -> 07 */}
      <ClerkLaserDivider label="07 // GET STARTED" sublabel="3-MINUTE RUNTIME" />

      {/* 07 // CLOSING GLASS WORKBENCH BANNER */}
      <section className="relative">
        <ClerkBentoChassis>
          <div className="glass-card p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="pill emerald text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Ready in 3 minutes
              </span>
              <h2 className="text-section font-display font-bold text-ink tracking-tight">
                Calibrate your model stack before your{' '}
                <span className="font-editorial italic font-semibold text-signal">
                  next inference invoice.
                </span>
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                Upload your customer FAQs or system prompt, run 5 candidate models in parallel, and lock in your lowest-cost qualifying model.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link href="/dashboard/evaluations/new" className="btn-ledger">
                <span>Run your domain evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/case-study" className="btn-ledger-ghost">
                Read the Nari case study
              </Link>
            </div>
          </div>
        </ClerkBentoChassis>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';
import { ProviderLogo } from '@/components/brand/provider-logo';

export function Footer() {
  const providers = [
    { key: 'anthropic', name: 'Anthropic' },
    { key: 'openai', name: 'OpenAI' },
    { key: 'google', name: 'Google' },
    { key: 'meta', name: 'Meta' },
    { key: 'deepseek', name: 'DeepSeek' },
    { key: 'mistral', name: 'Mistral' },
    { key: 'alibaba', name: 'Alibaba' },
    { key: 'aws', name: 'AWS Bedrock' },
    { key: 'azure', name: 'Azure' },
    { key: 'groq', name: 'Groq' },
    { key: 'openrouter', name: 'OpenRouter' },
  ];

  const technologies = [
    { key: 'nextjs', name: 'Next.js' },
    { key: 'react', name: 'React 19' },
    { key: 'typescript', name: 'TypeScript' },
    { key: 'tailwind', name: 'Tailwind' },
    { key: 'postgres', name: 'Postgres' },
    { key: 'drizzle', name: 'Drizzle' },
    { key: 'clerk', name: 'Clerk' },
  ];

  return (
    <footer className="w-full border-t border-rule bg-paper-2 text-muted py-16 transition-colors">
      <div className="container space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-rule pb-12">
          <div className="space-y-4 max-w-2xl">
            <Link href="/" aria-label="BenchCraft home" className="inline-block hover:opacity-90 transition-opacity">
              <BrandLogo width={140} height={32} className="h-8 w-auto" />
            </Link>
            <p className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              Audit your workload against five candidate models before paying frontier inference rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/dashboard/evaluations/new" className="btn-ledger">
              Run free audit
            </Link>
            <Link href="/dashboard" className="btn-ledger-ghost">
              Open workspace
            </Link>
          </div>
        </div>

        {/* Model Providers and Tech Stack Trust Strips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-rule pb-10 text-xs">
          <div className="space-y-2.5">
            <span className="text-[11px] font-outlier font-semibold uppercase tracking-wider text-muted">
              Supported Foundation Labs &amp; Gateways
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {providers.map((p) => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-ink font-medium hover:border-ink transition-colors"
                >
                  <ProviderLogo provider={p.key} size="xs" />
                  <span>{p.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] font-outlier font-semibold uppercase tracking-wider text-muted">
              Built With High-Performance Open Web Architecture
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {technologies.map((t) => (
                <span
                  key={t.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input glass-well text-ink font-medium hover:border-ink transition-colors"
                >
                  <ProviderLogo provider={t.key} size="xs" />
                  <span>{t.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm">
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink">
            <Link href="/product" className="hover:text-accent transition-colors whitespace-nowrap">
              Evaluation arena
            </Link>
            <Link href="/how-it-works" className="hover:text-accent transition-colors whitespace-nowrap">
              Methodology &amp; ZDR
            </Link>
            <Link href="/case-study" className="hover:text-accent transition-colors whitespace-nowrap">
              Nari Boutique ($1,485/mo)
            </Link>
            <Link href="/pricing" className="hover:text-accent transition-colors whitespace-nowrap">
              Pro Founder ($29/mo)
            </Link>
            <Link href="/dashboard/models" className="hover:text-accent transition-colors whitespace-nowrap">
              Model catalog
            </Link>
            <Link href="/c/new" className="hover:text-accent transition-colors whitespace-nowrap">
              New evaluation
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5 text-accent font-medium">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              OpenRouter Zero Data Retention verified
            </span>
            <span>© 2026 BenchCraft Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

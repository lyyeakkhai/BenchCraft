'use client';

import { useState, useMemo } from 'react';
import { CURATED_CATALOG } from '@/lib/catalog';
import { ExternalLink, Search, Sparkles, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';
import { ProviderLogo } from '@/components/brand/provider-logo';

const PROVIDER_OPTIONS = [
  { id: 'all', label: 'All Providers' },
  { id: 'nvidia', label: 'NVIDIA AI' },
  { id: 'google', label: 'Google' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'meta', label: 'Meta' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'mistral', label: 'Mistral AI' },
  { id: 'alibaba', label: 'Alibaba Cloud' },
];

export default function ModelCatalogPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Provider model counts
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CURATED_CATALOG.length };
    PROVIDER_OPTIONS.forEach((p) => {
      if (p.id !== 'all') {
        counts[p.id] = CURATED_CATALOG.filter((m) =>
          m.provider.toLowerCase().includes(p.id.toLowerCase())
        ).length;
      }
    });
    return counts;
  }, []);

  const filteredModels = useMemo(() => {
    return CURATED_CATALOG.filter((m) => {
      const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
      const matchesProvider =
        selectedProvider === 'all' ||
        m.provider.toLowerCase().includes(selectedProvider.toLowerCase());
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTier && matchesProvider && matchesSearch;
    });
  }, [selectedTier, selectedProvider, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-outlier font-semibold text-muted uppercase tracking-wider px-2 py-0.5 rounded-full glass-well">
              [MODEL CATALOG &amp; REGISTRY]
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-ink">
            Curated model catalog
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Verified LLMs across Small, Medium, and Frontier tiers with official list pricing and direct procurement links.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] font-outlier text-muted uppercase tracking-wider font-semibold">
              Supported Foundation Labs:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'nvidia',
                'anthropic',
                'openai',
                'google',
                'meta',
                'deepseek',
                'mistral',
                'alibaba',
                'aws',
                'azure',
                'groq',
              ].map((p) => {
                const isActive = selectedProvider.toLowerCase().includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedProvider(selectedProvider === p ? 'all' : p)}
                    title={`Filter by ${p}`}
                    className={`inline-flex items-center p-1 rounded-sm border transition-all cursor-pointer ${
                      isActive
                        ? 'border-accent bg-paper-3 ring-1 ring-accent'
                        : 'border-transparent hover:border-rule hover:bg-paper-2'
                    }`}
                  >
                    <ProviderLogo provider={p} size="xs" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Link href="/dashboard/evaluations/new" className="btn-ledger btn-sm self-start sm:self-auto">
          Run evaluation
        </Link>
      </div>

      {/* Provider & Filter Controls */}
      <div className="space-y-3">
        {/* Provider Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 ledger-surface p-2.5">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 shrink-0">
            Provider:
          </span>
          {PROVIDER_OPTIONS.map((p) => {
            const isSelected = selectedProvider === p.id;
            const count = providerCounts[p.id] || 0;
            const isNvidia = p.id === 'nvidia';

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id)}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-input border font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isNvidia
                      ? 'bg-[#76B900] text-black border-[#76B900] shadow-sm'
                      : 'bg-ink border-ink text-paper-2'
                    : isNvidia
                    ? 'bg-paper border-rule text-ink hover:border-[#76B900]/60'
                    : 'bg-paper border-rule text-muted hover:border-ink hover:text-ink'
                }`}
              >
                {p.id !== 'all' && <ProviderLogo provider={p.id} size="xs" />}
                <span>{p.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-outlier ${
                    isSelected
                      ? isNvidia
                        ? 'bg-black/20 text-black'
                        : 'bg-paper-2/20 text-paper-2'
                      : 'bg-paper-3 text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier & Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 ledger-surface p-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All tiers' },
              { id: 'small', label: 'Small ($0.03 to $0.20/1M)' },
              { id: 'mid', label: 'Medium ($0.20 to $3.00/1M)' },
              { id: 'top', label: 'Frontier ($1.20 to $15.00/1M)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTier(t.id)}
                className={`text-xs px-3 py-1.5 rounded-input border font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTier === t.id
                    ? 'bg-ink border-ink text-paper-2'
                    : 'bg-paper border-rule text-muted hover:border-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search provider, model, or capability"
              placeholder="Search provider, model, or task…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-paper border border-rule rounded-input text-ink"
            />
          </div>
        </div>
      </div>

      {/* NVIDIA Provider Spotlight Banner (When NVIDIA is selected) */}
      {selectedProvider === 'nvidia' && (
        <div className="ledger-surface p-5 border-l-4 border-l-[#76B900] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ProviderLogo provider="nvidia" size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-display font-semibold text-ink">
                    NVIDIA AI Foundation &amp; NIM Microservices
                  </h3>
                  <span className="pill text-[10px] text-[#76B900] border-[#76B900]/30 bg-[#76B900]/10">
                    TensorRT-LLM Accelerated
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  State-of-the-art Nemotron architectures, ChatQA retrieval models, and NeMo Guardrails running on Hopper &amp; Blackwell infrastructure.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a
                href="https://build.nvidia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ink bg-paper hover:bg-paper-3 px-3 py-1.5 rounded-input border border-rule transition-colors whitespace-nowrap"
              >
                <span>NVIDIA API Catalog</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setSelectedProvider('all')}
                className="text-xs text-muted hover:text-ink px-2 py-1"
              >
                Show all providers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-2.5 bg-paper rounded-input border border-rule">
              <div className="text-muted flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Architecture</span>
              </div>
              <div className="font-semibold text-ink mt-1">Nemotron &amp; Minitron</div>
            </div>
            <div className="p-2.5 bg-paper rounded-input border border-rule">
              <div className="text-muted flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Available in BenchCraft</span>
              </div>
              <div className="font-semibold text-ink mt-1">{providerCounts.nvidia} verified models</div>
            </div>
            <div className="p-2.5 bg-paper rounded-input border border-rule">
              <div className="text-muted flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Specialties</span>
              </div>
              <div className="font-semibold text-ink mt-1">Document QA &amp; Guardrails</div>
            </div>
            <div className="p-2.5 bg-paper rounded-input border border-rule">
              <div className="text-muted">Inference Price Range</div>
              <div className="font-semibold text-ink mt-1">$0.05 – $1.80 / 1M tok</div>
            </div>
          </div>
        </div>
      )}

      {/* Models Grid */}
      {filteredModels.length === 0 ? (
        <div className="ledger-surface p-12 text-center space-y-3">
          <p className="text-ink font-semibold">No models found</p>
          <p className="text-sm text-muted">
            No models matched your current filter criteria ({selectedProvider !== 'all' ? `provider: ${selectedProvider}, ` : ''}
            {selectedTier !== 'all' ? `tier: ${selectedTier}, ` : ''}
            {searchQuery ? `query: "${searchQuery}"` : ''}).
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTier('all');
              setSelectedProvider('all');
              setSearchQuery('');
            }}
            className="btn-ledger btn-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => {
            const isNvidia = model.provider.toLowerCase().includes('nvidia');

            return (
              <div
                key={model.id}
                className={`ledger-surface p-5 flex flex-col justify-between space-y-4 hover:border-rule-2 transition-all ${
                  isNvidia ? 'hover:border-[#76B900]/40' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ProviderLogo provider={model.provider || model.name} size="md" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-muted font-outlier uppercase tracking-wider block">
                          {model.provider}
                        </span>
                        <h3 className="font-display font-semibold text-lg text-ink truncate leading-tight">
                          {model.name}
                        </h3>
                      </div>
                    </div>
                    <span className={`pill shrink-0 ${model.tier === 'mid' ? 'rec' : ''}`}>
                      {model.tier} tier
                    </span>
                  </div>

                  <div className="text-xs font-outlier text-muted truncate">{model.id}</div>

                  <div className="flex flex-wrap gap-1.5">
                    {model.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 bg-paper rounded-input border border-rule text-ink capitalize"
                      >
                        {cat.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 bg-paper border border-rule rounded-input space-y-1 text-xs">
                    <div className="font-semibold text-muted">
                      Official rate / 1M tokens
                    </div>
                    <div className="flex justify-between items-baseline pt-0.5 num">
                      <span className="text-muted">Input:</span>
                      <span className="font-display font-semibold text-sm text-ink">
                        ${model.inputPricePerMTok.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline num">
                      <span className="text-muted">Output:</span>
                      <span className="font-display font-semibold text-sm text-ink">
                        ${model.outputPricePerMTok.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted pt-1 num">
                    <span>Context: {(model.contextLength / 1000).toFixed(0)}k tokens</span>
                    <span>Modality: {model.modalities.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-rule space-y-2">
                  <div className="text-xs font-semibold text-muted flex items-center justify-between">
                    <span>Available on</span>
                    <span className="text-[10px] text-accent font-outlier">Direct list rate</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {model.whereToBuy.map((shop, i) => (
                      <a
                        key={i}
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-ink bg-paper hover:bg-paper-3 px-2 py-1 rounded-input border border-rule transition-colors whitespace-nowrap group"
                      >
                        <ProviderLogo provider={shop.name} size="xs" />
                        <span>{shop.name}</span>
                        <ExternalLink className="w-3 h-3 text-muted group-hover:text-ink transition-colors" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

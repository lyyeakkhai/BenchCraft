'use client';

import { useState } from 'react';
import { CURATED_CATALOG } from '@/lib/catalog';
import { Cpu, ExternalLink, Filter, Search, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ModelCatalogPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredModels = CURATED_CATALOG.filter((m) => {
    const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3DDD8] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
            Curated Model Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#4B605C] mt-0.5">
            Verified enterprise LLMs across Small, Medium, and Frontier tiers with official list pricing.
          </p>
        </div>

        <Link href="/c/new" className="btn-ledger text-xs sm:text-sm px-4 py-2">
          Run Evaluation
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#D3DDD8]">
        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Models' },
            { id: 'small', label: 'Small ($0.03–$0.20/1M)' },
            { id: 'mid', label: 'Medium ($0.50–$3.00/1M)' },
            { id: 'top', label: 'Frontier ($3.00–$15.00/1M)' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedTier === t.id
                  ? 'bg-[#0A2E2B] border-[#0A2E2B] text-white'
                  : 'bg-white border-[#D3DDD8] text-[#4B605C] hover:border-[#0A2E2B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#4B605C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search provider or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFCFB] border border-[#D3DDD8] rounded-lg text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B]"
          />
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          return (
            <div
              key={model.id}
              className="bg-white border border-[#D3DDD8] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#A9BDB7] transition shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#4B605C]">{model.provider}</span>
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                      model.tier === 'small'
                        ? 'bg-[#EDF2EF] text-[#1F5C55]'
                        : model.tier === 'mid'
                        ? 'bg-[#FBF3E2] text-[#8A5A0B]'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {model.tier} tier
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#0A2E2B]">{model.name}</h3>
                  <div className="text-[11px] font-mono text-[#4B605C] truncate">{model.id}</div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {model.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 bg-[#EDF2EF] rounded text-[#0A2E2B] capitalize"
                    >
                      {cat.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Pricing Box */}
                <div className="p-3 bg-[#FAFCFB] border border-[#D3DDD8] rounded-lg space-y-1 text-xs">
                  <div className="text-[10px] font-semibold text-[#4B605C] uppercase tracking-wider">
                    Official Rate / 1M Tokens
                  </div>
                  <div className="flex justify-between items-baseline pt-0.5">
                    <span className="text-[#4B605C]">Input:</span>
                    <span className="font-serif font-semibold text-sm text-[#0A2E2B]">
                      ${model.inputPricePerMTok.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#4B605C]">Output:</span>
                    <span className="font-serif font-semibold text-sm text-[#0A2E2B]">
                      ${model.outputPricePerMTok.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Context Window & Latency */}
                <div className="flex justify-between text-[11px] text-[#4B605C] pt-1">
                  <span>Context: {(model.contextLength / 1000).toFixed(0)}k tokens</span>
                  <span>Modality: {model.modalities.join(', ')}</span>
                </div>
              </div>

              {/* Deployment Links */}
              <div className="pt-3 border-t border-[#D3DDD8] space-y-1.5">
                <div className="text-[10px] font-semibold text-[#4B605C] uppercase tracking-wider">
                  Available On
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {model.whereToBuy.map((shop, i) => (
                    <a
                      key={i}
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#0A2E2B] bg-[#EDF2EF] hover:bg-[#D3DDD8] px-2 py-0.5 rounded transition"
                    >
                      {shop.name}
                      <ExternalLink className="w-2.5 h-2.5 text-[#4B605C]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

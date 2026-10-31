import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#D3DDD8] bg-white text-[#4B605C] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Section: Brand + Mission + Live Status */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-[#D3DDD8] pb-10">
          <div className="space-y-4 max-w-sm">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/benchcraft-lockup-light.svg"
                alt="BenchCraft"
                width={140}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
              Objective, domain-grounded LLM evaluation and financial right-sizing for technical founders.
              Eliminating inference waste before it hits production.
            </p>
          </div>

          {/* Operational Status Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDF2EF] border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
              <span className="w-2 h-2 rounded-full bg-[#1F5C55] animate-pulse" />
              <span>All Systems Operational</span>
              <span className="text-[#A9BDB7]">|</span>
              <span className="text-[#1F5C55]">ZDR Enforced</span>
            </div>

            <Link
              href="/c/new"
              className="btn-ledger text-xs py-2 px-4 shadow-xs"
            >
              Start Free Evaluation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Column 1: Product & Architecture */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#0A2E2B]">
              Platform & Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/product" className="hover:text-[#0A2E2B] transition-colors">
                  Evaluation Arena
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-[#0A2E2B] transition-colors">
                  Financial Right-Sizing Engine
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  LLM-as-a-Judge (Temp 0)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/models" className="hover:text-[#0A2E2B] transition-colors">
                  Curated Model Catalog
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Zero Data Retention (ZDR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions & Audits */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#0A2E2B]">
              Audited Case Studies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/case-study" className="hover:text-[#0A2E2B] transition-colors flex items-center gap-1">
                  Nari Boutique ($1,485/mo)
                  <span className="text-[10px] bg-[#FBF3E2] text-[#8A5A0B] px-1.5 py-0.2 rounded font-semibold">Top</span>
                </Link>
              </li>
              <li>
                <Link href="/case-study" className="hover:text-[#0A2E2B] transition-colors">
                  Customer Support Chatbots
                </Link>
              </li>
              <li>
                <Link href="/case-study" className="hover:text-[#0A2E2B] transition-colors">
                  Bilingual Khmer & English
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#0A2E2B] transition-colors">
                  Startup Unit Economics
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#0A2E2B] transition-colors">
                  ROI Savings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Methodology */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#0A2E2B]">
              Methodology & Standards
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Blinded Scenario Testing
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Objective Rubric Formulation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/models" className="hover:text-[#0A2E2B] transition-colors">
                  Verified List Pricing (1M Tok)
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Latency & Token Telemetry
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Multi-Turn Dialog Stress
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Trust */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#0A2E2B]">
              Company & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="hover:text-[#0A2E2B] transition-colors">
                  Pro Founder Plan ($29/mo)
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A2E2B] transition-colors">
                  Security & Privacy Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#0A2E2B] transition-colors">
                  Founder Dashboard
                </Link>
              </li>
              <li>
                <span className="text-[#A9BDB7] cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#A9BDB7] cursor-not-allowed">Privacy Policy (ZDR)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 border-t border-[#D3DDD8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#4B605C]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 BenchCraft Inc. All rights reserved.</span>
            <span className="text-[#A9BDB7]">•</span>
            <span className="flex items-center gap-1 text-[#1F5C55]">
              <ShieldCheck className="w-3.5 h-3.5" />
              OpenRouter ZDR Verified Gateway
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[#4B605C]">
            <span>NEWSREADER & HANKEN GROTESK</span>
            <span className="text-[#A9BDB7]">•</span>
            <span>PROUDLY CRAFTED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

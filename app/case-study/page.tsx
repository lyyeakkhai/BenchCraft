import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  FileText,
  Award,
} from 'lucide-react';

export default function CaseStudyPage() {
  return (
    <div className="space-y-16 py-6">
      {/* Header */}
      <section className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3DDD8] text-xs font-semibold text-[#0A2E2B]">
          <span className="w-2 h-2 rounded-full bg-[#1F5C55]" />
          Empirical Case Audit #001
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#0A2E2B] leading-[1.15] tracking-tight">
          Nari Boutique: Slashing Monthly AI Spend by 99%
        </h1>

        <p className="text-base sm:text-lg text-[#4B605C] leading-relaxed">
          How an online fashion retailer in Cambodia tested bilingual Khmer and English customer service across 4
          candidate models and safely saved $1,485 every month.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <Link href="/c/new" className="btn-ledger px-6 py-3 text-sm">
            Evaluate Your Business
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Snapshot Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white border border-[#D3DDD8] rounded-xl space-y-1">
          <div className="text-[11px] text-[#4B605C]">Business Vertical</div>
          <div className="font-semibold text-sm text-[#0A2E2B]">E-Commerce Fashion</div>
        </div>
        <div className="p-4 bg-white border border-[#D3DDD8] rounded-xl space-y-1">
          <div className="text-[11px] text-[#4B605C]">Monthly Inquiries</div>
          <div className="font-semibold text-sm text-[#0A2E2B]">50,000 chats / mo</div>
        </div>
        <div className="p-4 bg-white border border-[#D3DDD8] rounded-xl space-y-1">
          <div className="text-[11px] text-[#4B605C]">Languages</div>
          <div className="font-semibold text-sm text-[#0A2E2B]">Khmer & English</div>
        </div>
        <div className="p-4 bg-[#FBF3E2] border border-[#E7B44A] rounded-xl space-y-1">
          <div className="text-[11px] text-[#8A5A0B] font-semibold">Net Monthly Delta</div>
          <div className="font-serif font-bold text-base text-[#8A5A0B]">+$1,485 / mo saved</div>
        </div>
      </section>

      {/* The Problem Narrative */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-serif font-semibold text-[#0A2E2B]">
            The Founder's Dilemma
          </h2>
          <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
            Nari Boutique sells dresses, shoes, and apparel across Cambodia via Telegram channels and Facebook pages.
            As order volume scaled to 50,000 monthly inquiries, human support staff were overwhelmed answering the same
            repetitive questions regarding provincial shipping fees to Siem Reap, dress sizes, and return policies.
          </p>
          <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
            To automate support, the team initially defaulted to a <strong>frontier flagship model ($1,500/month)</strong>,
            believing that only the largest model on the LMSYS leaderboard could handle Khmer script and nuanced return
            conditions without hallucinating false order promises.
          </p>
        </div>

        {/* The BenchCraft Solution */}
        <div className="pt-6 border-t border-[#D3DDD8] space-y-4">
          <h3 className="text-lg font-serif font-semibold text-[#0A2E2B]">
            The BenchCraft Empirical Test
          </h3>
          <p className="text-xs sm:text-sm text-[#4B605C] leading-relaxed">
            Nari Boutique uploaded their 3-page <code className="text-[#0A2E2B]">Delivery-and-returns-policy.pdf</code> into
            BenchCraft and set a target quality bar of <strong>85 out of 100</strong>.
          </p>

          <div className="p-4 rounded-lg bg-[#EDF2EF] border border-[#D3DDD8] text-xs space-y-2">
            <div className="font-semibold text-[#0A2E2B]">8 Grounded Scenarios Formulated:</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4B605C]">
              <li>• Provincial delivery fees to Siem Reap & Battambang</li>
              <li>• Size exchange conditions for worn vs unworn items</li>
              <li>• Khmer language queries on ABA Pay & Wing QR codes</li>
              <li>• Handling out-of-stock items politely with alternatives</li>
              <li>• Safe handover to human agent when customer is angry</li>
              <li>• Calculation of multi-item promotional bundle discounts</li>
            </ul>
          </div>
        </div>

        {/* Comparison Ledger */}
        <div className="pt-6 border-t border-[#D3DDD8] space-y-4">
          <h3 className="text-lg font-serif font-semibold text-[#0A2E2B]">
            Blinded Parallel Arena Findings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            {/* Claude Haiku */}
            <div className="bg-[#FBF3E2] border-2 border-[#B87A14] rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#0A2E2B] text-sm">Claude Haiku 5.5</span>
                <span className="pill rec">Recommended</span>
              </div>
              <div className="font-serif text-3xl font-semibold text-[#8A5A0B]">$15.00 / mo</div>
              <div className="text-[#4B605C]">Domain Fit Score: <strong className="text-[#0A2E2B]">88 / 100</strong></div>
              <p className="text-[11px] text-[#0A2E2B]">
                Passed all return policy and delivery rubrics with 100% factual accuracy in Khmer and English.
              </p>
            </div>

            {/* Gemini Flash */}
            <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#0A2E2B] text-sm">Gemini 2.5 Flash</span>
                <span className="pill">Runner-up</span>
              </div>
              <div className="font-serif text-3xl font-semibold text-[#0A2E2B]">$112.50 / mo</div>
              <div className="text-[#4B605C]">Domain Fit Score: <strong className="text-[#0A2E2B]">90 / 100</strong></div>
              <p className="text-[11px] text-[#4B605C]">
                Slightly higher fit score (+2 points), but 7.5x the monthly cost of Haiku.
              </p>
            </div>

            {/* Claude Sonnet */}
            <div className="bg-white border border-[#D3DDD8] rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#0A2E2B] text-sm">Claude Sonnet 5.5</span>
                <span className="pill">Highest Quality</span>
              </div>
              <div className="font-serif text-3xl font-semibold text-[#0A2E2B]">$300.00 / mo</div>
              <div className="text-[#4B605C]">Domain Fit Score: <strong className="text-[#0A2E2B]">95 / 100</strong></div>
              <p className="text-[11px] text-[#4B605C]">
                20 times the cost of the first pick for only 7 more fit points. Over-provisioned for FAQ chat.
              </p>
            </div>
          </div>
        </div>

        {/* Outcome Box */}
        <div className="pt-6 border-t border-[#D3DDD8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-serif text-2xl font-semibold text-[#8A5A0B]">
              Total Annual Savings: $17,820.00
            </div>
            <p className="text-xs text-[#4B605C] mt-0.5">
              Zero drop in customer satisfaction, 420ms average response latency.
            </p>
          </div>
          <Link href="/c/new" className="btn-ledger px-5 py-2.5 text-xs whitespace-nowrap">
            Run Test on Your Documents
          </Link>
        </div>
      </section>
    </div>
  );
}

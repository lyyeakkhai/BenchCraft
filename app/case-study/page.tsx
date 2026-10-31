import Link from 'next/link';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function CaseStudyPage() {
  return (
    <div className="space-y-20 py-8">
      {/* Banner Hero */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-display font-display font-semibold text-ink">
          Nari Boutique cuts AI spend by 99%.
        </h1>

        <p className="lead text-muted">
          Fifty thousand bilingual support chats a month, audited against strict return rules.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <Link href="/c/new" className="btn-ledger">
            Evaluate your business
          </Link>
        </div>
      </section>

      {/* Snapshot Figures */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="p-5 ledger-surface space-y-1">
          <div className="text-xs text-muted">Business vertical</div>
          <div className="font-semibold text-md text-ink">E-commerce fashion</div>
        </div>
        <div className="p-5 ledger-surface space-y-1">
          <div className="text-xs text-muted">Monthly inquiries</div>
          <div className="font-semibold text-md text-ink num">50,000 chats / mo</div>
        </div>
        <div className="p-5 ledger-surface space-y-1">
          <div className="text-xs text-muted">Languages</div>
          <div className="font-semibold text-md text-ink">Khmer and English</div>
        </div>
        <div className="p-5 ledger-signal space-y-1">
          <div className="text-xs text-signal font-semibold">Net monthly delta</div>
          <div className="font-display font-bold text-lg text-signal num">+$1,485 / mo saved</div>
        </div>
      </section>

      {/* The Problem & Solution Narrative */}
      <section className="ledger-surface p-8 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-section font-display font-semibold text-ink">
            The founder’s dilemma.
          </h2>
          <p className="text-md text-muted leading-relaxed">
            Nari Boutique sells dresses, shoes, and apparel across Cambodia via Telegram channels and Facebook pages. As order volume scaled to 50,000 monthly inquiries, support staff were overwhelmed answering repetitive questions regarding provincial shipping fees to Siem Reap, dress sizes, and return policies.
          </p>
          <p className="text-md text-muted leading-relaxed">
            To automate support, the team initially defaulted to a <strong>frontier flagship model ($1,500/month)</strong>, assuming only the largest model on the LMSYS leaderboard could handle Khmer script and nuanced return conditions without hallucinating false order promises.
          </p>
        </div>

        <div className="pt-8 border-t border-rule space-y-4">
          <h3 className="text-title font-display font-semibold text-ink">
            The BenchCraft empirical test
          </h3>
          <p className="text-md text-muted leading-relaxed">
            Nari Boutique uploaded their 3-page <code className="font-outlier text-ink">Delivery-and-returns-policy.pdf</code> into BenchCraft and set a target quality bar of <strong>85 out of 100</strong>.
          </p>

          <div className="p-5 rounded-card bg-paper border border-rule text-sm space-y-3">
            <div className="font-semibold text-ink">8 grounded scenarios formulated:</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-muted list-disc pl-5">
              <li>Provincial delivery fees to Siem Reap and Battambang</li>
              <li>Size exchange conditions for worn vs unworn items</li>
              <li>Khmer language queries on ABA Pay and Wing QR codes</li>
              <li>Handling out-of-stock items politely with alternatives</li>
              <li>Safe handover to a human agent when a customer is angry</li>
              <li>Calculation of multi-item promotional bundle discounts</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-rule space-y-4">
          <h3 className="text-title font-display font-semibold text-ink">
            Blinded parallel arena findings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm pt-2">
            <div className="ledger-signal p-6 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider="anthropic" size="sm" />
                  <span className="font-semibold text-ink text-md">Claude Haiku 5.5</span>
                </div>
                <span className="pill rec">Recommended</span>
              </div>
              <div className="font-display text-3xl font-bold text-signal num">$15.00 / mo</div>
              <div className="text-muted">Domain fit score: <strong className="text-ink num">88 / 100</strong></div>
              <p className="text-sm text-ink leading-relaxed">
                Passed all 8 return policy and delivery rubrics with 100% factual accuracy in Khmer and English.
              </p>
            </div>

            <div className="p-6 rounded-card bg-paper border border-rule space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider="google" size="sm" />
                  <span className="font-semibold text-ink text-md">Gemini 2.5 Flash</span>
                </div>
                <span className="pill">Runner-up</span>
              </div>
              <div className="font-display text-3xl font-semibold text-ink num">$112.50 / mo</div>
              <div className="text-muted">Domain fit score: <strong className="text-ink num">90 / 100</strong></div>
              <p className="text-sm text-muted leading-relaxed">
                Slightly higher fit score (+2 points), at 7.5× the monthly cost of Haiku.
              </p>
            </div>

            <div className="p-6 rounded-card bg-paper border border-rule space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider="anthropic" size="sm" />
                  <span className="font-semibold text-ink text-md">Claude Sonnet 5.5</span>
                </div>
                <span className="pill">Mid-frontier</span>
              </div>
              <div className="font-display text-3xl font-semibold text-ink num">$300.00 / mo</div>
              <div className="text-muted">Domain fit score: <strong className="text-ink num">93 / 100</strong></div>
              <p className="text-sm text-muted leading-relaxed">
                20× the cost of the first pick for 5 extra fit points. Over-provisioned for FAQ chat.
              </p>
            </div>

            <div className="p-6 rounded-card bg-paper border border-rule space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider="anthropic" size="sm" />
                  <span className="font-semibold text-ink text-md">Claude Fable 5.1</span>
                </div>
                <span className="pill">Flagship default</span>
              </div>
              <div className="font-display text-3xl font-semibold text-ink num">$1,500.00 / mo</div>
              <div className="text-muted">Domain fit score: <strong className="text-ink num">95 / 100</strong></div>
              <p className="text-sm text-muted leading-relaxed">
                Uncalibrated frontier default ($1,500/mo). 100× the cost of Haiku for the same 8/8 scenario pass rate.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-display text-2xl font-bold text-signal num">
              Total annual savings: $17,820.00
            </div>
            <p className="text-sm text-muted mt-1 num">
              Zero drop in customer satisfaction, 420ms average response latency.
            </p>
          </div>
          <Link href="/c/new" className="btn-ledger">
            Run test on your documents
          </Link>
        </div>
      </section>
    </div>
  );
}

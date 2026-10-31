'use client';

import { useUser } from '@clerk/nextjs';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ProviderLogo } from '@/components/brand/provider-logo';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-rule pb-5">
        <h1 className="text-3xl font-display font-semibold text-ink">
          Workspace settings
        </h1>
        <p className="text-sm text-muted mt-0.5">
          Manage your subscription plan, API gateway connection, and Zero Data Retention policies.
        </p>
      </div>

      <section className="ledger-surface p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Pro Founder Plan
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Includes 20 evaluations per month with parallel 5-candidate arena testing.
            </p>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl font-bold text-ink num">$29</span>
            <span className="text-xs text-muted"> / mo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm pt-1">
          <div className="text-muted">
            Next billing renewal: <strong className="text-ink">December 1, 2026</strong>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert('Billing portal integration is active.')}
              className="btn-ledger-ghost btn-sm"
            >
              Manage billing
            </button>
            <button
              type="button"
              onClick={() => alert('Subscription cancelation requested.')}
              className="text-sm text-muted hover:text-error px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel subscription
            </button>
          </div>
        </div>
      </section>

      <section className="ledger-surface p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-input bg-paper border border-rule text-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Zero Data Retention (ZDR) enforcement
            </h2>
            <p className="text-sm text-muted">
              Hardware and network cryptographic rules applied to every business scenario evaluation.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 text-sm">
          <div className="p-3.5 rounded-input bg-paper border border-rule flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ProviderLogo provider="openrouter" size="sm" />
              <div>
                <div className="font-semibold text-ink">Upstream OpenRouter ZDR flag</div>
                <div className="text-xs text-muted">Enforces zero data retention on all provider inference</div>
              </div>
            </div>
            <span className="text-accent font-semibold flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Enforced (zdr: true)
            </span>
          </div>

          <div className="p-3.5 rounded-input bg-paper border border-rule flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-ink">Model training opt-out</div>
              <div className="text-xs text-muted">Explicit <code className="font-outlier">data_collection: “deny”</code> header passed on all calls</div>
            </div>
            <span className="text-accent font-semibold flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Active (data_collection: deny)
            </span>
          </div>

          <div className="p-3.5 rounded-input bg-paper border border-rule flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-ink">Ephemeral in-memory buffers</div>
              <div className="text-xs text-muted">Documents and scenario prompts are wiped from memory after evaluation</div>
            </div>
            <span className="text-accent font-semibold flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Ephemeral only
            </span>
          </div>
        </div>
      </section>

      <section className="ledger-surface p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-title font-display font-semibold text-ink">
              Team members and collaborators
            </h2>
            <p className="text-sm text-muted">
              Share evaluation ledgers and financial memos with your co-founders or engineering leads.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('Member invitation link copied to clipboard.')}
            className="btn-ledger btn-sm"
          >
            Invite member
          </button>
        </div>

        <div className="pt-2">
          <div className="p-3.5 rounded-input bg-paper border border-rule flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-pill bg-ink text-paper-2 flex items-center justify-center font-bold text-xs">
                {user?.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
              <div>
                <div className="font-semibold text-ink">
                  {user?.fullName || 'Current user'}
                </div>
                <div className="text-xs text-muted">
                  {user?.primaryEmailAddress?.emailAddress || 'founder@company.com'}
                </div>
              </div>
            </div>
            <span className="pill">
              Workspace owner
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

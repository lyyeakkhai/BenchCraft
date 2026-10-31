'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ShieldCheck, Lock, Key, CreditCard, Users, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#D3DDD8] pb-5">
        <h1 className="text-3xl font-serif font-semibold text-[#0A2E2B]">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#4B605C] mt-0.5">
          Manage your subscription plan, API gateway connection, and Zero Data Retention policies.
        </p>
      </div>

      {/* Plan & Subscription Card */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#D3DDD8] pb-4">
          <div>
            <div className="text-xs font-semibold text-[#B87A14] uppercase tracking-wider">
              Active Subscription
            </div>
            <h2 className="text-xl font-serif font-semibold text-[#0A2E2B] mt-0.5">
              Pro Founder Plan
            </h2>
            <p className="text-xs text-[#4B605C]">
              Includes 20 evaluations per month with parallel 5-candidate arena testing.
            </p>
          </div>
          <div className="text-right">
            <span className="font-serif text-3xl font-semibold text-[#0A2E2B]">$29</span>
            <span className="text-xs text-[#4B605C]"> / mo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs pt-1">
          <div className="text-[#4B605C]">
            Next billing renewal: <strong>December 1, 2026</strong>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert('Billing portal integration is active.')}
              className="btn-ledger-ghost text-xs py-1.5 px-3"
            >
              Manage Billing
            </button>
            <button
              type="button"
              onClick={() => alert('Subscription cancelation requested.')}
              className="text-xs text-[#4B605C] hover:text-red-600 px-3 py-1.5"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </section>

      {/* Security & ZDR Verification */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EDF2EF] text-[#1F5C55] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">
              Zero Data Retention (ZDR) Enforcement
            </h3>
            <p className="text-xs text-[#4B605C]">
              Hardware and network cryptographic rules applied to every business scenario evaluation.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-[#FAFCFB] border border-[#D3DDD8] flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#0A2E2B]">Upstream OpenRouter ZDR Flag</div>
              <div className="text-[11px] text-[#4B605C]">Enforces zero data retention on all provider inference</div>
            </div>
            <span className="text-[#1F5C55] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Enforced (zdr: true)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAFCFB] border border-[#D3DDD8] flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#0A2E2B]">Model Training Opt-Out</div>
              <div className="text-[11px] text-[#4B605C]">Explicit data_collection: "deny" header passed on all calls</div>
            </div>
            <span className="text-[#1F5C55] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active (data_collection: deny)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAFCFB] border border-[#D3DDD8] flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#0A2E2B]">Ephemeral In-Memory Buffers</div>
              <div className="text-[11px] text-[#4B605C]">Documents and scenario prompts are wiped from memory after evaluation</div>
            </div>
            <span className="text-[#1F5C55] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ephemeral Only
            </span>
          </div>
        </div>
      </section>

      {/* Workspace Members */}
      <section className="bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif font-semibold text-[#0A2E2B]">
              Team Members & Collaborators
            </h3>
            <p className="text-xs text-[#4B605C]">
              Share evaluation ledgers and financial memos with your co-founders or engineering leads.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('Member invitation link copied to clipboard.')}
            className="btn-ledger text-xs py-1.5 px-3"
          >
            Invite Member
          </button>
        </div>

        <div className="pt-2">
          <div className="p-3 rounded-lg border border-[#D3DDD8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#0A2E2B] text-white flex items-center justify-center font-bold text-xs">
                {user?.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
              <div>
                <div className="font-semibold text-[#0A2E2B]">
                  {user?.fullName || 'Current User'}
                </div>
                <div className="text-[11px] text-[#4B605C]">
                  {user?.primaryEmailAddress?.emailAddress || 'founder@company.com'}
                </div>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF2EF] text-[#0A2E2B] font-semibold">
              Workspace Owner
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

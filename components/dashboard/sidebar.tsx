'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Layers,
  TrendingDown,
  Cpu,
  Settings,
  Plus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface SidebarProps {
  totalUsed?: number;
  maxLimit?: number;
}

export function DashboardSidebar({ totalUsed = 1, maxLimit = 20 }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/evaluations',
      label: 'Evaluations',
      icon: Layers,
      exact: false,
    },
    {
      href: '/dashboard/spending',
      label: 'Spend Analytics',
      icon: TrendingDown,
      exact: false,
    },
    {
      href: '/dashboard/models',
      label: 'Model Catalog',
      icon: Cpu,
      exact: false,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#D3DDD8] flex flex-col justify-between h-screen py-5 px-4 flex-shrink-0 z-20">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2" title="Back to Homepage">
            <BrandLogo width={130} height={30} className="h-7 w-auto" priority />
          </Link>
          <ThemeToggle />
        </div>

        {/* Workspace Switcher / Badge */}
        <div className="p-3 bg-[#EDF2EF] rounded-xl border border-[#D3DDD8] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#4B605C]">
            <span className="uppercase tracking-wider">Workspace</span>
            <span className="flex items-center gap-1 text-[#1F5C55]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C55]" />
              ZDR Active
            </span>
          </div>
          <div className="text-xs font-semibold text-[#0A2E2B] truncate">
            {user?.firstName ? `${user.firstName}'s Production` : 'Founder Workspace'}
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <Link
            href="/dashboard/evaluations/new"
            className="btn-ledger w-full py-2.5 text-xs rounded-lg justify-center shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Evaluation
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#EDF2EF] text-[#0A2E2B]'
                    : 'text-[#4B605C] hover:bg-stone-50 hover:text-[#0A2E2B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A2E2B]' : 'text-[#4B605C]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#0A2E2B]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Account & Monthly Quota Meter */}
      <div className="space-y-4 pt-4 border-t border-[#D3DDD8]">
        {/* Usage Progress Meter */}
        <div className="p-3 rounded-xl bg-[#FAFCFB] border border-[#D3DDD8] space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-semibold text-[#0A2E2B]">Monthly Quota</span>
            <span className="text-[#4B605C] font-mono">
              {totalUsed} / {maxLimit}
            </span>
          </div>
          <div className="w-full bg-[#D3DDD8] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1F5C55] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalUsed / maxLimit) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#4B605C]">
            <span>Pro Founder Tier</span>
            <Link href="/pricing" className="text-[#B87A14] font-semibold hover:underline">
              Upgrade
            </Link>
          </div>
        </div>

        {/* User Pill */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 truncate pr-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
            <div className="truncate text-xs">
              <div className="font-semibold text-[#0A2E2B] truncate">
                {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Founder'}
              </div>
              <div className="text-[10px] text-[#4B605C] truncate">
                {user?.primaryEmailAddress?.emailAddress || 'Pro Plan'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

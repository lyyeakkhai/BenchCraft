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
  ChevronRight,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';

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
      code: '01',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/evaluations',
      label: 'Evaluations',
      code: '02',
      icon: Layers,
      exact: false,
    },
    {
      href: '/dashboard/spending',
      label: 'Spend Analytics',
      code: '03',
      icon: TrendingDown,
      exact: false,
    },
    {
      href: '/dashboard/models',
      label: 'Model Catalog',
      code: '04',
      icon: Cpu,
      exact: false,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      code: '05',
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 bg-paper-2/90 backdrop-blur-md border-r border-rule flex flex-col justify-between h-screen py-5 px-4 flex-shrink-0 z-20 relative">
      <div className="space-y-5 relative z-10">
        <div className="px-2 pt-1 flex items-center justify-between">
          <Link
            href="/"
            className="hover:opacity-90 transition-opacity flex items-center gap-2"
            title="Back to Homepage"
          >
            <BrandLogo width={130} height={30} className="h-7 w-auto" priority />
          </Link>
        </div>

        {/* Enclave Status Card */}
        <div className="p-3.5 glass-well rounded-card space-y-1.5 border border-rule">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-medium">RAM Enclave</span>
            <span className="text-accent font-semibold flex items-center gap-1.5" role="status">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              zdr: true
            </span>
          </div>
          <div className="text-sm font-semibold text-ink truncate">
            {user?.firstName ? `${user.firstName}’s Workspace` : 'Founder Workspace'}
          </div>
        </div>

        <div>
          <Link
            href="/dashboard/evaluations/new"
            className="btn-ledger btn-sm w-full justify-center"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Evaluation</span>
          </Link>
        </div>

        <nav aria-label="Dashboard" className="space-y-1">
          <div className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-input text-sm transition-all relative ${
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold border border-accent/25'
                    : 'text-muted hover:bg-paper-3/70 hover:text-ink font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted'}`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-rule relative z-10">
        {/* Quota Glass Card */}
        <div className="p-3.5 rounded-card glass-well space-y-2 border border-rule">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-ink flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-accent" />
              Monthly Quota
            </span>
            <span className="text-accent font-semibold tabular-nums">
              {totalUsed} / {maxLimit}
            </span>
          </div>
          <div className="w-full bg-rule rounded-pill h-1.5 overflow-hidden">
            <div
              className="bg-accent h-1.5 rounded-pill transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (totalUsed / maxLimit) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-muted">
            <span>Pro Founder Plan</span>
            <Link href="/pricing" className="text-accent font-semibold hover:underline">
              Upgrade
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5 truncate pr-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
            <div className="truncate text-sm">
              <div className="font-semibold text-ink truncate text-xs">
                {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Founder'}
              </div>
              <div className="text-xs text-muted truncate">
                {user?.primaryEmailAddress?.emailAddress || 'Pro Tier'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

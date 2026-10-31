'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { Menu, X, Plus, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardRoute = pathname.startsWith('/dashboard');

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/how-it-works', label: 'Methodology' },
    { href: '/case-study', label: 'Nari Audit' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <header className="w-full border-b border-rule bg-paper-2/75 backdrop-blur-2xl sticky top-0 z-50 transition-colors">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="BenchCraft home" className="hover:opacity-90 transition-opacity flex items-center gap-2.5">
            <BrandLogo width={140} height={32} className="h-7 w-auto" priority />
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-outlier font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              zdr: true
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 text-sm text-muted">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-input transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-ink font-semibold bg-paper-3/80 border border-rule'
                      : 'hover:text-ink hover:bg-paper-3/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button type="button" className="text-sm font-medium text-muted hover:text-ink px-3 py-2 transition-colors cursor-pointer whitespace-nowrap">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button type="button" className="btn-ledger btn-sm">
                  Start evaluation
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`text-sm px-3 py-1.5 rounded-input transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isDashboardRoute
                    ? 'bg-paper-3 text-ink font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/evaluations/new"
                className="btn-ledger btn-sm"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                New evaluation
              </Link>
              <div className="pl-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-7 h-7',
                    },
                  }}
                />
              </div>
            </div>
          </Show>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
          </Show>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:bg-paper-3 rounded-input transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-rule bg-paper-2/95 backdrop-blur-2xl px-4 py-4 space-y-3">
          <nav aria-label="Mobile" className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-md px-3 py-2 rounded-input transition-colors ${
                  pathname === link.href
                    ? 'bg-paper-3 text-ink font-semibold'
                    : 'text-muted hover:bg-paper'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-rule flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-ledger-ghost btn-sm w-full"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-ledger btn-sm w-full"
                >
                  Start evaluation
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ledger-ghost btn-sm w-full"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/evaluations/new"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ledger btn-sm w-full"
              >
                New evaluation
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}

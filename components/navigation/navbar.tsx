'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { Menu, X, ArrowRight, Plus, LayoutDashboard, Sparkles } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are deep inside the dashboard, the dashboard has its own topbar/sidebar, but navbar is global unless we are on dashboard routes
  const isDashboardRoute = pathname.startsWith('/dashboard');

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/case-study', label: 'Nari Case Study' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <header className="w-full border-b border-[#D3DDD8]/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
            <Image
              src="/benchcraft-lockup-light.svg"
              alt="BenchCraft"
              width={140}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-tight text-[#4B605C]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-[#0A2E2B] font-bold border-b-2 border-[#0A2E2B]'
                      : 'hover:text-[#0A2E2B]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Auth & Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="text-xs font-semibold text-[#4B605C] hover:text-[#0A2E2B] px-3 py-1.5 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="text-xs font-semibold bg-[#0A2E2B] text-white px-3.5 py-1.5 rounded-lg hover:bg-[#1F5C55] transition cursor-pointer shadow-xs">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isDashboardRoute
                    ? 'bg-[#EDF2EF] text-[#0A2E2B]'
                    : 'text-[#4B605C] hover:text-[#0A2E2B]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/c/new"
                className="btn-ledger text-xs py-1.5 px-3 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                New Evaluation
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

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
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
            className="p-1.5 text-[#0A2E2B] hover:bg-[#EDF2EF] rounded-lg transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#D3DDD8] bg-white/95 backdrop-blur-md px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition ${
                  pathname === link.href
                    ? 'bg-[#EDF2EF] text-[#0A2E2B]'
                    : 'text-[#4B605C] hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#D3DDD8] flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-[#0A2E2B] border border-[#D3DDD8] rounded-lg hover:bg-[#EDF2EF]"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-white bg-[#0A2E2B] rounded-lg hover:bg-[#1F5C55]"
                >
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-[#0A2E2B] bg-[#EDF2EF] rounded-lg"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/c/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-[#0A2E2B] rounded-lg"
              >
                + Start Evaluation
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}

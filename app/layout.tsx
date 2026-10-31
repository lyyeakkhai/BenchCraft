import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Logo } from '@/components/brand/logo';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'BenchCraft — Right-Sized AI Model Evaluation',
  description: 'Avoid overspending on AI models. Get tailored recommendations based on your business description and documents.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#111827]">
          <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition">
                <Logo />
              </Link>

              <div className="flex items-center gap-4">
                <Suspense fallback={<div className="h-8 w-20 bg-gray-100 animate-pulse rounded" />}>
                  <Show when="signed-out">
                    <div className="flex items-center gap-3">
                      <SignInButton mode="modal">
                        <button className="text-sm font-medium text-gray-700 hover:text-[#0C3838] px-3 py-1.5 transition cursor-pointer">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="text-sm font-medium bg-[#0C3838] text-white px-4 py-2 rounded-lg hover:bg-[#164E4E] transition shadow-sm cursor-pointer">
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  </Show>

                  <Show when="signed-in">
                    <div className="flex items-center gap-4">
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-600 hover:text-[#0C3838] transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/c/new"
                        className="text-sm font-medium bg-[#0C3838] text-white px-3.5 py-1.5 rounded-lg hover:bg-[#164E4E] transition shadow-sm"
                      >
                        + New Evaluation
                      </Link>
                      <UserButton />
                    </div>
                  </Show>
                </Suspense>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">{children}</main>

          <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Logo className="h-5 text-sm" />
                <span>— Right-sized AI Model Evaluation for Technical Founders</span>
              </div>
              <p>© 2026 BenchCraft. Powered by OpenRouter & Clerk.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

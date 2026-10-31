import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Newsreader, Hanken_Grotesk } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/navbar';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://benchcraft.dev'),
  title: 'BenchCraft — Right-Sized Model Evaluation',
  description: 'Objective, domain-grounded LLM selection and financial right-sizing for technical founders.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'BenchCraft — Right-Sized Model Evaluation',
    description: 'Objective, domain-grounded LLM selection and financial right-sizing for technical founders.',
    images: [
      {
        url: '/benchcraft-lockup-light.png',
        width: 1200,
        height: 630,
        alt: 'BenchCraft Logo',
      },
      {
        url: '/benchcraft-app-icon-1024.png',
        width: 1024,
        height: 1024,
        alt: 'BenchCraft App Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BenchCraft — Right-Sized Model Evaluation',
    description: 'Objective, domain-grounded LLM selection and financial right-sizing for technical founders.',
    images: ['/benchcraft-lockup-light.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${newsreader.variable} ${hanken.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-[#EDF2EF] text-[#0A2E2B] font-sans selection:bg-[#0A2E2B] selection:text-white">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>

          <footer className="border-t border-[#D3DDD8] bg-white py-6 text-xs text-[#4B605C]">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/benchcraft-lockup-light.svg"
                  alt="BenchCraft"
                  width={110}
                  height={24}
                  className="h-5 w-auto opacity-80"
                />
                <span className="text-[#A9BDB7]">|</span>
                <span>Empirical model selection for technical founders</span>
              </div>
              <div className="flex items-center gap-6 font-mono text-[11px] text-[#4B605C]">
                <span>ZERO DATA RETENTION</span>
                <span>EMPIRICAL ARENA</span>
                <span>© 2026 BENCHCRAFT</span>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

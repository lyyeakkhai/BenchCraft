import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Newsreader, Hanken_Grotesk } from 'next/font/google';
import { AppShellProvider } from '@/components/navigation/app-shell-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
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
  title: {
    default: 'BenchCraft — Empirical LLM Evaluation & AI Unit Economics Workbench',
    template: '%s | BenchCraft',
  },
  description:
    'Cut AI model spend without dropping domain accuracy. Benchmark candidate models against your real company policies in a blinded arena. Right-size inference costs by up to 94.2% with mathematical proof and Zero Data Retention.',
  keywords: [
    'LLM evaluation',
    'AI model right-sizing',
    'LLM unit economics',
    'blinded model arena',
    'AI inference cost optimization',
    'Zero Data Retention',
    'ZDR gateway',
    'LLM benchmark platform',
    'Claude Sonnet alternative',
    'Gemini Flash benchmark',
    'DeepSeek V3 procurement',
    'enterprise LLM governance',
  ],
  authors: [{ name: 'BenchCraft Engineering', url: 'https://benchcraft.dev' }],
  creator: 'BenchCraft',
  publisher: 'BenchCraft',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'BenchCraft',
    title: 'BenchCraft — Empirical LLM Evaluation & AI Unit Economics Workbench',
    description:
      'Cut AI model spend without dropping domain accuracy. Benchmark 5 candidate models in parallel against real policies in a blinded arena. Right-size inference by up to 94.2%.',
    images: [
      {
        url: '/benchcraft-lockup-dark.png',
        width: 1200,
        height: 630,
        alt: 'BenchCraft — Empirical LLM Evaluation & AI Unit Economics Workbench',
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
    title: 'BenchCraft — Empirical LLM Evaluation & AI Unit Economics Workbench',
    description:
      'Cut AI model spend without dropping domain accuracy. Benchmark candidate models in parallel with cryptographically enforced Zero Data Retention.',
    creator: '@benchcraft',
    site: '@benchcraft',
    images: ['/benchcraft-lockup-dark.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${newsreader.variable} ${hanken.variable} h-full antialiased`}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('benchcraft-theme');
                  const isDark = theme === 'dark' || ((!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              `,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-paper text-ink font-body transition-colors duration-200">
          <ThemeProvider>
            <AppShellProvider>{children}</AppShellProvider>
          </ThemeProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector('[data-slot="' + k + '"]'); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
                document.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

import { Footer, Header, JsonLd } from '@/components';
import { ThemeProvider } from '@/features/theme';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/features/posts';
import { Analytics, SpeedInsights } from '@/lib/vercel';
import type { Metadata, Viewport } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/config/shared-metadata';
import './globals.css';
import styles from './layout.module.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0d12' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  openGraph: {
    ...sharedOpenGraph,
    type: 'website',
    url: new URL(siteConfig.url),
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    ...sharedTwitter,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Next 16.3 stopped emitting metadata alternates.types in static export */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href="/feed.xml"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteConfig.name,
            url: siteConfig.url,
            jobTitle: siteConfig.author.role,
            sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header posts={posts} />
          <main id="main" className={styles.main}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}

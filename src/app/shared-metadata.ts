import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

// Ref: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging
export const sharedOpenGraph = {
  locale: 'en_US',
  siteName: siteConfig.name,
  images: [
    {
      url: '/social-cover.png',
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    },
  ],
} satisfies Metadata['openGraph'];

export const sharedTwitter = {
  card: 'summary_large_image',
  images: ['/social-cover.png'],
  creator: '@helderburato',
} satisfies Metadata['twitter'];

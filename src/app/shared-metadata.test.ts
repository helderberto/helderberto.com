import { describe, expect, it } from 'vitest';
import { sharedOpenGraph, sharedTwitter } from './shared-metadata';

describe('shared metadata', () => {
  it('uses the social cover for Open Graph and Twitter', () => {
    expect(sharedOpenGraph).toEqual({
      locale: 'en_US',
      siteName: 'Helder Burato Berto',
      images: [
        {
          url: '/social-cover.png',
          width: 1200,
          height: 630,
          alt: 'Helder Burato Berto',
        },
      ],
    });
    expect(sharedTwitter).toEqual({
      card: 'summary_large_image',
      images: ['/social-cover.png'],
      creator: '@helderburato',
    });
  });
});

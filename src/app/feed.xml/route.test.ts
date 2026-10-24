import * as posts from '@/features/posts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

describe('GET /feed.xml', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('serves an RSS document', async () => {
    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe(
      'application/rss+xml; charset=utf-8',
    );
    expect(await response.text()).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/,
    );
  });

  it('lists posts with escaped text and absolute links', async () => {
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([
      {
        slug: 'newest',
        title: `Tom & Jerry's <"tag">`,
        date: '2024-05-02',
        excerpt: 'a < b > c',
      },
      { slug: 'older', title: 'Older', date: '2023-01-01', excerpt: 'Old' },
    ]);

    const xml = await (await GET()).text();

    expect(xml).toContain(
      '<title>Tom &amp; Jerry&apos;s &lt;&quot;tag&quot;&gt;</title>',
    );
    expect(xml).toContain('<description>a &lt; b &gt; c</description>');
    expect(xml).toContain('<link>https://helderberto.com/posts/newest</link>');
    expect(xml).toContain(
      '<guid isPermaLink="true">https://helderberto.com/posts/older</guid>',
    );
    expect(xml).toContain('<pubDate>Thu, 02 May 2024 00:00:00 GMT</pubDate>');
    expect(xml).toContain(
      '<lastBuildDate>Thu, 02 May 2024 00:00:00 GMT</lastBuildDate>',
    );
    expect(xml.match(/<item>/g)).toHaveLength(2);
  });

  it('uses the current time as build date without posts', async () => {
    vi.useFakeTimers({ now: new Date('2025-01-15T10:00:00Z') });
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([]);

    const xml = await (await GET()).text();

    expect(xml).toContain(
      '<lastBuildDate>Wed, 15 Jan 2025 10:00:00 GMT</lastBuildDate>',
    );
    expect(xml).not.toContain('<item>');
  });
});

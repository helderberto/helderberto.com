import * as posts from '@/lib/posts';
import { describe, expect, it, vi } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists static pages then posts', async () => {
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([
      { slug: 'hello', title: 'Hello', date: '2024-05-02', excerpt: '' },
    ]);

    const entries = await sitemap();

    expect(
      entries.map(({ url, priority, changeFrequency }) => ({
        url,
        priority,
        changeFrequency,
      })),
    ).toEqual([
      { url: 'https://helderberto.com', priority: 1, changeFrequency: 'daily' },
      {
        url: 'https://helderberto.com/about',
        priority: 0.8,
        changeFrequency: 'monthly',
      },
      {
        url: 'https://helderberto.com/resume',
        priority: 0.6,
        changeFrequency: 'monthly',
      },
      {
        url: 'https://helderberto.com/posts/hello',
        priority: 0.7,
        changeFrequency: 'monthly',
      },
    ]);
    expect(entries[3].lastModified).toBe('2024-05-02');
  });

  it('includes every real post', async () => {
    const all = await posts.getAllPosts();

    const entries = await sitemap();

    expect(entries).toHaveLength(3 + all.length);
  });
});

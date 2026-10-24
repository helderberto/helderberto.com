import * as posts from '@/features/posts';
import { render, screen } from '@/lib/testing-library';
import { describe, expect, it, vi } from 'vitest';
import Home, { metadata } from './page';

describe('Home', () => {
  it('lists every post', async () => {
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([
      { slug: 'hello', title: 'Hello World', date: '2024-01-01', excerpt: '' },
    ]);
    render(await Home());

    expect(
      screen.getByRole('region', { name: 'Blog Posts' }),
    ).toHaveTextContent('Hello World');
  });

  it('sets the canonical url to the root', () => {
    expect(metadata.alternates?.canonical).toBe('/');
  });
});

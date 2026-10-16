import * as posts from '@/lib/posts';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home, { metadata } from './page';

describe('Home', () => {
  it('introduces the author', async () => {
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([]);
    render(await Home());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Helder Burato Berto' }),
    ).toBeInTheDocument();
  });

  it('links to social profiles in a new tab', async () => {
    vi.spyOn(posts, 'getAllPosts').mockResolvedValue([]);
    render(await Home());

    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/helderberto');
    expect(github).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/helderberto/',
    );
  });

  it('lists posts', async () => {
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

import * as posts from '@/lib/posts';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Image, {
  alt,
  contentType,
  generateStaticParams,
  size,
} from './opengraph-image';

const { ImageResponse } = vi.hoisted(() => ({
  ImageResponse: vi.fn<(element: ReactElement, options: unknown) => void>(),
}));

vi.mock('next/og', () => ({ ImageResponse }));

const renderImage = async (slug: string) => {
  await Image({ params: Promise.resolve({ slug }) });
  const [element, options] = ImageResponse.mock.calls[0];
  return { options, ...render(element) };
};

describe('post opengraph image', () => {
  it('exports PNG metadata at social card size', () => {
    expect(alt).toBe('Helder Burato Berto');
    expect(contentType).toBe('image/png');
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it('renders the post title, author and avatar', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue({
      slug: 'hello',
      title: 'Hello World',
      date: '2024-01-01',
      excerpt: '',
    });

    const { options } = await renderImage('hello');

    expect(posts.getPostBySlug).toHaveBeenCalledWith('hello');
    expect(options).toEqual({ width: 1200, height: 630 });
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Helder Burato Berto')).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      `data:image/jpeg;base64,${readFileSync('public/profile.jpg', 'base64')}`,
    );
  });

  it('generates params for every post', async () => {
    const all = await posts.getAllPosts();

    expect(await generateStaticParams()).toEqual(
      all.map((post) => ({ slug: post.slug })),
    );
  });
});

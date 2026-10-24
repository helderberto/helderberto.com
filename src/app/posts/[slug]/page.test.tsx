import * as posts from '@/features/posts';
import type { Post } from '@/types/post';
import { render, screen } from '@/lib/testing-library';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page, { generateMetadata, generateStaticParams } from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

vi.mock('@giscus/react', () => ({ default: () => null }));

const list: Post[] = [
  { slug: 'newest', title: 'Newest Post', date: '2024-03-01', excerpt: '' },
  { slug: 'middle', title: 'Middle Post', date: '2024-02-01', excerpt: '' },
  { slug: 'oldest', title: 'Oldest Post', date: '2024-01-01', excerpt: '' },
];

const post = (slug: string, content = 'Hello body'): Post => ({
  ...list.find((p) => p.slug === slug)!,
  excerpt: `${slug} excerpt`,
  content,
  readingTime: '1 min read',
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

beforeEach(() => {
  vi.spyOn(posts, 'getAllPosts').mockResolvedValue(list);
});

describe('post page', () => {
  it('renders the requested post', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue(post('middle'));
    render(await Page(params('middle')));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Middle Post' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Hello body')).toBeInTheDocument();
  });

  it('links to the older post as previous and the newer post as next', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue(post('middle'));
    render(await Page(params('middle')));

    expect(screen.getByRole('link', { name: /Previous post/ })).toHaveAttribute(
      'href',
      '/posts/oldest',
    );
    expect(screen.getByRole('link', { name: /Next post/ })).toHaveAttribute(
      'href',
      '/posts/newest',
    );
  });

  it('omits next on the newest post and previous on the oldest', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue(post('newest'));
    const { unmount } = render(await Page(params('newest')));
    expect(
      screen.queryByRole('link', { name: /Next post/ }),
    ).not.toBeInTheDocument();
    unmount();

    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue(post('oldest'));
    render(await Page(params('oldest')));
    expect(
      screen.queryByRole('link', { name: /Previous post/ }),
    ).not.toBeInTheDocument();
  });

  it('calls notFound when the post does not exist', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockRejectedValue(new Error('ENOENT'));

    await expect(Page(params('missing'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

describe('generateStaticParams', () => {
  it('returns one param per post', async () => {
    expect(await generateStaticParams()).toEqual([
      { slug: 'newest' },
      { slug: 'middle' },
      { slug: 'oldest' },
    ]);
  });
});

describe('generateMetadata', () => {
  it('describes the post as an article', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockResolvedValue(post('middle'));

    expect(await generateMetadata(params('middle'))).toMatchObject({
      title: 'Middle Post',
      description: 'middle excerpt',
      openGraph: {
        type: 'article',
        publishedTime: '2024-02-01',
        url: 'https://helderberto.com/posts/middle',
      },
      twitter: { title: 'Middle Post', creator: '@helderburato' },
      alternates: { canonical: 'https://helderberto.com/posts/middle' },
    });
  });

  it('returns not-found metadata for a missing post', async () => {
    vi.spyOn(posts, 'getPostBySlug').mockRejectedValue(new Error('ENOENT'));

    expect(await generateMetadata(params('missing'))).toEqual({
      title: 'Post Not Found',
      description: "The post you're looking for doesn't exist",
    });
  });
});

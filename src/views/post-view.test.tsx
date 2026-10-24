import { render, screen } from '@/lib/testing-library';
import type { Post } from '@/types/post';
import { describe, expect, it, vi } from 'vitest';
import { PostView } from './post-view';

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

vi.mock('@giscus/react', () => ({ default: () => null }));

const post: Post = {
  slug: 'middle',
  title: 'Middle Post',
  date: '2024-02-01',
  excerpt: '',
  content: 'Hello body',
  readingTime: '1 min read',
};

const headings = ['One', 'Two', 'Three', 'Four'].map((text) => ({
  id: text.toLowerCase(),
  text,
}));

function renderView(props: Partial<Parameters<typeof PostView>[0]> = {}) {
  return render(
    <PostView
      post={post}
      headings={[]}
      jsonLd={{ headline: post.title }}
      {...props}
    />,
  );
}

describe('PostView', () => {
  it('renders the post title and body', () => {
    renderView();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Middle Post' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Hello body')).toBeInTheDocument();
  });

  it('embeds the structured data', () => {
    const { container } = renderView();

    // JSON-LD lives in a script tag, which has no accessible role.
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(JSON.parse(script!.textContent!)).toEqual({
      headline: 'Middle Post',
    });
  });

  it('shows a table of contents for posts with enough sections', () => {
    renderView({ headings });

    expect(
      screen.getByRole('navigation', { name: 'Table of contents' }),
    ).toBeInTheDocument();
  });

  it('hides the table of contents for short posts', () => {
    renderView();

    expect(
      screen.queryByRole('navigation', { name: 'Table of contents' }),
    ).not.toBeInTheDocument();
  });

  it('has a comments section', () => {
    renderView();

    expect(
      screen.getByRole('region', { name: 'Comments' }),
    ).toBeInTheDocument();
  });
});

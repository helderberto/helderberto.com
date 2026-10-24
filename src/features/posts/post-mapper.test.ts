import { describe, expect, it } from 'vitest';
import { toPost, toPostSummary } from './post-mapper';

const frontmatter = {
  title: 'Hello',
  date: '2024-01-01',
  excerpt: 'Intro',
};

describe('toPostSummary', () => {
  it('keeps only the fields a post list needs', () => {
    expect(
      toPostSummary('hello', {
        ...frontmatter,
        tags: ['react'],
        lastModified: '2024-02-01',
      }),
    ).toEqual({
      slug: 'hello',
      title: 'Hello',
      date: '2024-01-01',
      excerpt: 'Intro',
    });
  });
});

describe('toPost', () => {
  it('adds the body, reading time and defaults', () => {
    expect(toPost('hello', { data: frontmatter, content: 'Body' })).toEqual({
      slug: 'hello',
      title: 'Hello',
      date: '2024-01-01',
      excerpt: 'Intro',
      content: 'Body',
      tags: [],
      readingTime: '1 min read',
      lastModified: '2024-01-01',
    });
  });

  it('keeps tags and lastModified from frontmatter', () => {
    const post = toPost('hello', {
      data: {
        ...frontmatter,
        tags: ['react', 'ts'],
        lastModified: '2024-02-01',
      },
      content: 'Body',
    });

    expect(post.tags).toEqual(['react', 'ts']);
    expect(post.lastModified).toBe('2024-02-01');
  });

  it.each([
    [200, '1 min read'],
    [201, '2 min read'],
    [450, '3 min read'],
  ])('reads %i words in %s', (words, readingTime) => {
    const content = 'word '.repeat(words).trim();

    expect(toPost('hello', { data: frontmatter, content }).readingTime).toBe(
      readingTime,
    );
  });
});

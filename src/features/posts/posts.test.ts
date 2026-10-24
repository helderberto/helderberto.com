import fs from 'fs';
import { describe, expect, it, vi } from 'vitest';
import { getAllPosts, getPostBySlug } from './posts';

const frontmatter = (fields: string, body = 'Body') =>
  `---\n${fields}\n---\n${body}`;

describe('getAllPosts', () => {
  it('lists every markdown post newest first', async () => {
    const posts = await getAllPosts();
    const files = fs.readdirSync('posts');

    expect(posts.map((post) => post.slug).toSorted()).toEqual(
      files.map((file) => file.replace(/\.md$/, '')).toSorted(),
    );
    expect(posts.map((post) => post.date)).toEqual(
      posts
        .map((post) => post.date)
        .toSorted()
        .toReversed(),
    );
  });

  it('maps frontmatter to summary fields', async () => {
    const posts = await getAllPosts();

    expect(posts.find((post) => post.slug === 'claude-code-hooks')).toEqual({
      slug: 'claude-code-hooks',
      title: 'Claude Code Hooks',
      date: '2026-03-19',
      excerpt:
        'How to use hooks to enforce your standards automatically and keep Claude Code in check',
    });
  });
});

describe('getPostBySlug', () => {
  it('returns a real post with content and defaults', async () => {
    const post = await getPostBySlug('claude-code-hooks');

    expect(post).toMatchObject({
      slug: 'claude-code-hooks',
      title: 'Claude Code Hooks',
      date: '2026-03-19',
      tags: [],
      lastModified: '2026-03-19',
    });
    expect(post.content).toContain('## What Are Hooks?');
    expect(post.readingTime).toMatch(/^\d+ min read$/);
  });

  it('keeps tags and lastModified from frontmatter', async () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(
      frontmatter(
        "title: T\ndate: '2024-01-01'\nlastModified: '2024-02-01'\ntags: [react, ts]",
      ),
    );

    const post = await getPostBySlug('any');

    expect(post.tags).toEqual(['react', 'ts']);
    expect(post.lastModified).toBe('2024-02-01');
  });

  it('estimates reading time at 200 words per minute', async () => {
    const spy = vi.spyOn(fs, 'readFileSync');
    spy.mockReturnValueOnce(frontmatter("date: '2024-01-01'", 'one'));
    spy.mockReturnValueOnce(
      frontmatter("date: '2024-01-01'", 'word '.repeat(450).trim()),
    );

    expect((await getPostBySlug('short')).readingTime).toBe('1 min read');
    expect((await getPostBySlug('long')).readingTime).toBe('3 min read');
  });

  it('rejects for an unknown slug', async () => {
    await expect(getPostBySlug('does-not-exist')).rejects.toThrow(/ENOENT/);
  });
});

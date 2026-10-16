import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PostCard from './PostCard';

const post = { slug: 'hello', title: 'Hello', date: '2024-01-01', excerpt: '' };

describe('PostCard', () => {
  it('links to the post', () => {
    render(<PostCard post={post} />);
    expect(screen.getByRole('link', { name: 'Hello' })).toHaveAttribute(
      'href',
      '/posts/hello',
    );
  });

  it('formats the date in UTC so midnight dates keep their day', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo');
    render(<PostCard post={post} />);
    expect(screen.getByText('Jan 01, 2024')).toHaveAttribute(
      'datetime',
      '2024-01-01',
    );
  });
});

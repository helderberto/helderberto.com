import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostHeader } from './post-header';

describe('PostHeader', () => {
  it('shows the title and the date in UTC', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo');
    render(<PostHeader title="Hello" date="2024-01-01" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Hello' }),
    ).toBeInTheDocument();
    expect(screen.getByText('January 1, 2024')).toHaveAttribute(
      'datetime',
      '2024-01-01',
    );
  });

  it('shows the reading time when given', () => {
    render(
      <PostHeader title="Hello" date="2024-01-01" readingTime="3 min read" />,
    );
    expect(screen.getByText('3 min read')).toBeInTheDocument();
  });

  it('omits the reading time when missing', () => {
    render(<PostHeader title="Hello" date="2024-01-01" />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });
});

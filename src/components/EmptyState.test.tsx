import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('shows the default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('shows a custom message', () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

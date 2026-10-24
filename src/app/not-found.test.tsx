import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import NotFound, { metadata } from './not-found';

describe('NotFound', () => {
  it('explains the page is missing', () => {
    render(<NotFound />);

    expect(
      screen.getByText('This page could not be found'),
    ).toBeInTheDocument();
  });

  it('links back home', () => {
    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('titles the page', () => {
    expect(metadata.title).toBe('Page Not Found');
  });
});

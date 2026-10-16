import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the current year in the copyright', () => {
    vi.useFakeTimers({ now: new Date('2031-06-01T00:00:00Z') });
    render(<Footer />);
    expect(screen.getByText('© 2031 Helder Burato Berto')).toBeInTheDocument();
  });

  it('links to site pages', () => {
    render(<Footer />);
    const nav = within(
      screen.getByRole('navigation', { name: 'Footer navigation' }),
    );
    expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(nav.getByRole('link', { name: 'Resume' })).toBeInTheDocument();
  });

  it('opens social profiles in a new tab', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/helderberto',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('link', { name: 'RSS feed' })).toHaveAttribute(
      'href',
      '/feed.xml',
    );
  });
});

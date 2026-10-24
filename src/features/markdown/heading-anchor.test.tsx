import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import { HeadingAnchor } from './heading-anchor';

describe('HeadingAnchor', () => {
  it('links the heading to its own id', () => {
    render(<HeadingAnchor id="setup">Setup</HeadingAnchor>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Setup' });
    expect(heading).toHaveAttribute('id', 'setup');
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute(
      'href',
      '#setup',
    );
  });

  it('renders a plain heading without an id', () => {
    render(<HeadingAnchor>Setup</HeadingAnchor>);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Setup' }),
    ).not.toHaveAttribute('id');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

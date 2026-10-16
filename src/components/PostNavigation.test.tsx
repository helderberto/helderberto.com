import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostNavigation } from './PostNavigation';

const previous = {
  slug: 'older',
  title: 'Older',
  date: '2024-01-01',
  excerpt: '',
};
const next = { slug: 'newer', title: 'Newer', date: '2024-02-01', excerpt: '' };

describe('PostNavigation', () => {
  it('links to previous and next posts', () => {
    render(<PostNavigation previous={previous} next={next} />);
    expect(
      screen.getByRole('link', { name: 'Previous post Older' }),
    ).toHaveAttribute('href', '/posts/older');
    expect(
      screen.getByRole('link', { name: 'Next post Newer' }),
    ).toHaveAttribute('href', '/posts/newer');
  });

  it('omits the previous link when there is none', () => {
    render(<PostNavigation next={next} />);
    expect(
      screen.queryByRole('link', { name: /Previous/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument();
  });

  it('omits the next link when there is none', () => {
    render(<PostNavigation previous={previous} />);
    expect(
      screen.queryByRole('link', { name: /Next/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Previous/ })).toBeInTheDocument();
  });
});

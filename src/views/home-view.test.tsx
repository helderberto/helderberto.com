import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import { HomeView } from './home-view';

describe('HomeView', () => {
  it('introduces the author', () => {
    render(<HomeView posts={[]} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Helder Burato Berto' }),
    ).toBeInTheDocument();
  });

  it('links to social profiles in a new tab', () => {
    render(<HomeView posts={[]} />);

    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/helderberto');
    expect(github).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/helderberto/',
    );
  });

  it('lists posts', () => {
    render(
      <HomeView
        posts={[
          {
            slug: 'hello',
            title: 'Hello World',
            date: '2024-01-01',
            excerpt: '',
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('region', { name: 'Blog Posts' }),
    ).toHaveTextContent('Hello World');
  });
});

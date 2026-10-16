import { render, screen, within } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('next-themes', () => ({ useTheme: vi.fn() }));

beforeAll(() => {
  // jsdom lacks scrollIntoView, which the command palette calls on mount.
  Element.prototype.scrollIntoView = () => {};
});

beforeEach(() => {
  vi.mocked(useTheme).mockReturnValue({
    theme: 'light',
    setTheme: vi.fn(),
    themes: [],
  });
});

function renderAt(pathname: string) {
  vi.mocked(usePathname).mockReturnValue(pathname);
  render(<Header posts={[]} />);
  return within(screen.getByRole('navigation', { name: 'Main navigation' }));
}

describe('Header', () => {
  it('links the logo home', () => {
    renderAt('/');
    expect(screen.getAllByRole('link', { name: 'Home' })[0]).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('marks Home as the current page on /', () => {
    const nav = renderAt('/');
    expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('marks About as the current page on /about', () => {
    const nav = renderAt('/about');
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('marks nothing current on a post page', () => {
    const nav = renderAt('/posts/hello');
    expect(
      nav
        .getAllByRole('link')
        .filter((link) => link.hasAttribute('aria-current')),
    ).toHaveLength(0);
  });

  it('offers the command palette and theme toggle', () => {
    renderAt('/');
    expect(
      screen.getByRole('button', { name: 'Open command palette' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Theme:/ })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';

function CurrentTheme() {
  const { theme } = useTheme();
  return <p>Theme is {theme}</p>;
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
  });

  it('provides the theme to its children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <CurrentTheme />
      </ThemeProvider>,
    );
    expect(screen.getByText('Theme is dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
  });
});

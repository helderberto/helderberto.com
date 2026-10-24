import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

vi.mock('next-themes', () => ({ useTheme: vi.fn() }));

function mockTheme(theme: string | undefined) {
  const setTheme = vi.fn();
  vi.mocked(useTheme).mockReturnValue({ theme, setTheme, themes: [] });
  return setTheme;
}

describe('ThemeToggle', () => {
  it.each([
    ['light', 'dark'],
    ['dark', 'system'],
    ['system', 'light'],
  ])('switches from %s to %s', async (current, next) => {
    const user = userEvent.setup();
    const setTheme = mockTheme(current);
    render(<ThemeToggle />);
    await user.click(
      screen.getByRole('button', {
        name: `Theme: ${current}. Switch to ${next} theme`,
      }),
    );
    expect(setTheme).toHaveBeenCalledWith(next);
  });

  it('treats an unknown theme as system', () => {
    mockTheme(undefined);
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', {
        name: 'Theme: system. Switch to light theme',
      }),
    ).toBeInTheDocument();
  });

  it('renders the system theme on the server to avoid hydration mismatch', () => {
    mockTheme('dark');
    expect(renderToString(<ThemeToggle />)).toContain(
      'Theme: system. Switch to light theme',
    );
  });
});

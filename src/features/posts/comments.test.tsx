import { Giscus } from '@/lib/giscus';
import { render } from '@/lib/testing-library';
import { useTheme } from '@/lib/next-themes';
import { describe, expect, it, vi } from 'vitest';
import { Comments } from './comments';

vi.mock('@giscus/react', () => ({ default: vi.fn(() => null) }));
vi.mock('next-themes', () => ({ useTheme: vi.fn() }));

function renderWithTheme(resolvedTheme: string | undefined) {
  vi.mocked(useTheme).mockReturnValue({
    resolvedTheme,
    setTheme: vi.fn(),
    themes: [],
  });
  render(<Comments />);
  return vi.mocked(Giscus).mock.lastCall?.[0];
}

describe('Comments', () => {
  it('loads giscus for this repository by pathname', () => {
    expect(renderWithTheme('light')).toMatchObject({
      repo: 'helderberto/helderberto.com',
      repoId: 'R_kgDONIpxLw',
      mapping: 'pathname',
      loading: 'lazy',
    });
  });

  it('uses the dark giscus theme in dark mode', () => {
    expect(renderWithTheme('dark')).toMatchObject({ theme: 'dark' });
  });

  it.each(['light', undefined])(
    'falls back to the light theme for %s',
    (resolvedTheme) => {
      expect(renderWithTheme(resolvedTheme)).toMatchObject({ theme: 'light' });
    },
  );
});

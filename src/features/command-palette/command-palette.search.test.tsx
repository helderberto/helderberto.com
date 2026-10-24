import { screen } from '@/lib/testing-library';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openPalette, selectedOption } from './command-palette.test-utils';

const push = vi.hoisted(() => vi.fn());
const setTheme = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme, themes: [] }),
}));

beforeEach(() => {
  push.mockReset();
  setTheme.mockReset();
});

describe('CommandPalette search and selection', () => {
  describe('searching', () => {
    it('shows an empty message when nothing matches', async () => {
      const { user, input } = await openPalette();
      await user.type(input, 'zzz');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(screen.getByText('No results for "zzz"')).toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-activedescendant');
      await user.keyboard('{ArrowDown}{Enter}');
      expect(push).not.toHaveBeenCalled();
    });

    it('resets the active option when the query changes', async () => {
      const { user, input } = await openPalette();
      await user.keyboard('{ArrowDown}');
      await user.type(input, 'o');
      expect(selectedOption()).toHaveTextContent('Home');
    });
  });

  describe('keyboard navigation', () => {
    it('moves down and wraps to the first option', async () => {
      const { user, input } = await openPalette();
      await user.keyboard('{ArrowDown}');
      expect(selectedOption()).toHaveTextContent('About');
      expect(input).toHaveAttribute('aria-activedescendant', 'nav-about');
      await user.keyboard('{ArrowDown>13/}');
      expect(selectedOption()).toHaveTextContent('Home');
    });

    it('moves up and wraps to the last option', async () => {
      const { user } = await openPalette();
      await user.keyboard('{ArrowUp}');
      expect(selectedOption()).toHaveTextContent('RSS feed');
    });

    it('scrolls the active option into view', async () => {
      const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
      const { user } = await openPalette();
      await user.keyboard('{ArrowDown}');
      expect(scrollIntoView.mock.contexts.at(-1)).toHaveTextContent('About');
    });

    it('runs the active option on Enter and closes', async () => {
      const { user, dialog } = await openPalette();
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(push).toHaveBeenCalledWith('/posts/post-1');
      expect(dialog).not.toHaveAttribute('open');
    });

    it('activates the option under the mouse', async () => {
      const { user } = await openPalette();
      await user.hover(screen.getByRole('option', { name: 'GitHub' }));
      expect(selectedOption()).toHaveTextContent('GitHub');
    });
  });

  describe('selecting', () => {
    it('runs the clicked option and closes', async () => {
      const { user, dialog } = await openPalette();
      await user.click(screen.getByRole('option', { name: 'Post 3' }));
      expect(push).toHaveBeenCalledWith('/posts/post-3');
      expect(dialog).not.toHaveAttribute('open');
    });

    it('applies a theme from the list', async () => {
      const { user } = await openPalette();
      await user.click(screen.getByRole('option', { name: 'Theme: Dark' }));
      expect(setTheme).toHaveBeenCalledWith('dark');
    });
  });
});

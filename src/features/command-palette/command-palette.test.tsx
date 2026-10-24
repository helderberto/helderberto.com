import { act, screen, type UserEvent } from '@/lib/testing-library';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './command-palette';
import {
  openPalette,
  optionLabels,
  posts,
  renderPalette,
  selectedOption,
} from './command-palette.test-utils';

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

describe('CommandPalette', () => {
  describe('rendering', () => {
    it('shows the Ctrl shortcut off Apple platforms', () => {
      vi.stubGlobal('navigator', { platform: 'Win32' });
      renderPalette();
      expect(screen.getByText('Ctrl K')).toBeInTheDocument();
    });

    it('shows the ⌘ shortcut on Apple platforms', () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel' });
      renderPalette();
      expect(screen.getByText('⌘ K')).toBeInTheDocument();
    });

    it('renders ⌘ on the server before the platform is known', () => {
      vi.stubGlobal('navigator', { platform: 'Win32' });
      const server = document.createElement('div');
      server.innerHTML = renderToString(<CommandPalette posts={posts} />);
      expect(server).toHaveTextContent('⌘ K');
    });

    it('starts closed', () => {
      const { dialog } = renderPalette();
      expect(dialog).not.toHaveAttribute('open');
    });

    it('shows group headings and the five latest posts', async () => {
      await openPalette();
      expect(
        screen.getAllByRole('presentation').map((group) => group.textContent),
      ).toEqual(['Navigation', 'Posts', 'Actions', 'Connect']);
      expect(optionLabels()).toHaveLength(14);
    });
  });

  describe('opening and closing', () => {
    it('opens from the trigger button on the first option', async () => {
      const { dialog } = await openPalette();
      expect(dialog).toHaveAttribute('open');
      expect(selectedOption()).toHaveTextContent('Home');
    });

    it.each(['{Meta>}k{/Meta}', '{Control>}K{/Control}'])(
      'toggles with %s',
      async (shortcut) => {
        const { user, dialog } = renderPalette();
        await user.keyboard(shortcut);
        expect(dialog).toHaveAttribute('open');
        await user.keyboard(shortcut);
        expect(dialog).not.toHaveAttribute('open');
      },
    );

    it('ignores k without a modifier', async () => {
      const { user, dialog } = renderPalette();
      await user.keyboard('k');
      expect(dialog).not.toHaveAttribute('open');
    });

    it('reopens after the browser closes it on Escape', async () => {
      const { user, dialog } = await openPalette();
      act(() => dialog.close());
      await user.keyboard('{Meta>}k{/Meta}');
      expect(dialog).toHaveAttribute('open');
    });

    it('closes on a backdrop click but not on a content click', async () => {
      const { user, dialog, input } = await openPalette();
      await user.click(input);
      expect(dialog).toHaveAttribute('open');
      await user.click(dialog);
      expect(dialog).not.toHaveAttribute('open');
    });

    it.each([
      [
        'the shortcut',
        (user: UserEvent) => user.keyboard('{Control>}k{/Control}'),
      ],
      [
        'the trigger button',
        (user: UserEvent) =>
          user.click(
            screen.getByRole('button', { name: 'Open command palette' }),
          ),
      ],
    ])(
      'resets search and selection when reopened via %s',
      async (_, reopen) => {
        const { user, input, dialog } = await openPalette();
        await user.type(input, 'o');
        await user.keyboard('{ArrowDown}');
        act(() => dialog.close());
        await reopen(user);
        expect(input).toHaveValue('');
        expect(optionLabels()).toHaveLength(14);
        expect(selectedOption()).toHaveTextContent('Home');
      },
    );
  });
});

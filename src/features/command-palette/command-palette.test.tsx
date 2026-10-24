import { act, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { useTheme } from 'next-themes';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './command-palette';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('next-themes', () => ({ useTheme: vi.fn() }));

const posts = Array.from({ length: 6 }, (_, index) => ({
  slug: `post-${index + 1}`,
  title: `Post ${index + 1}`,
  date: '2024-01-01',
  excerpt: '',
}));

const setTheme = vi.fn();

beforeEach(() => {
  push.mockReset();
  setTheme.mockReset();
  vi.mocked(useTheme).mockReturnValue({ setTheme, themes: [] });
});

function renderPalette() {
  const user = userEvent.setup();
  render(<CommandPalette posts={posts} />);
  return {
    user,
    dialog: screen.getByRole<HTMLDialogElement>('dialog', { hidden: true }),
    input: screen.getByRole('combobox', {
      name: 'Search commands and posts',
      hidden: true,
    }),
  };
}

async function openPalette() {
  const view = renderPalette();
  await view.user.click(
    screen.getByRole('button', { name: 'Open command palette' }),
  );
  await view.user.click(view.input);
  return view;
}

function optionLabels() {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

function selectedOption() {
  return screen.getByRole('option', { selected: true });
}

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

    it('lists navigation, five latest posts, actions and links', async () => {
      await openPalette();
      expect(optionLabels()).toEqual([
        'Home',
        'About',
        'Post 1',
        'Post 2',
        'Post 3',
        'Post 4',
        'Post 5',
        'Theme: Light',
        'Theme: Dark',
        'Theme: System',
        'Copy page URL',
        'GitHub',
        'LinkedIn',
        'RSS feed',
      ]);
      expect(
        screen.getAllByRole('presentation').map((group) => group.textContent),
      ).toEqual(['Navigation', 'Posts', 'Actions', 'Connect']);
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

  describe('filtering', () => {
    it('matches labels case-insensitively across all posts', async () => {
      const { user, input } = await openPalette();
      await user.type(input, '  POST 6 ');
      expect(optionLabels()).toEqual(['Post 6']);
    });

    it('shows every matching post, not just the first five', async () => {
      const { user, input } = await openPalette();
      await user.type(input, 'post');
      expect(optionLabels()).toHaveLength(6);
    });

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

  describe('actions', () => {
    it.each([
      ['Home', '/'],
      ['About', '/about'],
      ['Post 3', '/posts/post-3'],
    ])('navigates to %s', async (label, path) => {
      const { user, dialog } = await openPalette();
      await user.click(screen.getByRole('option', { name: label }));
      expect(push).toHaveBeenCalledWith(path);
      expect(dialog).not.toHaveAttribute('open');
    });

    it.each([
      ['Theme: Light', 'light'],
      ['Theme: Dark', 'dark'],
      ['Theme: System', 'system'],
    ])('applies %s', async (label, theme) => {
      const { user } = await openPalette();
      await user.click(screen.getByRole('option', { name: label }));
      expect(setTheme).toHaveBeenCalledWith(theme);
    });

    it('copies the page URL', async () => {
      const { user } = await openPalette();
      const writeText = vi.fn(() => Promise.resolve());
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      await user.click(screen.getByRole('option', { name: 'Copy page URL' }));
      expect(writeText).toHaveBeenCalledWith(window.location.href);
    });

    it('handles a denied clipboard', async () => {
      const { user, dialog } = await openPalette();
      let handled = false;
      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: () => {
            const denied = Promise.reject(new Error('denied'));
            vi.spyOn(denied, 'catch').mockImplementation((onRejected) => {
              handled = true;
              return Promise.prototype.catch.call(denied, onRejected);
            });
            return denied;
          },
        },
      });
      await user.click(screen.getByRole('option', { name: 'Copy page URL' }));
      expect(handled).toBe(true);
      expect(dialog.open).toBe(false);
    });

    it.each([
      ['GitHub', 'https://github.com/helderberto'],
      ['LinkedIn', 'https://www.linkedin.com/in/helderberto/'],
      ['RSS feed', '/feed.xml'],
    ])('opens %s in a new tab', async (label, url) => {
      const open = vi.fn(() => null);
      vi.stubGlobal('open', open);
      const { user } = await openPalette();
      await user.click(screen.getByRole('option', { name: label }));
      expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener');
    });
  });
});

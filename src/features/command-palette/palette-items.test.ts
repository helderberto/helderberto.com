import { describe, expect, it, vi } from 'vitest';
import { getPaletteItems } from './palette-items';

const posts = Array.from({ length: 6 }, (_, index) => ({
  slug: `post-${index + 1}`,
  title: `Post ${index + 1}`,
  date: '2024-01-01',
  excerpt: '',
}));

function items(query = '') {
  const navigate = vi.fn();
  const setTheme = vi.fn();
  const list = getPaletteItems({ posts, query, navigate, setTheme });
  const run = (label: string) =>
    list.find((item) => item.label === label)!.run();
  return {
    list,
    labels: list.map((item) => item.label),
    run,
    navigate,
    setTheme,
  };
}

describe('getPaletteItems', () => {
  describe('listing', () => {
    it('lists navigation, five latest posts, actions and links', () => {
      expect(items().labels).toEqual([
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
    });

    it('groups items in order', () => {
      const groups = [...new Set(items().list.map((item) => item.group))];
      expect(groups).toEqual(['Navigation', 'Posts', 'Actions', 'Connect']);
    });
  });

  describe('filtering', () => {
    it('matches labels case-insensitively across all posts', () => {
      expect(items('  POST 6 ').labels).toEqual(['Post 6']);
    });

    it('returns every matching post, not just the first five', () => {
      expect(items('post').labels).toHaveLength(6);
    });

    it('returns nothing when no label matches', () => {
      expect(items('zzz').labels).toEqual([]);
    });
  });

  describe('running', () => {
    it.each([
      ['Home', '/'],
      ['About', '/about'],
      ['Post 3', '/posts/post-3'],
    ])('navigates to %s', (label, path) => {
      const { run, navigate } = items();
      run(label);
      expect(navigate).toHaveBeenCalledWith(path);
    });

    it.each([
      ['Theme: Light', 'light'],
      ['Theme: Dark', 'dark'],
      ['Theme: System', 'system'],
    ])('applies %s', (label, theme) => {
      const { run, setTheme } = items();
      run(label);
      expect(setTheme).toHaveBeenCalledWith(theme);
    });

    it('copies the page URL', () => {
      const writeText = vi.fn(() => Promise.resolve());
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      items().run('Copy page URL');
      expect(writeText).toHaveBeenCalledWith(window.location.href);
    });

    it('handles a denied clipboard', () => {
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
      items().run('Copy page URL');
      expect(handled).toBe(true);
    });

    it.each([
      ['GitHub', 'https://github.com/helderberto'],
      ['LinkedIn', 'https://www.linkedin.com/in/helderberto/'],
      ['RSS feed', '/feed.xml'],
    ])('opens %s in a new tab', (label, url) => {
      const open = vi.fn(() => null);
      vi.stubGlobal('open', open);
      items().run(label);
      expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener');
    });
  });
});

import { FileText, Home } from '@/lib/lucide-react';
import { render, screen, userEvent } from '@/lib/testing-library';
import { describe, expect, it, vi } from 'vitest';
import type { PaletteItem } from './palette-items';
import { PaletteList } from './palette-list';

const items: PaletteItem[] = [
  { id: 'home', group: 'Navigation', label: 'Home', icon: Home, run: vi.fn() },
  { id: 'a', group: 'Posts', label: 'Post A', icon: FileText, run: vi.fn() },
  { id: 'b', group: 'Posts', label: 'Post B', icon: FileText, run: vi.fn() },
];

function renderList(activeIndex = 0) {
  const onSelect = vi.fn();
  const onActivate = vi.fn();
  render(
    <PaletteList
      items={items}
      activeIndex={activeIndex}
      onSelect={onSelect}
      onActivate={onActivate}
    />,
  );
  return { onSelect, onActivate };
}

describe('PaletteList', () => {
  describe('rendering', () => {
    it('labels each group once, before its first item', () => {
      renderList();

      expect(
        screen.getAllByRole('presentation').map((group) => group.textContent),
      ).toEqual(['Navigation', 'Posts']);
      expect(
        screen.getAllByRole('option').map((option) => option.textContent),
      ).toEqual(['Home', 'Post A', 'Post B']);
    });

    it('marks the active item as selected', () => {
      renderList(2);

      expect(screen.getByRole('option', { selected: true })).toHaveTextContent(
        'Post B',
      );
    });
  });

  describe('user interactions', () => {
    it('selects the clicked item', async () => {
      const user = userEvent.setup();
      const { onSelect } = renderList();

      await user.click(screen.getByRole('option', { name: 'Post A' }));

      expect(onSelect).toHaveBeenCalledWith(items[1]);
    });

    it('activates the item under the mouse', async () => {
      const user = userEvent.setup();
      const { onActivate } = renderList();

      await user.hover(screen.getByRole('option', { name: 'Post B' }));

      expect(onActivate).toHaveBeenCalledWith(2);
    });
  });
});

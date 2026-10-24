import { render, screen, userEvent } from '@/lib/testing-library';
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { Mermaid } from './mermaid';

const titled = 'flowchart LR\n  accTitle: A to B flow\n  A --> B';

function rendered(width: number) {
  return `<svg id="mermaid-abc" role="img" aria-label="A to B" viewBox="0 0 ${width} 80"><text>A</text></svg>`;
}

function stubDiagram(svg: string) {
  vi.spyOn(fs, 'readFileSync').mockReturnValue(svg);
}

describe('Mermaid', () => {
  describe('rendering', () => {
    it('inlines the pre-rendered diagram', () => {
      stubDiagram(rendered(300));
      render(<Mermaid chart={titled} />);
      expect(screen.getByRole('img', { name: 'A to B' })).toBeInTheDocument();
      expect(screen.queryByRole('code')).not.toBeInTheDocument();
    });

    it('captions the diagram with its accTitle', () => {
      stubDiagram(rendered(300));
      render(<Mermaid chart={titled} />);
      expect(
        screen.getByRole('figure', { name: 'A to B flow' }),
      ).toBeInTheDocument();
    });

    it('leaves the caption out when the chart has no accTitle', () => {
      stubDiagram(rendered(300));
      render(<Mermaid chart={'flowchart LR\n  A --> B'} />);
      expect(screen.getByRole('figure')).not.toHaveAccessibleName();
    });

    it('sizes the diagram from its natural width', () => {
      stubDiagram(rendered(320));
      render(<Mermaid chart={titled} />);
      expect(
        screen
          .getByRole('img')
          .parentElement?.style.getPropertyValue('--diagram-width'),
      ).toBe('20rem');
    });
  });

  describe('user interactions', () => {
    it('lets keyboard users focus a diagram too wide for a phone', async () => {
      stubDiagram(rendered(520));
      const user = userEvent.setup();
      render(<Mermaid chart={titled} />);
      await user.tab();
      expect(
        screen.getByRole('region', { name: 'A to B flow (scrollable)' }),
      ).toHaveFocus();
    });

    it('keeps a diagram that fits a phone out of the tab order', async () => {
      stubDiagram(rendered(380));
      const user = userEvent.setup();
      render(<Mermaid chart={titled} />);
      await user.tab();
      expect(document.body).toHaveFocus();
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('names an untitled scrollable diagram generically', () => {
      stubDiagram(rendered(520));
      render(<Mermaid chart={'flowchart LR\n  A --> B'} />);
      expect(
        screen.getByRole('region', { name: 'Diagram (scrollable)' }),
      ).toBeInTheDocument();
    });

    it('falls back to the column width when the svg has no viewBox', () => {
      stubDiagram('<svg role="img" aria-label="A to B"></svg>');
      render(<Mermaid chart={titled} />);
      expect(
        screen
          .getByRole('img')
          .parentElement?.style.getPropertyValue('--diagram-width'),
      ).toBe('');
    });

    it('fails the build when the chart was never rendered', () => {
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('ENOENT');
      });
      expect(() => render(<Mermaid chart={titled} />)).toThrow(
        'npm run diagrams',
      );
    });
  });
});

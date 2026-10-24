import { render, screen } from '@testing-library/react';
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownContent } from './MarkdownContent';

describe('MarkdownContent', () => {
  it('renders fenced code as a single labeled code block', () => {
    const { container } = render(
      <MarkdownContent content={'```js\nconst a = 1;\n```'} />,
    );
    expect(container.querySelectorAll('pre')).toHaveLength(1);
    expect(screen.getByText('js')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Copy code' }),
    ).toBeInTheDocument();
  });

  it('renders mermaid fences as diagrams', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(
      '<svg role="img" aria-label="A to B"></svg>',
    );
    render(
      <MarkdownContent content={'```mermaid\nflowchart LR\n  A --> B\n```'} />,
    );
    expect(screen.getByRole('img', { name: 'A to B' })).toBeInTheDocument();
    expect(screen.queryByRole('code')).not.toBeInTheDocument();
  });

  it('renders inline code without a copy button', () => {
    render(<MarkdownContent content="Run `npm test` now." />);
    expect(screen.getByRole('code')).toHaveTextContent('npm test');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('turns h2 headings into self-links', () => {
    render(<MarkdownContent content="## Getting Started" />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Getting Started' }),
    ).toHaveAttribute('id', 'getting-started');
    expect(
      screen.getByRole('link', { name: 'Getting Started' }),
    ).toHaveAttribute('href', '#getting-started');
  });
});

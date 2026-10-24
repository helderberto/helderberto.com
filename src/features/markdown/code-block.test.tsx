import { act, render, screen, userEvent } from '@/lib/testing-library';
import { Prism } from '@/lib/prismjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './code-block';

function renderBlock() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const writeText = vi.fn<(text: string) => Promise<void>>();
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  render(<CodeBlock className="lang-js">const a = 1;</CodeBlock>);
  return {
    user,
    writeText,
    copyButton: screen.getByRole('button', { name: 'Copy code' }),
    status: screen.getByRole('status'),
  };
}

describe('CodeBlock', () => {
  describe('rendering', () => {
    it('renders single-line code without a class inline', () => {
      const highlight = vi.spyOn(Prism, 'highlightElement');
      render(<CodeBlock>npm test</CodeBlock>);
      expect(screen.getByRole('code')).toHaveTextContent('npm test');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(highlight).not.toHaveBeenCalled();
    });

    it('renders multi-line code without a class as a plaintext block', () => {
      render(<CodeBlock>{'line one\nline two'}</CodeBlock>);
      expect(screen.getByRole('code')).toHaveClass('language-plaintext');
      expect(
        screen.getByRole('button', { name: 'Copy code' }),
      ).toBeInTheDocument();
    });

    it('labels and highlights lang- blocks', () => {
      const highlight = vi.spyOn(Prism, 'highlightElement');
      render(<CodeBlock className="lang-ts">const a = 1;</CodeBlock>);
      const code = screen.getByRole('code');
      expect(code).toHaveClass('language-ts');
      expect(screen.getByText('ts')).toBeInTheDocument();
      expect(highlight).toHaveBeenCalledWith(code);
    });

    it('keeps language- blocks unlabeled', () => {
      render(<CodeBlock className="language-css">a {}</CodeBlock>);
      expect(screen.getByRole('code')).toHaveClass('language-css');
      expect(screen.queryByText('css')).not.toBeInTheDocument();
    });
  });

  describe('copying', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('copies the code and announces it', async () => {
      const { user, writeText, copyButton, status } = renderBlock();
      await user.click(copyButton);
      expect(writeText).toHaveBeenCalledWith('const a = 1;');
      expect(status).toHaveTextContent('Copied');
    });

    it('clears the announcement after two seconds', async () => {
      const { user, copyButton, status } = renderBlock();
      await user.click(copyButton);
      act(() => vi.advanceTimersByTime(1500));
      expect(status).toHaveTextContent('Copied');
      act(() => vi.advanceTimersByTime(500));
      expect(status).toBeEmptyDOMElement();
    });

    it('restarts the timer on repeated copies', async () => {
      const { user, copyButton, status } = renderBlock();
      await user.click(copyButton);
      act(() => vi.advanceTimersByTime(1500));
      await user.click(copyButton);
      act(() => vi.advanceTimersByTime(1500));
      expect(status).toHaveTextContent('Copied');
      act(() => vi.advanceTimersByTime(600));
      expect(status).toBeEmptyDOMElement();
    });

    it('announces nothing when the clipboard rejects', async () => {
      const { user, writeText, copyButton, status } = renderBlock();
      writeText.mockRejectedValue(new Error('denied'));
      await user.click(copyButton);
      expect(status).toBeEmptyDOMElement();
    });

    it('clears a previous announcement when a later copy fails', async () => {
      const { user, writeText, copyButton, status } = renderBlock();
      await user.click(copyButton);
      writeText.mockRejectedValue(new Error('denied'));
      await user.click(copyButton);
      expect(status).toBeEmptyDOMElement();
    });
  });
});

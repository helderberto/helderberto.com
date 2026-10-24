import { render } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import { ReadingProgress } from './reading-progress';

describe('ReadingProgress', () => {
  it('renders a decorative bar hidden from assistive tech', () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

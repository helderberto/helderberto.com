import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReadingProgress } from './ReadingProgress';

describe('ReadingProgress', () => {
  it('renders a decorative bar hidden from assistive tech', () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

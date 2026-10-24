import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import Resume from './page';

describe('Resume', () => {
  it('renders the resume', () => {
    render(<Resume />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Helder Burato Berto' }),
    ).toBeInTheDocument();
  });
});

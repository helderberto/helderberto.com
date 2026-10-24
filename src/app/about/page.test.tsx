import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import AboutPage, { metadata } from './page';

describe('AboutPage', () => {
  it('renders the about content from markdown', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'About Me' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'About Me' })).toHaveTextContent(
      'Senior Software Engineer',
    );
  });

  it('sets the canonical url', () => {
    expect(metadata.alternates?.canonical).toBe('/about');
  });
});

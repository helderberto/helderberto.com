import { render, screen } from '@testing-library/react';
import fs from 'fs';
import { describe, expect, it, vi } from 'vitest';
import AboutPage from './page';

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

  it('shows the author photo', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('img', { name: /Helder Burato Berto smiling/ }),
    ).toBeInTheDocument();
  });

  it('promotes the leading heading to the page title once', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(
      '---\nlayout: about\n---\n\n# Hi there\n\nBody text',
    );
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Hi there' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('renders the body without a title when there is no leading heading', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('Just some text');
    render(<AboutPage />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Just some text')).toBeInTheDocument();
  });
});

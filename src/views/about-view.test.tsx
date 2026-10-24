import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import { AboutView } from './about-view';

describe('AboutView', () => {
  it('renders the title and the markdown body', () => {
    render(<AboutView title="Hi there" body="Body **text**" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Hi there' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'About Me' })).toHaveTextContent(
      'Body text',
    );
  });

  it('renders no heading without a title', () => {
    render(<AboutView body="Just some text" />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Just some text')).toBeInTheDocument();
  });

  it('shows the author photo', () => {
    render(<AboutView body="" />);

    expect(
      screen.getByRole('img', { name: /Helder Burato Berto smiling/ }),
    ).toBeInTheDocument();
  });

  it('loads the photo as a high-priority WebP', () => {
    render(<AboutView body="" />);

    const photo = screen.getByRole('img', { name: /Helder Burato Berto/ });
    expect(photo.getAttribute('src')).toContain('about-photo.webp');
    expect(photo).toHaveAttribute('fetchpriority', 'high');
    expect(photo).toHaveAttribute('loading', 'eager');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableOfContents } from './table-of-contents';

const headings = [
  { id: 'one', text: 'One' },
  { id: 'two', text: 'Two' },
  { id: 'three', text: 'Three' },
  { id: 'four', text: 'Four' },
];

describe('TableOfContents', () => {
  it('links to each heading from four headings up', () => {
    render(<TableOfContents headings={headings} />);
    expect(
      screen.getByRole('navigation', { name: 'Table of contents' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual(['#one', '#two', '#three', '#four']);
  });

  it('renders nothing below four headings', () => {
    const { container } = render(
      <TableOfContents headings={headings.slice(0, 3)} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

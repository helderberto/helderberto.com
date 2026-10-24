import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageTransition } from './page-transition';

describe('PageTransition', () => {
  it('renders its children', () => {
    render(
      <PageTransition>
        <p>Page body</p>
      </PageTransition>,
    );
    expect(screen.getByText('Page body')).toBeInTheDocument();
  });
});

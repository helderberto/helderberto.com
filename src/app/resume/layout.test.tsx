import { render, screen } from '@/lib/testing-library';
import { describe, expect, it } from 'vitest';
import ResumeLayout, { metadata } from './layout';

const personJsonLd = () =>
  JSON.parse(
    document.querySelector('script[type="application/ld+json"]')?.textContent ??
      '',
  );

describe('ResumeLayout', () => {
  it('renders children', () => {
    render(
      <ResumeLayout>
        <p>Resume body</p>
      </ResumeLayout>,
    );

    expect(screen.getByText('Resume body')).toBeInTheDocument();
  });

  it('emits Person structured data from the resume', () => {
    render(<ResumeLayout>{null}</ResumeLayout>);

    expect(personJsonLd()).toMatchObject({
      '@type': 'Person',
      name: 'Helder Burato Berto',
      email: 'mailto:hello@helderberto.com',
      knowsAbout: expect.arrayContaining(['React', 'TypeScript']),
      knowsLanguage: ['Portuguese', 'English'],
    });
  });

  it('sets the canonical url', () => {
    expect(metadata.alternates?.canonical).toBe(
      'https://helderberto.com/resume',
    );
  });
});

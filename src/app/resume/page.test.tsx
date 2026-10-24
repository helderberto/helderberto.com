import * as resumeData from '@/features/resume';
import { render, screen } from '@/lib/testing-library';
import { describe, expect, it, vi } from 'vitest';
import Resume from './page';

const FARFETCH_TECH =
  'TypeScript · React · Redux · Next.js · GraphQL · Node.js · Emotion · Docker · Jenkins';

describe('Resume', () => {
  it('shows the name', () => {
    render(<Resume />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Helder Burato Berto' }),
    ).toBeInTheDocument();
  });

  it('links to email and profiles', () => {
    render(<Resume />);

    expect(
      screen.getByRole('link', { name: 'hello@helderberto.com' }),
    ).toHaveAttribute('href', 'mailto:hello@helderberto.com');
    expect(
      screen.getByRole('link', { name: 'helderberto.com' }),
    ).toHaveAttribute('href', 'https://helderberto.com');
  });

  it('lists each position of a multi-level job', () => {
    render(<Resume />);

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Senior Software Engineer (SDE IV), Frontend',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Senior Software Engineer (SDE III), Frontend',
      }),
    ).toBeInTheDocument();
  });

  it('shows role and company for single-position jobs', () => {
    render(<Resume />);

    expect(
      screen.getByText('FARFETCH · Portugal (Remote) · Jan. 2021 - Jul. 2022'),
    ).toBeInTheDocument();
  });

  it('shows the tech used at a job', () => {
    render(<Resume />);

    expect(screen.getByText(FARFETCH_TECH)).toBeInTheDocument();
  });

  it('hides the tech line for jobs without tech', () => {
    const farfetch = resumeData.detailedExperience.find(
      (job) => job.company === 'FARFETCH',
    )!;
    vi.spyOn(resumeData, 'detailedExperience', 'get').mockReturnValue([
      { ...farfetch, tech: [] },
    ]);
    render(<Resume />);

    expect(
      screen.getByText('FARFETCH · Portugal (Remote) · Jan. 2021 - Jul. 2022'),
    ).toBeInTheDocument();
    expect(screen.queryByText(FARFETCH_TECH)).not.toBeInTheDocument();
  });

  it('summarises earlier experience without job headings', () => {
    render(<Resume />);

    expect(screen.getByText('Founder & CTO')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Founder & CTO' }),
    ).not.toBeInTheDocument();
  });

  it('lists languages with proficiency', () => {
    render(<Resume />);

    expect(
      screen.getByText('Portuguese (Native) · English (Fluent, Professional)'),
    ).toBeInTheDocument();
  });

  it('includes a print button', () => {
    render(<Resume />);

    expect(
      screen.getByRole('button', { name: 'Print / Save as PDF' }),
    ).toBeInTheDocument();
  });
});

import * as posts from '@/lib/posts';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata, viewport } from './layout';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <span>Vercel Analytics</span>,
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <span>Vercel Speed Insights</span>,
}));

const renderLayout = async () =>
  render(await RootLayout({ children: <p>Page body</p> }), {
    container: document,
  });

const jsonLd = () =>
  Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
    (script) => JSON.parse(script.textContent ?? ''),
  );

beforeEach(() => {
  vi.spyOn(posts, 'getAllPosts').mockResolvedValue([]);
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
});

describe('RootLayout', () => {
  it('renders children inside the main landmark', async () => {
    await renderLayout();

    expect(screen.getByRole('main')).toHaveTextContent('Page body');
  });

  it('sets the document language', async () => {
    await renderLayout();

    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('offers a skip link to the main content', async () => {
    await renderLayout();

    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main');
  });

  it('advertises the RSS feed', async () => {
    await renderLayout();

    expect(
      document.querySelector(
        'link[rel="alternate"][type="application/rss+xml"]',
      ),
    ).toHaveAttribute('href', '/feed.xml');
  });

  it('emits Person and WebSite structured data', async () => {
    await renderLayout();

    expect(jsonLd()).toEqual([
      expect.objectContaining({
        '@type': 'Person',
        name: 'Helder Burato Berto',
      }),
      expect.objectContaining({
        '@type': 'WebSite',
        url: 'https://helderberto.com',
      }),
    ]);
  });

  it('renders header and footer around the page', async () => {
    await renderLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('skips Vercel analytics outside Vercel', async () => {
    vi.stubEnv('VERCEL', '');
    await renderLayout();

    expect(screen.queryByText('Vercel Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('Vercel Speed Insights')).not.toBeInTheDocument();
  });

  it('loads Vercel analytics on Vercel', async () => {
    vi.stubEnv('VERCEL', '1');
    await renderLayout();

    expect(screen.getByText('Vercel Analytics')).toBeInTheDocument();
    expect(screen.getByText('Vercel Speed Insights')).toBeInTheDocument();
  });
});

describe('metadata', () => {
  it('templates page titles with the site name', () => {
    expect(metadata.title).toEqual({
      template: '%s | Helder Burato Berto',
      default: 'Helder Burato Berto',
    });
  });

  it('sets theme colors for light and dark schemes', () => {
    expect(viewport.themeColor).toEqual([
      { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
      { media: '(prefers-color-scheme: dark)', color: '#0a0d12' },
    ]);
  });
});

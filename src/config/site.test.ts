import { describe, expect, it, vi } from 'vitest';

const loadSiteConfig = async (env: string) => {
  vi.stubEnv('NODE_ENV', env);
  vi.resetModules();
  return (await import('./site')).siteConfig;
};

describe('siteConfig', () => {
  it('links to the live site and resume in production', async () => {
    const config = await loadSiteConfig('production');

    expect(config.homeUrl).toBe('https://helderberto.com');
    expect(config.resumeUrl).toBe('https://resume.helderberto.com');
  });

  it('links to local routes outside production', async () => {
    const config = await loadSiteConfig('development');

    expect(config.homeUrl).toBe('/');
    expect(config.resumeUrl).toBe('/resume');
  });
});

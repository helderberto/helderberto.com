import { describe, expect, it, vi } from 'vitest';
import { formatPostDate } from './format-post-date';

describe('formatPostDate', () => {
  it.each([
    ['short', 'Jan 01, 2024'],
    ['long', 'January 1, 2024'],
  ] as const)('formats the %s style', (style, expected) => {
    expect(formatPostDate('2024-01-01', style)).toBe(expected);
  });

  it('keeps the calendar day west of UTC', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo');

    expect(formatPostDate('2024-01-01', 'long')).toBe('January 1, 2024');
  });
});

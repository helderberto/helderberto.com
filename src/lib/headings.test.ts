import { describe, expect, it } from 'vitest';
import { getHeadings } from './headings';

describe('getHeadings', () => {
  it('returns h2 ids and plain text', () => {
    expect(
      getHeadings('# Title\n\n## First **bold**\n\n### Skip\n\n## Second'),
    ).toEqual([
      { id: 'first-bold', text: 'First bold' },
      { id: 'second', text: 'Second' },
    ]);
  });
});

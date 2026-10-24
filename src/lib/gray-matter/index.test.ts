import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '.';

describe('parseMarkdown', () => {
  it('splits the frontmatter from the body', () => {
    const file = parseMarkdown<{ title: string }>(
      "---\ntitle: 'Hello'\n---\n# Body\n",
    );

    expect(file).toEqual({ data: { title: 'Hello' }, content: '# Body\n' });
  });

  it('returns empty frontmatter when the file has none', () => {
    expect(parseMarkdown('Just text')).toEqual({
      data: {},
      content: 'Just text',
    });
  });
});

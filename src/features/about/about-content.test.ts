import fs from 'fs';
import { describe, expect, it, vi } from 'vitest';
import { getAboutContent } from './about-content';

describe('getAboutContent', () => {
  it('reads the about page from content/about.md', () => {
    const { title, body } = getAboutContent();

    expect(title).toBe('About Me');
    expect(body).toContain('Senior Software Engineer');
  });

  it('promotes the leading heading to the title once', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(
      '---\nlayout: about\n---\n\n# Hi there\n\nBody text',
    );

    expect(getAboutContent()).toEqual({
      title: 'Hi there',
      body: '\nBody text',
    });
  });

  it('keeps the whole text as the body when there is no leading heading', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('Just some text');

    expect(getAboutContent()).toEqual({
      title: undefined,
      body: 'Just some text',
    });
  });
});

import matter from 'gray-matter';

export interface MarkdownFile<T> {
  data: T;
  content: string;
}

/**
 * Splits a markdown file into frontmatter and body. gray-matter types the
 * frontmatter as `any`, so the caller names the shape it expects.
 */
export function parseMarkdown<T>(source: string): MarkdownFile<T> {
  const { data, content } = matter(source);
  return { data: data as T, content };
}

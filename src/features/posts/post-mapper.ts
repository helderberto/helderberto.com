import type { Post, PostFileDto, PostFrontmatterDto } from '@/types/post';

const WORDS_PER_MINUTE = 200;

export function toPostSummary(
  slug: string,
  frontmatter: PostFrontmatterDto,
): Post {
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
  };
}

export function toPost(slug: string, file: PostFileDto): Post {
  const wordCount = file.content.split(/\s+/g).length;

  return {
    ...toPostSummary(slug, file.data),
    content: file.content,
    tags: file.data.tags || [],
    readingTime: `${Math.ceil(wordCount / WORDS_PER_MINUTE)} min read`,
    lastModified: file.data.lastModified || file.data.date,
  };
}

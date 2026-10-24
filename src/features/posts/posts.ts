import fs from 'fs';
import { parseMarkdown } from '@/lib/gray-matter';
import type { Post, PostFrontmatterDto } from '@/types/post';
import path from 'path';
import { toPost, toPostSummary } from './post-mapper';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const { data } = parseMarkdown<PostFrontmatterDto>(
      fs.readFileSync(fullPath, 'utf8'),
    );

    return toPostSummary(slug, data);
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const file = parseMarkdown<PostFrontmatterDto>(
    fs.readFileSync(fullPath, 'utf8'),
  );

  return toPost(slug, file);
}

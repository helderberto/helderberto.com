export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  tags?: string[];
  readingTime?: string;
  lastModified?: string;
}

/** Frontmatter as it is written at the top of each posts/*.md file. */
export interface PostFrontmatterDto {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  lastModified?: string;
}

/** A parsed posts/*.md file: its frontmatter and its markdown body. */
export interface PostFileDto {
  data: PostFrontmatterDto;
  content: string;
}

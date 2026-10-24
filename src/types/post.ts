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

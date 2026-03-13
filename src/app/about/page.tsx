import { MarkdownContent } from '@/components/MarkdownContent';
import fs from 'fs';
import matter from 'gray-matter';
import { Metadata } from 'next';
import path from 'path';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me and my blog',
};

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), 'content', 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { content } = matter(fileContents);

  return (
    <article className={styles.content} aria-label="About Me">
      <MarkdownContent content={content} />
    </article>
  );
}

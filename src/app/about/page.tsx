import { MarkdownContent } from '@/components/MarkdownContent';
import fs from 'fs';
import matter from 'gray-matter';
import { Metadata } from 'next';
import Image from 'next/image';
import path from 'path';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me and my blog',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), 'content', 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { content } = matter(fileContents);

  const trimmed = content.trimStart();
  const titleMatch = trimmed.match(/^#\s+(.+)\r?\n/);
  const title = titleMatch?.[1];
  const body = titleMatch ? trimmed.slice(titleMatch[0].length) : trimmed;

  return (
    <article className={styles.about} aria-label="About Me">
      <Image
        src="/about-photo.jpg"
        alt="Helder Burato Berto smiling in sunglasses at a marina"
        width={640}
        height={640}
        className={styles.photo}
        priority
      />
      <div className={styles.content}>
        {title ? <h1>{title}</h1> : null}
        <MarkdownContent content={body} />
      </div>
    </article>
  );
}

import SearchPosts from '@/components/SearchPosts';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/lib/posts';
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <>
      <section className={styles.intro}>
        <h1>
          <span className={styles.wave} aria-hidden="true">
            👋
          </span>
          Hey! I&apos;m Helder
        </h1>
        <p>
          I build modern web apps with React and TypeScript, sharing insights on
          architecture, front-end engineering, and best practices for scalable
          development.
        </p>
      </section>

      <section aria-label="Blog Posts">
        <SearchPosts initialPosts={posts} />
      </section>
    </>
  );
}

import SearchPosts from '@/components/SearchPosts';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/lib/posts';
import { Github, Linkedin } from 'lucide-react';
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
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Helder Burato Berto</h1>
        <p className={styles.heroRole}>{siteConfig.author.role}</p>
        <p className={styles.heroTagline}>
          I build modern web apps with React and TypeScript, sharing insights on
          architecture, front-end engineering, and best practices for scalable
          development.
        </p>
        <div className={styles.heroSocial}>
          <a
            href={siteConfig.social.github}
            className={styles.socialLink}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            className={styles.socialLink}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className={styles.socialIcon} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section aria-label="Blog Posts">
        <SearchPosts initialPosts={posts} />
      </section>
    </>
  );
}

import { PageTransition } from '@/components';
import { siteConfig } from '@/config/site';
import { SearchPosts } from '@/features/posts';
import { Github, Linkedin } from '@/lib/lucide-react';
import type { Post } from '@/types/post';
import styles from './home-view.module.css';

interface HomeViewProps {
  posts: Post[];
}

export function HomeView({ posts }: HomeViewProps) {
  return (
    <PageTransition>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Helder Burato Berto</h1>
        <p className={styles.heroRole}>{siteConfig.author.role}</p>
        <p className={styles.heroTagline}>
          I build modern web apps with React and TypeScript, sharing insights on
          architecture, frontend engineering, and best practices for scalable
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
    </PageTransition>
  );
}

import type { Post } from '@/types/post';
import Link from 'next/link';
import styles from './post-navigation.module.css';

interface PostNavigationProps {
  previous?: Post;
  next?: Post;
}

export function PostNavigation({
  previous,
  next,
}: Readonly<PostNavigationProps>) {
  return (
    <nav aria-label="Post navigation" className={styles.nav}>
      {previous && (
        <Link
          href={`/posts/${previous.slug}`}
          rel="prev"
          className={styles.link}
        >
          <span className={styles.label}>Previous post</span>{' '}
          <span className={styles.title}>{previous.title}</span>
        </Link>
      )}
      {next && (
        <Link
          href={`/posts/${next.slug}`}
          rel="next"
          className={`${styles.link} ${styles.next}`}
        >
          <span className={styles.label}>Next post</span>{' '}
          <span className={styles.title}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}

import type { Post } from '@/types/post';
import Link from 'next/link';
import { formatPostDate } from './format-post-date';
import styles from './post-card.module.css';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <li className={styles.item}>
      <time className={styles.date} dateTime={post.date}>
        {formatPostDate(post.date, 'short')}
      </time>
      <Link href={`/posts/${post.slug}`} className={styles.title}>
        {post.title}
      </Link>
    </li>
  );
};

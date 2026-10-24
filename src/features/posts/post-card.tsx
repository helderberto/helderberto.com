import type { Post } from '@/types/post';
import Link from 'next/link';
import styles from './post-card.module.css';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <li className={styles.item}>
      <time className={styles.date} dateTime={post.date}>
        {formatDate(post.date)}
      </time>
      <Link href={`/posts/${post.slug}`} className={styles.title}>
        {post.title}
      </Link>
    </li>
  );
};

import { formatPostDate } from './format-post-date';
import styles from './post-header.module.css';

interface PostHeaderProps {
  title: string;
  date: string;
  readingTime?: string;
}

export function PostHeader({ title, date, readingTime }: PostHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 id="post-title" className={styles.title}>
        {title}
      </h1>
      <div className={styles.meta}>
        <time className={styles.date} dateTime={date}>
          {formatPostDate(date, 'long')}
        </time>
        {readingTime && (
          <span className={styles.readingTime}>{readingTime}</span>
        )}
      </div>
    </header>
  );
}

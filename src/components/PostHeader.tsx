import styles from './PostHeader.module.css';

interface PostHeaderProps {
  title: string;
  date: string;
  readingTime?: string;
}

export function PostHeader({ title, date, readingTime }: PostHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className={styles.header}>
      <h1 id="post-title" className={styles.title}>
        {title}
      </h1>
      <div className={styles.meta}>
        <time className={styles.date} dateTime={date}>
          {formattedDate}
        </time>
        {readingTime && (
          <span className={styles.readingTime}>{readingTime}</span>
        )}
      </div>
    </header>
  );
}

import type { Heading } from '@/types/heading';
import styles from './table-of-contents.module.css';

const MIN_HEADINGS = 4;

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: Readonly<TableOfContentsProps>) {
  if (headings.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className={styles.toc}>
      <details className={styles.details}>
        <summary className={styles.summary}>On this page</summary>
        <ol className={styles.list}>
          {headings.map(({ id, text }) => (
            <li key={id}>
              <a href={`#${id}`} className={styles.link}>
                {text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}

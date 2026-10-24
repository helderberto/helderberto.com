import type { ReactNode } from 'react';
import styles from './heading-anchor.module.css';

interface HeadingAnchorProps {
  id?: string;
  children: ReactNode;
}

export function HeadingAnchor({ id, children }: Readonly<HeadingAnchorProps>) {
  if (!id) {
    return <h2>{children}</h2>;
  }

  return (
    <h2 id={id} className={styles.heading}>
      <a href={`#${id}`} className={styles.anchor}>
        {children}
      </a>
    </h2>
  );
}

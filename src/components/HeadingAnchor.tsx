import { isValidElement, type ReactNode } from 'react';
import styles from './HeadingAnchor.module.css';

interface HeadingAnchorProps {
  id?: string;
  children: ReactNode;
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return `${node}`;
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children);
  return '';
}

export function HeadingAnchor({ id, children }: Readonly<HeadingAnchorProps>) {
  return (
    <h2 id={id} className={styles.heading}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          className={styles.anchor}
          aria-label={`Link to section: ${textOf(children)}`}
        >
          #
        </a>
      )}
    </h2>
  );
}

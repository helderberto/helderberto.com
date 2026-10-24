import { PageTransition } from '@/components';
import type { AboutContent } from '@/features/about';
import { MarkdownContent } from '@/features/markdown';
import Image from 'next/image';
import styles from './about-view.module.css';

export function AboutView({ title, body }: AboutContent) {
  return (
    <PageTransition>
      <article className={styles.about} aria-label="About Me">
        <Image
          src="/about-photo.webp"
          alt="Helder Burato Berto smiling in sunglasses at a marina"
          width={640}
          height={640}
          className={styles.photo}
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.content}>
          {title ? <h1>{title}</h1> : null}
          <MarkdownContent content={body} />
        </div>
      </article>
    </PageTransition>
  );
}

import { JsonLd, PageTransition } from '@/components';
import { MarkdownContent } from '@/features/markdown';
import {
  Comments,
  PostHeader,
  PostNavigation,
  ReadingProgress,
  TableOfContents,
} from '@/features/posts';
import type { Heading } from '@/types/heading';
import type { Post } from '@/types/post';
import styles from './post-view.module.css';

interface PostViewProps {
  post: Post;
  headings: Heading[];
  older?: Post;
  newer?: Post;
  jsonLd: Record<string, unknown>;
}

export function PostView({
  post,
  headings,
  older,
  newer,
  jsonLd,
}: PostViewProps) {
  return (
    <>
      <ReadingProgress />
      <PageTransition>
        <article className={styles.article} aria-labelledby="post-title">
          <JsonLd data={jsonLd} />
          <PostHeader
            title={post.title}
            date={post.date}
            readingTime={post.readingTime}
          />
          <TableOfContents headings={headings} />
          <div className={`${styles.content} ${styles.markdownContent}`}>
            <MarkdownContent content={post.content!} />
          </div>
          <PostNavigation previous={older} next={newer} />
          <section aria-label="Comments" className={styles.comments}>
            <Comments />
          </section>
        </article>
      </PageTransition>
    </>
  );
}

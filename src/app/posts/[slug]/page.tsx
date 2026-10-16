import { Comments } from '@/components/Comments';
import { JsonLd } from '@/components/JsonLd';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PostHeader } from '@/components/PostHeader';
import { PostNavigation } from '@/components/PostNavigation';
import { ReadingProgress } from '@/components/ReadingProgress';
import { sharedOpenGraph, sharedTwitter } from '@/app/shared-metadata';
import { siteConfig } from '@/config/site';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: "The post you're looking for doesn't exist",
    };
  }

  const url = new URL(`/posts/${slug}`, siteConfig.url).toString();

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      ...sharedOpenGraph,
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.name],
      url,
    },
    twitter: {
      ...sharedTwitter,
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${siteConfig.url}/posts/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const url = new URL(`/posts/${slug}`, siteConfig.url).toString();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    description: post.excerpt,
    url,
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <article className={styles.article} aria-labelledby="post-title">
      <JsonLd data={jsonLd} />
      <ReadingProgress />
      <PostHeader
        title={post.title}
        date={post.date}
        readingTime={post.readingTime}
      />
      <div className={`${styles.content} ${styles.markdownContent}`}>
        <MarkdownContent content={post.content!} />
      </div>
      <PostNavigation previous={older} next={newer} />
      <section aria-label="Comments" className={styles.comments}>
        <Comments />
      </section>
    </article>
  );
}

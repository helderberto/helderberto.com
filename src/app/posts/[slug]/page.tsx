import { sharedOpenGraph, sharedTwitter } from '@/config/shared-metadata';
import { siteConfig } from '@/config/site';
import { getHeadings } from '@/features/markdown';
import { getAllPosts, getPostBySlug } from '@/features/posts';
import { PostView } from '@/views/post-view';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
      locale: sharedOpenGraph.locale,
      siteName: sharedOpenGraph.siteName,
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.name],
      url,
    },
    twitter: {
      card: sharedTwitter.card,
      creator: sharedTwitter.creator,
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
    <PostView
      post={post}
      headings={getHeadings(post.content!)}
      older={older}
      newer={newer}
      jsonLd={jsonLd}
    />
  );
}

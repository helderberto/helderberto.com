import { CodeBlock } from "@/components/CodeBlock";
import { Comments } from "@/components/Comments";
import { JsonLd } from "@/components/JsonLd";
import { PostHeader } from "@/components/PostHeader";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

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
      title: "Post Not Found",
      description: "The post you're looking for doesn't exist",
    };
  }

  const url = new URL(`/posts/${slug}`, siteConfig.url).toString();

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.name],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const url = new URL(`/posts/${slug}`, siteConfig.url).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    description: post.excerpt,
    url,
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <article className={styles.article}>
      <JsonLd data={jsonLd} />
      <PostHeader title={post.title} date={post.date} />
      <div className={`${styles.content} ${styles.markdownContent}`}>
        <Markdown
          options={{
            overrides: {
              code: {
                component: CodeBlock,
              },
            },
          }}
        >
          {post.content}
        </Markdown>
      </div>
      <Comments
        repo={`${siteConfig.githubUsername}/${siteConfig.githubRepo}`}
        issueTerm={`pathname/${slug}`}
        theme="github-dark"
      />
    </article>
  );
}

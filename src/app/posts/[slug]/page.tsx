import { CodeBlock } from "@/components/CodeBlock";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.date,
        authors: [siteConfig.name],
        url: `${siteConfig.url}/posts/${params.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The post you're looking for doesn't exist",
    };
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
      url: `${siteConfig.url}/posts/${params.slug}`,
      publisher: {
        "@type": "Person",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <time className={styles.date} dateTime={post.date}>
              {formattedDate}
            </time>
          </header>
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
        </article>
      </>
    );
  } catch (error) {
    notFound();
  }
}

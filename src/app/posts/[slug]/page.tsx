import { CodeBlock } from "@/components/CodeBlock";
import { Comments } from "@/components/Comments";
import { PostHeader } from "@/components/PostHeader";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PostPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug) return notFound();

  try {
    const post = await getPostBySlug(slug);
    const url = `${siteConfig.url}/posts/${slug}`;

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
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug) return notFound();

  try {
    const post = await getPostBySlug(slug);
    const url = `${siteConfig.url}/posts/${slug}`;

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
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className={styles.article}>
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
          <Comments />
        </article>
      </>
    );
  } catch (error) {
    notFound();
  }
}

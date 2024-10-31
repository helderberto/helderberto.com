import { CodeBlock } from "@/components/CodeBlock";
import { getPostBySlug } from "@/lib/posts";
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
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The post you're looking for doesn't exist",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);

    return (
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{post.title}</h1>
          <time dateTime={post.date}>{post.date}</time>
        </header>
        <div className={styles.content}>
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
    );
  } catch (error) {
    notFound();
  }
}

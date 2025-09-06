import SearchPosts from "@/components/SearchPosts";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="flex-col gap-lg container-sm">
      <div className={styles.content}>
        <section className={styles.intro}>
          <h1>👋 Hey there! I'm Helder</h1>
          <p className="t-center">
            I build modern web apps with React and TypeScript, sharing insights
            on architecture, front-end engineering, and best practices for
            scalable development.
          </p>
        </section>

        <section className={styles.posts} aria-label="Blog Posts">
          <SearchPosts initialPosts={posts} />
        </section>
      </div>
    </main>
  );
}

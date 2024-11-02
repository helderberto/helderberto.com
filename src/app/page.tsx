import SearchPosts from "@/components/SearchPosts";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Helder Burato Berto | Senior Software Engineer",
  description:
    "Senior Software Engineer specializing in React and TypeScript. Blog about software architecture and engineering best practices.",
  keywords: [
    "React",
    "TypeScript",
    "Software Engineering",
    "Web Development",
    "Software Architecture",
  ],
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section className={styles.intro}>
          <h1>Hey there! I'm Helder 👋</h1>
          <p>
            I specialize in building modern web applications with React and
            TypeScript. Here, I share my insights about software architecture,
            engineering practices, and web development best practices.
          </p>
        </section>

        <section className={styles.posts} aria-label="Blog Posts">
          <SearchPosts initialPosts={posts} />
        </section>
      </div>
    </main>
  );
}

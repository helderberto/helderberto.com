import SearchPosts from "@/components/SearchPosts";
import { getAllPosts } from "@/lib/posts";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className={styles.container}>
      <section className={styles.intro}>
        <h1>Hey there! I'm Helder 👋</h1>
        <p>
          Tech Lead and Senior Software Engineer building web applications with
          React and TypeScript. Writing about software architecture, engineering
          practices, and team leadership.
        </p>
      </section>

      <SearchPosts initialPosts={posts} />
    </div>
  );
}

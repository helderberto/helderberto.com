import SearchPosts from "@/components/SearchPosts";
import { getAllPosts } from "@/lib/posts";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className={styles.container}>
      <section className={styles.intro}>
        <h1>Welcome to My Blog</h1>
        <p>
          Hi! I'm [Your Name]. This is my personal blog where I write about web
          development, programming, and technology.
        </p>
      </section>

      <SearchPosts initialPosts={posts} />
    </div>
  );
}

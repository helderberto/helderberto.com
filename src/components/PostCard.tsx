import { Post } from "@/lib/posts";
import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/posts/${post.slug}`} className={styles.card}>
      <article>
        <h2 className={styles.title}>{post.title}</h2>
        <time className={styles.date} dateTime={post.date}>
          {post.date}
        </time>
        <p className={styles.excerpt}>{post.excerpt}</p>
      </article>
    </Link>
  );
};

export default PostCard;

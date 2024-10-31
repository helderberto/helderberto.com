import { Post } from "@/lib/posts";
import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/posts/${post.slug}`} className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.date}>{post.date}</p>
      <p className={styles.excerpt}>{post.excerpt}</p>
    </Link>
  );
};

export default PostCard;

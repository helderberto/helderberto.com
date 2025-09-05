import { Post } from "@/lib/posts";
import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.item}>
      <time className={styles.date} dateTime={post.date}>
        {formatDate(post.date)}
      </time>
      <Link href={`/posts/${post.slug}`} className={styles.title}>
        {post.title}
      </Link>
    </div>
  );
};

export default PostCard;

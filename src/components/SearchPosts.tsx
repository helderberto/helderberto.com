"use client";

import { Post } from "@/lib/posts";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import styles from "./SearchPosts.module.css";

interface SearchPostsProps {
  initialPosts: Post[];
}

const SearchPosts = ({ initialPosts }: SearchPostsProps) => {
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    const filtered = initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [search, initialPosts]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
          aria-label="Search posts"
        />
      </div>
      <div className={styles.results}>
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default SearchPosts;

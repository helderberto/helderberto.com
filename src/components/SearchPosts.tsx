"use client";

import { Post } from "@/lib/types";
import { useState } from "react";
import { EmptyState } from "./EmptyState";
import PostCard from "./PostCard";
import styles from "./SearchPosts.module.css";

interface SearchPostsProps {
  initialPosts: Post[];
}

export default function SearchPosts({ initialPosts }: SearchPostsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.results}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <EmptyState
            message={
              searchQuery
                ? `No posts found for "${searchQuery}"`
                : "No posts found"
            }
          />
        )}
      </div>
    </div>
  );
}

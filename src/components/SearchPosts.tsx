"use client";

import { Post } from "@/lib/posts";
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

  const groupPostsByYear = (posts: Post[]) => {
    const grouped: { [year: string]: Post[] } = {};
    
    posts.forEach((post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });

    return Object.entries(grouped).sort(([yearA], [yearB]) => 
      parseInt(yearB) - parseInt(yearA)
    );
  };

  const groupedPosts = groupPostsByYear(filteredPosts);

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
          groupedPosts.map(([year, posts]) => (
            <div key={year} className={styles.yearGroup}>
              <h2 className={styles.yearHeading}>{year}</h2>
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ))
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

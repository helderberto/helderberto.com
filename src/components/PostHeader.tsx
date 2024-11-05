"use client";

import styles from "@/app/[slug]/page.module.css";

interface PostHeaderProps {
  title: string;
  date: string;
}

export function PostHeader({ title, date }: PostHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <time className={styles.date} dateTime={date}>
        {formattedDate}
      </time>
    </header>
  );
}

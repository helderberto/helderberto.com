"use client";

import { useEffect, useRef } from "react";
import styles from "./Comments.module.css";

interface CommentsProps {
  repo: string;
  issueTerm: string;
  label?: string;
  theme?: "github-light" | "github-dark";
}

export function Comments({
  repo,
  issueTerm,
  label = "Comments",
  theme = "github-light",
}: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove any existing script first
    const existingScript = document.querySelector('script[src*="utteranc"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append the new script
    const script = document.createElement("script");
    const config = {
      src: "https://utteranc.es/client.js",
      repo,
      "issue-term": issueTerm,
      label,
      theme,
      crossorigin: "anonymous",
      async: "true",
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    commentsRef.current?.appendChild(script);

    return () => {
      // Cleanup script on unmount
      script.remove();
    };
  }, [repo, issueTerm, label, theme]);

  return <div ref={commentsRef} className={styles.comments} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Skip if already loaded
    if (loaded) return;

    const utterancesOrigin = "https://utteranc.es";

    // Create and append the new script
    const script = document.createElement("script");
    const config = {
      src: `${utterancesOrigin}/client.js`,
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

    // Add load event listener
    script.onload = () => {
      setLoaded(true);
    };

    // Handle authentication message
    const handler = (event: MessageEvent) => {
      if (event.origin !== utterancesOrigin) return;
      if (event.data.type === "authorized") {
        // Reload the comments section when auth is successful
        const iframe = commentsRef.current?.querySelector("iframe");
        if (iframe) iframe.contentWindow?.location.reload();
      }
    };

    window.addEventListener("message", handler);
    commentsRef.current?.appendChild(script);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [repo, issueTerm, label, theme, loaded]);

  return (
    <div className={styles.comments}>
      <div ref={commentsRef} />
    </div>
  );
}

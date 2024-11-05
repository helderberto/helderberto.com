"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import styles from "./Comments.module.css";

interface CommentsProps {
  repo: string;
  issueTerm: string;
  label?: string;
}

export function Comments({
  repo,
  issueTerm,
  label = "Comments",
}: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { theme, systemTheme } = useTheme();

  // Determine the actual theme (system, light, or dark)
  const currentTheme = theme === "system" ? systemTheme : theme;
  const utterancesTheme =
    currentTheme === "dark" ? "github-dark" : "github-light";

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
      theme: utterancesTheme,
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
  }, [repo, issueTerm, label, utterancesTheme, loaded]);

  // Update theme when website theme changes
  useEffect(() => {
    if (!loaded) return;

    const iframe =
      commentsRef.current?.querySelector<HTMLIFrameElement>(
        ".utterances-frame"
      );
    if (!iframe) return;

    const message = {
      type: "set-theme",
      theme: utterancesTheme,
    };

    iframe.contentWindow?.postMessage(message, "https://utteranc.es");
  }, [utterancesTheme, loaded]);

  return (
    <div className={styles.comments}>
      <div ref={commentsRef} />
    </div>
  );
}

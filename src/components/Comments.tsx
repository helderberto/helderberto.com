"use client";

import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import styles from "./Comments.module.css";

export const Comments = ({ url }: { url: string }) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const utterancesTheme =
    currentTheme === "dark" ? "github-dark" : "github-light";

  useEffect(() => {
    const scriptParentElement = commentRef.current;
    const utterancesEl = scriptParentElement?.querySelector(".utterances");
    if (utterancesEl) {
      utterancesEl.remove();
    }

    const pathname = new URL(url).pathname;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", siteConfig.comments.repo);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("path", pathname);
    script.setAttribute("label", siteConfig.comments.label);
    script.setAttribute("theme", utterancesTheme);

    scriptParentElement?.appendChild(script);

    return () => {
      script.remove();
    };
  }, [utterancesTheme, url]);

  return (
    <div className={styles.comments}>
      <div ref={commentRef} />
    </div>
  );
};

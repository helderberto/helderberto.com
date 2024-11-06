"use client";

import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import styles from "./Comments.module.css";

export const Comments = () => {
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

    const script = document.createElement("script");
    script.setAttribute("src", "https://utteranc.es/client.js");
    script.setAttribute("repo", siteConfig.comments.repo);
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("issue-term", "url");
    script.setAttribute("theme", utterancesTheme);
    script.setAttribute("label", siteConfig.comments.label);
    script.setAttribute("async", "true");

    commentRef.current?.appendChild(script);
  }, [utterancesTheme]);

  return (
    <div className={styles.comments}>
      <div ref={commentRef} />
    </div>
  );
};

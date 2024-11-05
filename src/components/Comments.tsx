"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import styles from "./Comments.module.css";

interface CommentsProps {
  repo: string;
  issueTerm: string;
  label?: string;
}

// Custom hook for handling utterances script
const useUtterances = (params: {
  url: string;
  theme: string;
  issueTerm: string;
  repo: string;
  label?: string;
  ref: React.RefObject<HTMLDivElement>;
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "loading"
  );
  const { url, theme, issueTerm, repo, label, ref } = params;

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }

    const script = document.createElement("script");
    const utterancesConfig = {
      src: url,
      theme,
      "issue-term": issueTerm,
      repo,
      label,
      crossorigin: "anonymous",
      async: "true",
    };

    Object.entries(utterancesConfig).forEach(([key, value]) => {
      script.setAttribute(key, value as string);
    });

    const setScriptStatus = (event: Event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setScriptStatus);
    script.addEventListener("error", setScriptStatus);
    ref.current?.appendChild(script);

    return () => {
      script.removeEventListener("load", setScriptStatus);
      script.removeEventListener("error", setScriptStatus);
    };
  }, [url, theme, issueTerm, repo, ref, label]);

  return status;
};

export function Comments({
  repo,
  issueTerm,
  label = "Comments",
}: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const utterancesTheme =
    currentTheme === "dark" ? "github-dark" : "github-light";

  const status = useUtterances({
    url: "https://utteranc.es/client.js",
    theme: utterancesTheme,
    issueTerm,
    repo,
    label,
    ref: commentsRef,
  });

  // Update theme when website theme changes
  useEffect(() => {
    if (status !== "ready") return;

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
  }, [utterancesTheme, status]);

  return (
    <div className={styles.comments}>
      <div ref={commentsRef} />
    </div>
  );
}

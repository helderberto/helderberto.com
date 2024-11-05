"use client";

import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const useScript = (params: {
  url: string;
  theme: string;
  issueTerm: string;
  repo: string;
  ref: React.RefObject<HTMLElement>;
}) => {
  const { url, theme, issueTerm, repo, ref } = params;

  useEffect(() => {
    if (!url) {
      return;
    }

    let script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("theme", theme);
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("repo", repo);

    if (ref.current) {
      ref.current.appendChild(script);
    }

    // store status of the script
    const setAttributeStatus = (event: Event) => {
      if (event.type === "load") {
        console.log("Script loaded successfully");
      } else if (event.type === "error") {
        console.error("Error loading script:", event);
      }
    };

    script.addEventListener("load", setAttributeStatus);
    script.addEventListener("error", setAttributeStatus);

    return () => {
      // useEffect clean up
      if (script) {
        script.removeEventListener("load", setAttributeStatus);
        script.removeEventListener("error", setAttributeStatus);
      }
    };
  }, [url]);
};

export const Comments = ({ url }: { url: string }) => {
  const commentRef = useRef(null);
  const { theme } = useTheme();

  useScript({
    url: "https://utteranc.es/client.js",
    theme: theme || "github-dark",
    issueTerm: url,
    repo: siteConfig.comments.repo,
    ref: commentRef,
  });

  return (
    <div className="w-full">
      <div ref={commentRef}></div>
    </div>
  );
};

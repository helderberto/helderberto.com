"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Comments() {
  const { theme } = useTheme();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove any existing utterances elements
    const utterancesElement = elementRef.current?.querySelector(".utterances");
    if (utterancesElement) {
      utterancesElement.remove();
    }

    const scriptElement = document.createElement("script");
    const attributes = {
      src: "https://utteranc.es/client.js",
      repo: "helderberto/website", // Replace with your repo
      "issue-term": "pathname",
      label: "💬 comments",
      theme: theme === "dark" ? "github-dark" : "github-light",
      crossorigin: "anonymous",
      async: "true",
    };

    Object.entries(attributes).forEach(([key, value]) => {
      scriptElement.setAttribute(key, value);
    });

    elementRef.current?.appendChild(scriptElement);

    return () => {
      scriptElement.remove();
    };
  }, [theme]);

  return <div ref={elementRef} className="mt-10" />;
}

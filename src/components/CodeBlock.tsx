"use client";

import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useRef, useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  className?: string;
  children: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
      setCopied(true);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  // If there's no className, it's an inline code
  if (!className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }

  const language = className.replace("lang-", "");

  return (
    <div className={styles.wrapper}>
      <pre className={`${styles.pre} ${className || ""}`}>
        <button
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

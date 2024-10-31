"use client";

import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect } from "react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  className?: string;
  children: string;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  const language = className?.replace("lang-", "") || "plaintext";

  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeHeader}>
        <span className={styles.language}>{language}</span>
      </div>
      <pre className={`${styles.pre} ${className}`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

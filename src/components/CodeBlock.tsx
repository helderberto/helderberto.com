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

  // If there's no className, it's an inline code
  if (!className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }

  const language = className.replace("lang-", "");

  return (
    <div className={styles.codeWrapper}>
      <pre>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

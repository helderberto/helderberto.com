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
import { useEffect, useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  className?: string;
  children: string;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  // If there's no className, it's an inline code
  if (!className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }

  const rawLanguage = className.replace("lang-", "") || "plaintext";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <pre className={styles.codeWrapper}>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy code to clipboard"
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
      <code className={`${styles.pre} language-${rawLanguage}`}>
        {children}
      </code>
    </pre>
  );
}

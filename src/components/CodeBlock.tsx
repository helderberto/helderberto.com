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
  children: React.ReactNode;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle syntax highlighting after mount
  useEffect(() => {
    if (mounted && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [mounted, children]);

  // If there's no className, it's an inline code
  if (!className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }

  // Clean up the language className
  const language = className.replace(/^lang-/, "").replace(/^language-/, "");

  return (
    <div className={styles.codeBlockContainer}>
      <pre className={styles.pre}>
        <code ref={codeRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

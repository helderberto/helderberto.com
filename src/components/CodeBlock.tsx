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
  const [copied, setCopied] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!codeRef.current) return;

    try {
      const code = codeRef.current.textContent || "";
      await navigator.clipboard.writeText(code);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  useEffect(() => {
    const updateButtonPosition = () => {
      if (preRef.current) {
        const rect = preRef.current.getBoundingClientRect();
        setButtonPosition({
          top: rect.top + 8,
          right: window.innerWidth - (rect.right - 8),
        });
      }
    };

    // Update position initially and on scroll/resize
    updateButtonPosition();
    window.addEventListener("scroll", updateButtonPosition);
    window.addEventListener("resize", updateButtonPosition);

    return () => {
      window.removeEventListener("scroll", updateButtonPosition);
      window.removeEventListener("resize", updateButtonPosition);
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
      <pre ref={preRef} className={`${styles.pre} ${className || ""}`}>
        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
          aria-label="Copy code"
          style={{
            top: `${buttonPosition.top}px`,
            right: `${buttonPosition.right}px`,
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <code ref={codeRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

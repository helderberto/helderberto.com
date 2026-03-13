'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
import { useEffect, useRef } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && codeRef.current.parentElement) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  // If there's no className, it's an inline code
  if (!className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }

  // Clean up the language className
  const language = className.replace(/^lang-/, '').replace(/^language-/, '');

  return (
    <div className={styles.codeBlockContainer}>
      <pre className={styles.pre} suppressHydrationWarning>
        <code
          ref={codeRef}
          className={`language-${language}`}
          suppressHydrationWarning
        >
          {children}
        </code>
      </pre>
    </div>
  );
}

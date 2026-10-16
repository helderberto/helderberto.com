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
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current && codeRef.current.parentElement) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(codeRef.current?.textContent ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!className) {
    const isBlock = typeof children === 'string' && children.includes('\n');
    if (!isBlock) {
      return <code className={styles.inlineCode}>{children}</code>;
    }
  }

  const label = className?.match(/(?:^|\s)lang-(\S+)/)?.[1];
  const language = (className ?? 'plaintext')
    .replace(/^lang-/, '')
    .replace(/^language-/, '');

  return (
    <div className={styles.codeBlockContainer}>
      <div className={styles.toolbar}>
        {label && <span className={styles.codeLabel}>{label}</span>}
        <button
          type="button"
          className={styles.copyButton}
          aria-label="Copy code"
          onClick={copy}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
        <span role="status" className="sr-only">
          {copied ? 'Copied' : ''}
        </span>
      </div>
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

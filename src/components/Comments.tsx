'use client';

import { siteConfig } from '@/config/site';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import styles from './Comments.module.css';

export const Comments = () => {
  const commentBox = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const box = commentBox.current;
    if (!box || !resolvedTheme) return;

    const commentsTheme =
      resolvedTheme === 'dark' ? 'github-dark' : 'github-light';

    const existingFrame =
      box.querySelector<HTMLIFrameElement>('.utterances-frame');
    if (existingFrame) {
      existingFrame.contentWindow?.postMessage(
        { type: 'set-theme', theme: commentsTheme },
        'https://utteranc.es',
      );
      return;
    }

    /* Guard against a second injection while the first script is still
       loading (StrictMode re-runs and theme resolution both re-fire this
       effect before the iframe exists) */
    if (box.querySelector('script')) return;

    const commentScript = document.createElement('script');
    commentScript.async = true;
    commentScript.src = 'https://utteranc.es/client.js';
    commentScript.setAttribute('repo', siteConfig.comments.repo);
    commentScript.setAttribute('issue-term', 'pathname');
    commentScript.setAttribute('label', siteConfig.comments.label);
    commentScript.setAttribute('theme', commentsTheme);
    commentScript.setAttribute('crossorigin', 'anonymous');

    box.appendChild(commentScript);
  }, [resolvedTheme]);

  return (
    <div className={styles.comments}>
      <div ref={commentBox} />
    </div>
  );
};

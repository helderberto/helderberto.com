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

    const commentsTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

    const existingFrame = box.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame',
    );
    if (existingFrame) {
      existingFrame.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: commentsTheme } } },
        'https://giscus.app',
      );
      return;
    }

    /* Guard against a second injection while the first script is still
       loading (StrictMode re-runs and theme resolution both re-fire this
       effect before the iframe exists) */
    if (box.querySelector('script')) return;

    const commentScript = document.createElement('script');
    commentScript.async = true;
    commentScript.src = 'https://giscus.app/client.js';
    commentScript.setAttribute('data-repo', siteConfig.comments.repo);
    commentScript.setAttribute('data-repo-id', siteConfig.comments.repoId);
    commentScript.setAttribute('data-category', siteConfig.comments.category);
    commentScript.setAttribute(
      'data-category-id',
      siteConfig.comments.categoryId,
    );
    commentScript.setAttribute('data-mapping', 'pathname');
    commentScript.setAttribute('data-strict', '1');
    commentScript.setAttribute('data-reactions-enabled', '1');
    commentScript.setAttribute('data-emit-metadata', '0');
    commentScript.setAttribute('data-input-position', 'bottom');
    commentScript.setAttribute('data-theme', commentsTheme);
    commentScript.setAttribute('data-lang', 'en');
    commentScript.setAttribute('data-loading', 'lazy');
    commentScript.setAttribute('crossorigin', 'anonymous');

    box.appendChild(commentScript);
  }, [resolvedTheme]);

  return (
    <div className={styles.comments}>
      <div ref={commentBox} />
    </div>
  );
};

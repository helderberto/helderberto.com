'use client';

import { siteConfig } from '@/config/site';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import styles from './Comments.module.css';

export const Comments = () => {
  const commentBox = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const commentsTheme = theme === 'dark' ? 'github-dark' : 'github-light';

    const existingFrame =
      commentBox.current?.querySelector<HTMLIFrameElement>('.utterances-frame');
    if (existingFrame) {
      existingFrame.contentWindow?.postMessage(
        { type: 'set-theme', theme: commentsTheme },
        'https://utteranc.es',
      );
      return;
    }

    if (!commentBox.current) return;

    const commentScript = document.createElement('script');
    commentScript.async = true;
    commentScript.src = 'https://utteranc.es/client.js';
    commentScript.setAttribute('repo', siteConfig.comments.repo);
    commentScript.setAttribute('issue-term', 'pathname');
    commentScript.setAttribute('label', siteConfig.comments.label);
    commentScript.setAttribute('theme', commentsTheme);
    commentScript.setAttribute('crossorigin', 'anonymous');

    commentBox.current.appendChild(commentScript);

    return () => {
      commentBox.current
        ?.querySelectorAll('.utterances, script')
        .forEach((el) => el.remove());
    };
  }, [theme]);

  return (
    <div className={styles.comments}>
      <div ref={commentBox} />
    </div>
  );
};

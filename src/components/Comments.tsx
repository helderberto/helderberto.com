'use client';

import { siteConfig } from '@/config/site';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import styles from './Comments.module.css';

export const Comments = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className={styles.comments}>
      <Giscus
        repo={siteConfig.comments.repo}
        repoId={siteConfig.comments.repoId}
        category={siteConfig.comments.category}
        categoryId={siteConfig.comments.categoryId}
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

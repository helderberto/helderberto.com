'use client';

import { siteConfig } from '@/config/site';
import { Post } from '@/lib/posts';
import {
  Copy,
  FileText,
  Github,
  Home,
  Linkedin,
  Monitor,
  Moon,
  Rss,
  Search,
  Sun,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './CommandPalette.module.css';

interface PaletteItem {
  id: string;
  group: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
}

interface CommandPaletteProps {
  posts: Post[];
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [modifierKey] = useState(() =>
    typeof navigator !== 'undefined' && !/Mac|iP/.test(navigator.platform)
      ? 'Ctrl'
      : '⌘',
  );
  const router = useRouter();
  const { setTheme } = useTheme();

  const items = useMemo(() => {
    const navigation: PaletteItem[] = [
      {
        id: 'nav-home',
        group: 'Navigation',
        label: 'Home',
        icon: Home,
        run: () => router.push('/'),
      },
      {
        id: 'nav-about',
        group: 'Navigation',
        label: 'About',
        icon: User,
        run: () => router.push('/about'),
      },
    ];
    const postItems: PaletteItem[] = posts.map((post) => ({
      id: `post-${post.slug}`,
      group: 'Posts',
      label: post.title,
      icon: FileText,
      run: () => router.push(`/posts/${post.slug}`),
    }));
    const actions: PaletteItem[] = [
      {
        id: 'action-theme-light',
        group: 'Actions',
        label: 'Theme: Light',
        icon: Sun,
        run: () => setTheme('light'),
      },
      {
        id: 'action-theme-dark',
        group: 'Actions',
        label: 'Theme: Dark',
        icon: Moon,
        run: () => setTheme('dark'),
      },
      {
        id: 'action-theme-system',
        group: 'Actions',
        label: 'Theme: System',
        icon: Monitor,
        run: () => setTheme('system'),
      },
      {
        id: 'action-copy',
        group: 'Actions',
        label: 'Copy page URL',
        icon: Copy,
        run: () => navigator.clipboard.writeText(window.location.href),
      },
    ];
    const connect: PaletteItem[] = [
      {
        id: 'connect-github',
        group: 'Connect',
        label: 'GitHub',
        icon: Github,
        run: () => window.open(siteConfig.social.github, '_blank', 'noopener'),
      },
      {
        id: 'connect-linkedin',
        group: 'Connect',
        label: 'LinkedIn',
        icon: Linkedin,
        run: () =>
          window.open(siteConfig.social.linkedin, '_blank', 'noopener'),
      },
      {
        id: 'connect-rss',
        group: 'Connect',
        label: 'RSS feed',
        icon: Rss,
        run: () => window.open('/feed.xml', '_blank', 'noopener'),
      },
    ];

    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [...navigation, ...postItems.slice(0, 5), ...actions, ...connect];
    }
    return [...navigation, ...postItems, ...actions, ...connect].filter(
      (item) => item.label.toLowerCase().includes(normalized),
    );
  }, [posts, query, router, setTheme]);

  const openPalette = () => {
    setQuery('');
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          setQuery('');
          setActiveIndex(0);
          setOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const active = items[activeIndex];
    if (active) {
      document.getElementById(active.id)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, items]);

  const select = (item: PaletteItem) => {
    setOpen(false);
    item.run();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const item = items[activeIndex];
      if (item) select(item);
    }
  };

  const activeId = items[activeIndex]?.id;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={openPalette}
        aria-label="Open command palette"
      >
        <Search className={styles.triggerIcon} aria-hidden="true" />
        <span className={styles.triggerLabel}>Search</span>
        <kbd className={styles.kbd} suppressHydrationWarning>
          {modifierKey} K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        aria-label="Command palette"
      >
        <div className={styles.inputWrapper}>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            id="command-palette-input"
            name="command-palette-query"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={activeId}
            aria-label="Search commands and posts"
            placeholder="Search posts, pages, actions..."
            className={styles.input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <ul
          id="command-palette-listbox"
          role="listbox"
          aria-label="Results"
          className={styles.list}
        >
          {items.map((item, index) => {
            const showGroup =
              index === 0 || items[index - 1].group !== item.group;
            const Icon = item.icon;
            return (
              <Fragment key={item.id}>
                {showGroup && (
                  <li role="presentation" className={styles.groupLabel}>
                    {item.group}
                  </li>
                )}
                <li
                  id={item.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={styles.option}
                  onClick={() => select(item)}
                  onMouseMove={() => setActiveIndex(index)}
                >
                  <Icon className={styles.optionIcon} aria-hidden="true" />
                  <span className={styles.optionLabel}>{item.label}</span>
                </li>
              </Fragment>
            );
          })}
        </ul>

        {items.length === 0 && (
          <p className={styles.empty}>No results for &quot;{query}&quot;</p>
        )}
      </dialog>
    </>
  );
}

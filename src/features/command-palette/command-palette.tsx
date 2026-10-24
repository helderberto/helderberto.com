'use client';

import { useClientSnapshot } from '@/hooks/use-client-snapshot';
import { Search } from '@/lib/lucide-react';
import { useTheme } from '@/lib/next-themes';
import type { Post } from '@/types/post';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './command-palette.module.css';
import { getPaletteItems, type PaletteItem } from './palette-items';
import { PaletteList } from './palette-list';

// Node exposes navigator too, so detect the OS only in the browser.
const getClientModifierKey = () =>
  /Mac|iP/.test(navigator.platform) ? '⌘' : 'Ctrl';
const getServerModifierKey = () => '⌘';

interface CommandPaletteProps {
  posts: Post[];
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const modifierKey = useClientSnapshot(
    getClientModifierKey,
    getServerModifierKey,
  );
  const router = useRouter();
  const { setTheme } = useTheme();

  const items = useMemo(
    () =>
      getPaletteItems({
        posts,
        query,
        navigate: (href) => router.push(href),
        setTheme,
      }),
    [posts, query, router, setTheme],
  );

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
    if (!dialog) {
      return;
    }
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
    if (items.length === 0) {
      return;
    }
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
      if (item) {
        select(item);
      }
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
        <kbd className={styles.kbd}>{modifierKey} K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            setOpen(false);
          }
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

        <PaletteList
          items={items}
          activeIndex={activeIndex}
          onSelect={select}
          onActivate={setActiveIndex}
        />

        {items.length === 0 && (
          <p className={styles.empty}>No results for &quot;{query}&quot;</p>
        )}
      </dialog>
    </>
  );
}

'use client';
import type { Post } from '@/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/features/command-palette';
import styles from './header.module.css';
import { ThemeToggle } from '@/features/theme';

interface HeaderProps {
  posts: Post[];
}

export const Header = ({ posts }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Home">
          <Image
            src="/profile.jpg"
            alt=""
            width={32}
            height={32}
            className={styles.profileImage}
            loading="eager"
          />
        </Link>

        <div className={styles.right}>
          <nav className={styles.nav} aria-label="Main navigation">
            <Link
              href="/"
              className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </nav>
          <CommandPalette posts={posts} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

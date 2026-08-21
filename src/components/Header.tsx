'use client';
import { Post } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from './CommandPalette';
import styles from './Header.module.css';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  posts: Post[];
}

const Header = ({ posts }: HeaderProps) => {
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
            priority
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

export default Header;

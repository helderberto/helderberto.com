'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

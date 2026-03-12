"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/profile.jpg"
            alt="Profile Picture"
            width={32}
            height={32}
            className={styles.profileImage}
          />
        </Link>

        <div className={styles.right}>
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.link} ${pathname === "/about" ? styles.active : ""}`}
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

"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className={`${styles.header} sticky-top`}>
      <div className={`${styles.container} container-sm flex-between`}>
        <Link href="/" className={`${styles.logo} transition-transform`}>
          <Image
            src="/profile.jpg"
            alt="Profile Picture"
            width={56}
            height={56}
            className={styles.profileImage}
          />
        </Link>

        <div className={`${styles.rightSection} flex-center`}>
          <nav className={`${styles.nav} flex-center`}>
            <Link href="/" className={`${styles.link} transition-smooth`}>
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.link} transition-smooth ${
                pathname === "/about" ? styles.active : ""
              }`}
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

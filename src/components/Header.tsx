import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/profile.jpg"
            alt="Profile Picture"
            width={56}
            height={56}
            className={styles.profileImage}
          />
        </Link>

        <div className={styles.rightSection}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <Link href="/about" className={styles.link}>
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

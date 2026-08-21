import { siteConfig } from '@/config/site';
import { Github, Linkedin, Rss } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav className={styles.nav} aria-label="Footer navigation">
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/about" className={styles.link}>
            About
          </Link>
        </nav>
        <div className={styles.social}>
          <a
            href={siteConfig.social.github}
            className={styles.socialLink}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className={styles.icon} aria-hidden="true" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            className={styles.socialLink}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className={styles.icon} aria-hidden="true" />
          </a>
          <a
            href="/feed.xml"
            className={styles.socialLink}
            aria-label="RSS feed"
          >
            <Rss className={styles.icon} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

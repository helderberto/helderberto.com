import styles from './page-transition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

// CSS-only enter animation. A route change mounts a fresh wrapper, so the
// animation replays. No View Transition snapshots, so the old page (and its
// images) never lingers over the new one.
export function PageTransition({ children }: Readonly<PageTransitionProps>) {
  return <div className={styles.page}>{children}</div>;
}

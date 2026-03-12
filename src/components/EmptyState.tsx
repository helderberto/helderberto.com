import { FileSearch } from "lucide-react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No posts found" }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <FileSearch className={styles.icon} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

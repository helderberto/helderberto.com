"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={styles.button}
      aria-label="Toggle theme"
    >
      <div className={styles.iconWrapper}>
        <Sun className={`${styles.icon} ${styles.sunIcon}`} />
        <Moon className={`${styles.icon} ${styles.moonIcon}`} />
      </div>
    </button>
  );
}

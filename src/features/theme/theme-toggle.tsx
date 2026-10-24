'use client';

import { useClientSnapshot } from '@/hooks/use-client-snapshot';
import { Monitor, Moon, Sun } from '@/lib/lucide-react';
import { useTheme } from '@/lib/next-themes';
import styles from './theme-toggle.module.css';

const themeOrder = ['light', 'dark', 'system'] as const;
type ThemeOption = (typeof themeOrder)[number];

const themeIcons = { light: Sun, dark: Moon, system: Monitor };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useClientSnapshot(
    () => true,
    () => false,
  );

  const current: ThemeOption =
    (mounted && themeOrder.find((option) => option === theme)) || 'system';
  const next =
    themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
  const Icon = themeIcons[current];

  return (
    <button
      onClick={() => setTheme(next)}
      className={styles.button}
      aria-label={`Theme: ${current}. Switch to ${next} theme`}
      title={`Theme: ${current}`}
    >
      <Icon className={styles.icon} aria-hidden="true" />
    </button>
  );
}

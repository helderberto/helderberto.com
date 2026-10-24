'use client';

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from '@/lib/next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

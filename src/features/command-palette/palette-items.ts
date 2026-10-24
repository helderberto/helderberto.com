import { siteConfig } from '@/config/site';
import {
  Copy,
  FileText,
  Github,
  Home,
  Linkedin,
  Monitor,
  Moon,
  Rss,
  Sun,
  User,
} from '@/lib/lucide-react';
import type { LucideIcon } from '@/lib/lucide-react';
import type { Post } from '@/types/post';

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
}

interface PaletteItemsOptions {
  posts: Post[];
  query: string;
  navigate: (href: string) => void;
  setTheme: (theme: string) => void;
}

/** Every command, or only those whose label contains the query. */
export function getPaletteItems({
  posts,
  query,
  navigate,
  setTheme,
}: PaletteItemsOptions): PaletteItem[] {
  const navigation: PaletteItem[] = [
    {
      id: 'nav-home',
      group: 'Navigation',
      label: 'Home',
      icon: Home,
      run: () => navigate('/'),
    },
    {
      id: 'nav-about',
      group: 'Navigation',
      label: 'About',
      icon: User,
      run: () => navigate('/about'),
    },
  ];
  const postItems: PaletteItem[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    group: 'Posts',
    label: post.title,
    icon: FileText,
    run: () => navigate(`/posts/${post.slug}`),
  }));
  const actions: PaletteItem[] = [
    {
      id: 'action-theme-light',
      group: 'Actions',
      label: 'Theme: Light',
      icon: Sun,
      run: () => setTheme('light'),
    },
    {
      id: 'action-theme-dark',
      group: 'Actions',
      label: 'Theme: Dark',
      icon: Moon,
      run: () => setTheme('dark'),
    },
    {
      id: 'action-theme-system',
      group: 'Actions',
      label: 'Theme: System',
      icon: Monitor,
      run: () => setTheme('system'),
    },
    {
      id: 'action-copy',
      group: 'Actions',
      label: 'Copy page URL',
      icon: Copy,
      run: () => {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      },
    },
  ];
  const connect: PaletteItem[] = [
    {
      id: 'connect-github',
      group: 'Connect',
      label: 'GitHub',
      icon: Github,
      run: () => window.open(siteConfig.social.github, '_blank', 'noopener'),
    },
    {
      id: 'connect-linkedin',
      group: 'Connect',
      label: 'LinkedIn',
      icon: Linkedin,
      run: () => window.open(siteConfig.social.linkedin, '_blank', 'noopener'),
    },
    {
      id: 'connect-rss',
      group: 'Connect',
      label: 'RSS feed',
      icon: Rss,
      run: () => window.open('/feed.xml', '_blank', 'noopener'),
    },
  ];

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...navigation, ...postItems.slice(0, 5), ...actions, ...connect];
  }
  return [...navigation, ...postItems, ...actions, ...connect].filter((item) =>
    item.label.toLowerCase().includes(normalized),
  );
}

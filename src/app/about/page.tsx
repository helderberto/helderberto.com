import { getAboutContent } from '@/features/about';
import { AboutView } from '@/views/about-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me and my blog',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutView {...getAboutContent()} />;
}

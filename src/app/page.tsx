import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/features/posts';
import { HomeView } from '@/views/home-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  return <HomeView posts={posts} />;
}

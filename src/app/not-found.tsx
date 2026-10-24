import { EmptyState } from '@/components';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <>
      <EmptyState message="This page could not be found" />
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </>
  );
}

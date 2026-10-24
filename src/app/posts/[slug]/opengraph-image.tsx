import { siteConfig } from '@/config/site';
import { getPostBySlug } from '@/features/posts';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export { generateStaticParams } from './page';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const profile = await readFile(
  join(process.cwd(), 'public/profile.jpg'),
  'base64',
);
const profileSrc = `data:image/jpeg;base64,${profile}`;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 96,
        background: '#10141b',
        color: '#e6eaf0',
      }}
    >
      <div
        style={{
          width: 96,
          height: 8,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
        }}
      />
      <div
        style={{
          display: 'flex',
          fontSize: 64,
          lineHeight: 1.15,
        }}
      >
        {post.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <img
          src={profileSrc}
          width={56}
          height={56}
          alt=""
          style={{ borderRadius: '50%' }}
        />
        <div style={{ fontSize: 28, color: '#96a2b3' }}>{siteConfig.name}</div>
      </div>
    </div>,
    size,
  );
}

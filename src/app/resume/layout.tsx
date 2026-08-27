import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { resume } from '@/data/resume';
import type { Metadata } from 'next';
import './resume.css';

export const metadata: Metadata = {
  title: { absolute: 'Helder-Burato-Berto-Resume' },
  description: resume.summary,
  alternates: { canonical: `${siteConfig.url}/resume` },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: resume.name,
          jobTitle: resume.headline,
          email: `mailto:${resume.email}`,
          url: siteConfig.url,
          description: resume.summary,
          sameAs: [siteConfig.social.linkedin, siteConfig.social.github],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Braga',
            addressCountry: 'PT',
          },
          worksFor: {
            '@type': 'Organization',
            name: 'PagerDuty',
          },
          knowsAbout: resume.skills.flatMap((skill) => skill.items),
          knowsLanguage: resume.languages.map((language) => language.name),
        }}
      />
      {children}
    </>
  );
}

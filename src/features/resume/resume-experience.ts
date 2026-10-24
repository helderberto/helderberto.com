import type { Experience } from '@/types/resume';

export const experience = [
  {
    role: 'Senior Software Engineer, Frontend',
    company: 'PagerDuty',
    location: 'Portugal (Remote)',
    period: 'Jul. 2022 - Present',
    positions: [
      {
        level: 'Senior Software Engineer (SDE IV), Frontend',
        period: 'Jul. 2024 - Present',
        bullets: [
          'Define frontend technology standards and UI building patterns on the Frontend Architecture Strategy Team, adopted by product teams across the Frontend Platform org.',
          'Authored the cross-company guidelines for TypeScript adoption, Vite migration, local storage, and source-map handling.',
          'Migrated high-complexity legacy surfaces from Ember and Backbone to React, including the incident timeline and the incident list, one of the highest-traffic pages in the product.',
          'Introduced visual regression testing to a business-critical frontend application, catching breaking UI changes before they reach customers.',
          'Mentor SDE II-III engineers on frontend architecture and technical strategy.',
        ],
      },
      {
        level: 'Senior Software Engineer (SDE III), Frontend',
        period: 'Jul. 2022 - Jul. 2024',
        bullets: [
          'Architected and shipped incident-management features on the Incident Management Services team, including the Incident Responders tool and incident service reassignment.',
          'Contributed to the founding effort of the internal design system.',
        ],
      },
    ],
    tech: [
      'TypeScript',
      'React',
      'Redux Toolkit',
      'React Query',
      'Cypress',
      'Vitest',
      'Jest',
      'CI/CD',
    ],
  },
  {
    role: 'Senior Frontend Engineer',
    company: 'FARFETCH',
    location: 'Portugal (Remote)',
    period: 'Jan. 2021 - Jul. 2022',
    bullets: [
      'Built the back-office platform end to end, from micro-frontend React modules to a NestJS backend-for-frontend wrapping REST services in GraphQL.',
      'Co-led frontend development of the CMS behind Farfetch Platform Solutions, used by luxury retail brands including Harrods and Chanel.',
    ],
    tech: [
      'TypeScript',
      'React',
      'Redux',
      'Next.js',
      'GraphQL',
      'Node.js',
      'Emotion',
      'Docker',
      'Jenkins',
    ],
  },
  {
    role: 'Senior Frontend Engineer',
    company: 'Cheesecake Labs',
    location: 'Brazil (Hybrid)',
    period: 'Jan. 2019 - Dec. 2020',
    bullets: [
      'Architected complex web and mobile (React Native) UI systems for clients including Agriness, AES Tietê, and Skyroam.',
      'Led a chapter of ~20 frontend engineers, setting conventions and technical standards aligned with company OKRs.',
      'Led project planning and client negotiations.',
    ],
    tech: [
      'JavaScript',
      'React',
      'Redux',
      'React Native',
      'Next.js',
      'CSS Modules',
    ],
  },
  {
    role: 'Frontend Engineer',
    company: 'D3',
    location: 'Brazil (Remote)',
    period: 'Mar. 2018 - Jan. 2019',
    bullets: [
      'Built scalable frontend applications for large-brand clients including Centauro and BrasilPrev (Banco do Brasil).',
    ],
    tech: ['JavaScript', 'React', 'CSS', 'React Native'],
  },
  {
    role: 'Founder & CTO',
    company: 'Applann Digital',
    location: 'Brazil (Remote)',
    period: 'Oct. 2016 - Oct. 2018',
  },
  {
    role: 'Full Stack Developer',
    company: 'Project Commerce',
    location: 'Brazil (Remote)',
    period: 'Jan. 2017 - Aug. 2017',
  },
  {
    role: 'Senior Frontend Engineer',
    company: 'Homeyou',
    location: 'USA (Remote)',
    period: 'Aug. 2015 - Oct. 2016',
  },
  {
    role: 'Full Stack Developer',
    company: 'Virtualiza',
    location: 'Brazil (On-site)',
    period: 'Mar. 2013 - Aug. 2015',
  },
  {
    role: 'Full Stack Developer',
    company: 'Burn web.studio',
    location: 'Brazil (On-site)',
    period: 'May 2011 - Mar. 2013',
  },
] satisfies Experience[];

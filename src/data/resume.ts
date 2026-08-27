export type Position = {
  level: string;
  period: string;
  bullets: string[];
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  positions?: Position[];
  bullets?: string[];
  tech?: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export const resume = {
  name: 'Helder Burato Berto',
  headline: 'Senior Software Engineer, Frontend',
  location: 'Braga, Portugal',
  phone: '+351 910 160 926',
  email: 'helder.burato@gmail.com',
  links: [
    { label: 'helderberto.com', href: 'https://helderberto.com' },
    {
      label: 'linkedin.com/in/helderberto',
      href: 'https://www.linkedin.com/in/helderberto/',
    },
    { label: 'github.com/helderberto', href: 'https://github.com/helderberto' },
  ],
  summary:
    'Senior Software Engineer with 15+ years building scalable web applications, specialized in frontend architecture. Expert in TypeScript, React, and modern frontend systems. At PagerDuty, drives frontend architecture strategy and technical decisions behind large-scale legacy-to-React migrations, and mentors engineers.',
  skills: [
    {
      group: 'Architecture',
      items: [
        'Frontend Architecture',
        'Design Systems',
        'Micro Frontends',
        'Technical Standards',
      ],
    },
    {
      group: 'Frontend',
      items: [
        'TypeScript',
        'JavaScript',
        'React',
        'Redux',
        'Next.js',
        'React Native',
        'CSS',
      ],
    },
    {
      group: 'Testing',
      items: [
        'Jest',
        'Vitest',
        'React Testing Library',
        'Cypress',
        'Playwright',
      ],
    },
    {
      group: 'AI Tools',
      items: [
        'Cursor',
        'Claude Code & Cowork',
        'GitHub Copilot',
        'Spec-driven Development',
      ],
    },
    {
      group: 'Tooling',
      items: ['Vite', 'Node.js', 'GraphQL', 'Docker', 'CI/CD'],
    },
  ] satisfies SkillGroup[],
  experience: [
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
      location: 'São Paulo, Brazil (Remote)',
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
  ] satisfies Experience[],
  education: [
    {
      program: 'Information Systems',
      school: 'Esucri',
      location: 'Criciúma, Brazil',
      period: '2009 - 2012',
    },
  ],
  languages: [
    { name: 'Portuguese', level: 'Native' },
    { name: 'English', level: 'Fluent, Professional' },
  ],
} as const;

const jobs = resume.experience.map((job) => ({
  ...job,
  positions: job.positions ?? [],
  bullets: job.bullets ?? [],
  tech: job.tech ?? [],
}));

export type Job = (typeof jobs)[number];

export const detailedExperience = jobs.filter(
  (job) => job.positions.length > 0 || job.bullets.length > 0,
);

export const earlierExperience = jobs.filter(
  (job) => job.positions.length === 0 && job.bullets.length === 0,
);

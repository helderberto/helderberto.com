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
        'Scalable Web Applications',
      ],
    },
    {
      group: 'Languages & Frameworks',
      items: [
        'TypeScript',
        'JavaScript',
        'React',
        'Redux',
        'Next.js',
        'React Native',
        'HTML',
      ],
    },
    {
      group: 'Styling',
      items: ['CSS', 'CSS Modules', 'CSS-in-JS (Emotion)'],
    },
    {
      group: 'AI Tools',
      items: [
        'Cursor',
        'Claude Code & Cowork',
        'ChatGPT',
        'GitHub Copilot',
        'Spec-driven Development',
      ],
    },
    {
      group: 'Testing',
      items: [
        'Jest',
        'Vitest',
        'Cypress',
        'Playwright',
        'React Testing Library',
      ],
    },
    {
      group: 'Backend & Data',
      items: ['Node.js', 'GraphQL', 'PHP', 'MySQL', 'PostgreSQL', 'MongoDB'],
    },
    {
      group: 'Tooling & Practices',
      items: [
        'Git',
        'Docker',
        'CI/CD',
        'ESLint',
        'Prettier',
        'Scrum',
        'Kanban',
      ],
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
            'Serve on the Frontend Architecture Strategy Team within the Frontend Platform org, defining technology standards and UI building patterns adopted across product teams.',
            'Drive architectural decisions behind large-scale migrations from legacy frameworks (Ember, Backbone) to React.',
            'Architect and deliver highly scalable frontend applications and mentor engineers on architecture and technical strategy.',
          ],
        },
        {
          level: 'Senior Software Engineer (SDE III), Frontend',
          period: 'Jul. 2022 - Jul. 2024',
          bullets: [
            'Architected and delivered web applications for incident management on the Incident Management Services team.',
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
        'Developed the back-office platform end to end, from micro-frontend React modules to GraphQL backends-for-frontends (Apollo).',
        'Co-led frontend development of the CMS for Farfetch Platform Solutions.',
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
        'Architected complex web and mobile (React Native) UI systems.',
        'Mentored colleagues and facilitated knowledge sharing across a chapter of ~20 frontend engineers.',
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
      role: 'Founder & CTO',
      company: 'Applann Digital',
      location: 'Brazil (Remote)',
      period: 'Oct. 2016 - Oct. 2018',
      bullets: [
        'Developed full-stack applications hands-on while hiring and leading contractor teams through full project lifecycles.',
        'Handled client relations, project planning, and business development.',
      ],
      tech: ['JavaScript', 'Angular', 'Ionic', 'PHP', 'CakePHP', 'WordPress'],
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
      status: 'not completed',
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

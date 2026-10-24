import type { SkillGroup } from '@/types/resume';
import { experience } from './resume-experience';

export const resume = {
  name: 'Helder Burato Berto',
  headline: 'Senior Software Engineer, Frontend',
  location: 'Braga, Portugal',
  phone: '+351 910 160 926',
  email: 'hello@helderberto.com',
  links: [
    { label: 'helderberto.com', href: 'https://helderberto.com' },
    {
      label: 'linkedin.com/in/helderberto',
      href: 'https://www.linkedin.com/in/helderberto/',
    },
    { label: 'github.com/helderberto', href: 'https://github.com/helderberto' },
  ],
  summary:
    'Senior Software Engineer with 15+ years across agencies, consultancies, and product platforms, the last decade focused on frontend architecture for large-scale React/TypeScript applications. Previously founded and ran a software company. A decade of remote work with distributed teams in Brazil, the US, and Europe.',
  skills: [
    {
      group: 'Architecture',
      items: [
        'Frontend Architecture',
        'Legacy Modernization',
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
      items: [
        'Vite',
        'Node.js',
        'GraphQL',
        'Docker',
        'CI/CD (GitHub Actions, Buildkite)',
      ],
    },
    {
      group: 'Observability',
      items: ['DataDog', 'BugSnag'],
    },
  ] satisfies SkillGroup[],
  experience,
  education: [
    {
      program: 'Coursework in Information Systems',
      school: 'Esucri',
      location: 'Criciúma, Brazil',
      period: '2009 - 2012',
    },
  ],
  certifications: [
    {
      name: 'AI Coding for Real Engineers',
      issuer: 'AIhero',
      issued: 'Jul. 2026',
      href: 'https://res.cloudinary.com/total-typescript/image/upload/v1782990632/certificate/c42ed24f-c7de-4511-a178-d1c4a9386432/ai-coding-for-real-engineers-m0k0w.png',
    },
    {
      name: 'Claude Code in Action',
      issuer: 'Anthropic',
      issued: 'Mar. 2026',
      href: 'https://verify.skilljar.com/c/923kypaztd7s',
    },
    {
      name: 'PagerDuty Foundational Practitioner Certification',
      issuer: 'PagerDuty',
      issued: 'Sep. 2022',
      href: 'https://www.credly.com/badges/2bfe6577-a2f2-45e3-9a22-5147e2865f69/linked_in_profile',
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

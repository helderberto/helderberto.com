# helderberto.com

[![Vercel](https://img.shields.io/badge/vercel-deployed-brightgreen)](https://helderberto.com)

Personal blog built with Next.js, TypeScript, and CSS Modules.

## Requirements

- Node.js 24+

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev    # development server (localhost:3000)
npm run build  # production build
npm run start  # production server
npm run lint   # ESLint
```

## Posts

Add markdown files to `posts/` with frontmatter:

```markdown
---
title: 'Post Title'
date: 'YYYY-MM-DD'
excerpt: 'Brief description'
---
```

## Resume

A printable resume lives at `/resume`, rendered from a single source of truth:
`src/data/resume.ts`. Edit that file to update contact details, add an
experience, or reorder skills.

Jobs with no `bullets` and no `positions` render as compact "earlier roles" at
the end of the Experience section; add either field to promote one to a full
entry.

The page is black and white and prints to A4 portrait via the browser's print
dialog. `vercel.json` rewrites `resume.helderberto.com` to `/resume`; the
subdomain itself is added in the Vercel dashboard (Settings → Domains).

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## License

[MIT License](LICENSE) © [Helder Burato Berto](https://helderberto.com)

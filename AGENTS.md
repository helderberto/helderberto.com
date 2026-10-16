# AGENTS.md

Personal blog. Next.js 16 App Router, React 19, TypeScript, CSS Modules. Deployed to Vercel as a static export.

## Check

Run before every commit. All must pass with no warnings in the output.

```bash
npm run lint && npx tsc --noEmit && npm run test:coverage && npm run build
```

Coverage below 80% on lines, functions, branches or statements fails `test:coverage`.

## Testing

Vitest, React Testing Library and jsdom, with Istanbul coverage. Tests sit next to the source as `*.test.ts(x)`.

### Mocking

- Spy on your own code with `vi.spyOn`, e.g. `vi.spyOn(posts, 'getPostBySlug')` after `import * as posts from '@/lib/posts'`, or `vi.spyOn(fs, 'readFileSync')`.
- Use `vi.mock` only for third-party packages, and only when needed: `next/navigation`, `next-themes`, `@giscus/react`, `next/og`, `next/font/google`, `@vercel/*`.
- Never `vi.mock` a project module.
- Stub browser globals with `vi.stubGlobal`: `navigator`, `matchMedia`, `open`, `print`, and anything else on `window`.
- Don't use `Object.defineProperty` or `vi.spyOn` on `window` or `navigator`.
- Mocks, globals and env vars reset after each test (`restoreMocks`, `unstubGlobals`, `unstubEnvs`). Don't reset them by hand.
- Missing jsdom APIs used by several files belong in `vitest.setup.ts`, applied only when missing.

### Writing tests

- Test behavior, not implementation. Don't assert on mocked behavior.
- Query by role first, then label, then text. Avoid test ids and `container.querySelector`.
- Simulate interactions with `userEvent`, using the `user` from `userEvent.setup()`, not `fireEvent`.
- Order each file: rendering, then user interactions, then edge cases.
- Don't write snapshot tests.
- Every test must fail when its behavior breaks. Check this by breaking the source once, then restore it.
- Fixing a bug: write a failing regression test first.
- Async server components: `render(await Page({ params: Promise.resolve({ slug }) }))`.
- Dates: stub `TZ` to a non-UTC zone with `vi.stubEnv` to catch off-by-one-day bugs.
- Fake timers: use `vi.useFakeTimers({ shouldAdvanceTime: true })`. Plain fake timers make Testing Library's async helpers hang.
- jsdom hides unhandled promise rejections. Assert that the promise gets a rejection handler instead.

## Next.js

- Use the docs bundled with the installed version in `node_modules/next/dist/docs/` as the source of truth, not memory.
- `output: 'export'`: no server features. Route handlers need `force-static`. Dynamic routes need `generateStaticParams`. Use `npm start`, which serves `out/`, not `next start`.
- Host rewrites and headers go in `vercel.json`, not `next.config.js`.
- `next-env.d.ts` is generated and gitignored. Never commit it.
- Node 24 defines `navigator`, so `typeof navigator` checks run during the build too. Read browser-only values with `useSyncExternalStore` and a fixed server snapshot.
- Format calendar dates (`YYYY-MM-DD`) with `timeZone: 'UTC'` and read years with `getUTCFullYear()`.
- Mark a component `'use client'` only when it needs interactivity. Markdown renders on the server.

## UI

- Use the design tokens in `src/app/globals.css`, with light values in `:root` and dark values in `.dark`.
- Prefer CSS over JS. Add client JS only when CSS can't do it.
- Respect `prefers-reduced-motion`.
- Use semantic HTML first and ARIA as a last resort. Keep focus visible, and make everything keyboard reachable.
- For UI changes, compare the built `out/` HTML against a baseline build (text, meta, JSON-LD). Every difference must be intended.

## Git

- Conventional commits, one concern per commit.
- Work on feature branches. Never push to `main`.

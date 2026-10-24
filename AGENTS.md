# AGENTS.md

Personal blog. Next.js 16 App Router, React 19, TypeScript, CSS Modules. Deployed to Vercel as a static export.

## Check

Run before every commit. All must pass with no warnings in the output.

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

Coverage below 80% on lines, functions, branches or statements fails `test:coverage`. CI (`.github/workflows/ci.yml`) runs the same steps on every PR and push to `main`. Vercel deploys previews itself.

## Structure

```
src/
├── app/          routes: load data, set metadata, render a view
├── views/        one view per page, composing features and components
├── features/     about, command-palette, markdown, posts, resume, theme
├── components/   shared UI, imported from '@/components'
├── hooks/        hooks shared across features
├── types/        domain types and DTOs (post, heading, resume)
├── utils/        helpers shared by two or more features (none yet)
├── lib/          one wrapper per third-party library
└── config/       site config and shared metadata
```

- Import a feature only through its `index.ts` (`@/features/posts`), shared UI through `@/components`, and third-party libraries through `@/lib/<library>`. Next.js and React are imported directly.
- Kebab-case file names, named exports. Default exports only where Next.js requires them (`page.tsx`, `layout.tsx`, route files).
- Every implementation file has a sibling test; barrels and type-only files don't.
- External data gets a DTO type in `src/types` and a mapper to the domain type in its feature (`PostFrontmatterDto` → `toPost` in `features/posts/post-mapper.ts`). The rest of the app sees domain types only.
- A helper used by one feature lives in that feature (`features/posts/format-post-date.ts`). Move it to `src/utils/` when a second feature needs it.
- Functions take at most two parameters; pass an options object beyond that.
- ESLint enforces braces on every `if`, two parameters and 200 lines per file (`curly`, `max-params`, `max-lines`). Split a file by concern before it gets there, keeping its import path.
- Next.js conventions win where they collide with these rules: default exports and fixed names for route files.

## Testing

Vitest, React Testing Library and jsdom, with Istanbul coverage. Tests sit next to the source as `*.test.ts(x)` and import Testing Library from `@/lib/testing-library`.

### Mocking

- Spy on your own code with `vi.spyOn`, e.g. `vi.spyOn(posts, 'getPostBySlug')` after `import * as posts from '@/features/posts'`, or `vi.spyOn(fs, 'readFileSync')`.
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
- Colors are always CSS variables. Never write a color literal in a component or CSS module: add or reuse a token, deriving new ones from existing tokens with `color-mix()` so both themes follow.
- Use `rem` for font sizes, spacing and other lengths (`0.0625rem` for hairlines), so the layout follows the reader's text size. The printed resume keeps `pt` and `mm` for its A4 page.
- Plain CSS: CSS Modules per component, global tokens in `globals.css`. No CSS-in-JS or utility frameworks.
- Prefer CSS over JS. Add client JS only when CSS can't do it.
- Respect `prefers-reduced-motion`.
- Fonts are the system stack (`--font-sans`). Don't add web fonts.
- Use semantic HTML first and ARIA as a last resort. Keep focus visible, and make everything keyboard reachable.
- For UI changes, compare the built `out/` HTML against a baseline build (text, meta, JSON-LD). Every difference must be intended.

## Diagrams

Posts render ` ```mermaid ` fences as static, theme-aware SVG with no client JS (`src/features/markdown/mermaid.tsx`). Diagram colors are the `--diagram-*` tokens in `globals.css`: restyle there, no re-render needed.

- After adding or editing a diagram, run `npm run diagrams`. It renders each block to `diagrams/<hash>.svg` in a headless browser, measuring labels with Inter (about as wide as the system fonts readers get; labels are centered and box padding absorbs the difference), and deletes unused files. Commit the SVGs: the build inlines them, and `src/features/markdown/diagrams.test.ts` fails when one is missing or stale. First run on a machine: `npx playwright install chromium`.
- Use a diagram only for branches, loops or groups. A straight sequence stays a list or a sentence.
- Keep a diagram about 400px wide or less so it fits a phone without scrolling: at most about 6 boxes per row or column, with short labels.
- Group long flows into `subgraph`s with `direction TB`, laid out `LR`. Link the subgraphs to each other, not the nodes inside them: an edge into a subgraph's node makes Mermaid ignore its direction.
- Always add `accTitle:` (shown as the caption) and `accDescr:` (read by screen readers). Put branches and loops in `accDescr` in words: screen readers don't announce arrows.
- Check new diagrams in the built site at 390px wide, light and dark.

## Git

- Conventional commits, one concern per commit.
- Work on feature branches. Never push to `main`.

## Pull requests

- Keep PRs small: one concern each, ideally under ~400 changed lines excluding lockfiles and generated files. Split bigger work into stacked PRs, each based on the branch below it, and say so in Context.
- Title is a conventional commit (`feat(posts): …`).
- Fill every section of `.github/pull_request_template.md`: Context (why), Summary (what), Evidence, Merge danger.
- Evidence shows before and after: screenshots for UI changes (390px and desktop, light and dark), test output, or measurements such as bytes, timings or contrast. Never invent evidence; say what you couldn't verify.
- Add a mermaid diagram to the Summary when a flow, branch or structure is easier to see than to read. Keep it small and mark what changed.

// Renders every ```mermaid block in posts/ to diagrams/<hash>.svg, so pages
// ship static SVG and readers run no diagram JavaScript.
// Usage: npm run diagrams
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { chromium } from 'playwright';

const root = join(import.meta.dirname, '..');
const postsDir = join(root, 'posts');
const outDir = join(root, 'diagrams');
const require = createRequire(import.meta.url);

// Keep in sync with src/features/markdown/diagrams.ts. diagrams.test.ts fails if they drift.
const hash = (source) =>
  createHash('sha256').update(source.trim()).digest('hex').slice(0, 12);
const blocks = (markdown) =>
  [...markdown.matchAll(/^```mermaid\n([\s\S]*?)\n```$/gm)].map((m) => m[1]);

// Render with placeholder colors, then swap them for the --diagram-* tokens
// in src/app/globals.css, so one SVG follows both themes and restyling needs
// no re-render.
const tokens = {
  '#fe0001': '--diagram-surface',
  '#fe0002': '--diagram-node-bg',
  '#fe0003': '--diagram-text',
  '#fe0004': '--diagram-line',
  '#fe0005': '--diagram-node-border',
  '#fe0006': '--diagram-group-bg',
  '#fe0007': '--diagram-group-border',
  '#fe0008': '--diagram-group-text',
  '#fe0009': '--diagram-label-bg',
};
const color = Object.fromEntries(
  Object.entries(tokens).map(([hex, name]) => [name, hex]),
);

// Labels are measured with Inter, about as wide as the system fonts readers
// get, then drawn as centered SVG text in var(--font-sans). Box padding
// absorbs the small difference. Inter is only used here, never shipped.
const measureFont = 'Inter';

const config = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  htmlLabels: false,
  themeVariables: {
    background: color['--diagram-surface'],
    tertiaryColor: color['--diagram-surface'],
    mainBkg: color['--diagram-node-bg'],
    primaryColor: color['--diagram-node-bg'],
    secondaryColor: color['--diagram-node-bg'],
    primaryTextColor: color['--diagram-text'],
    nodeTextColor: color['--diagram-text'],
    textColor: color['--diagram-text'],
    primaryBorderColor: color['--diagram-node-border'],
    nodeBorder: color['--diagram-node-border'],
    lineColor: color['--diagram-line'],
    clusterBkg: color['--diagram-group-bg'],
    clusterBorder: color['--diagram-group-border'],
    titleColor: color['--diagram-group-text'],
    edgeLabelBackground: color['--diagram-label-bg'],
    fontFamily: measureFont,
    fontSize: '16px',
  },
  // Tighter than the defaults so diagrams fit a phone-width column.
  flowchart: {
    htmlLabels: false,
    nodeSpacing: 12,
    rankSpacing: 16,
    padding: 10,
    subGraphTitleMargin: { top: 6, bottom: 2 },
    diagramPadding: 4,
  },
};

function themed(svg) {
  let out = svg
    .replaceAll(measureFont, 'var(--font-sans)')
    // Rounded nodes and groups.
    .replace(
      /<rect class="basic label-container"/g,
      '<rect rx="8" ry="8" class="basic label-container"',
    )
    .replace(/(<g class="cluster"[^>]*>)<rect /g, '$1<rect rx="12" ry="12" ');
  // Mermaid draws edge label backgrounds at half opacity, so lines show
  // through the text.
  out = out.replaceAll(
    '.edgeLabel rect{opacity:0.5;',
    '.edgeLabel rect{opacity:1;',
  );
  for (const [hex, name] of Object.entries(tokens)) {
    const blue = parseInt(hex.slice(5), 16);
    out = out
      .replace(new RegExp(hex, 'gi'), `var(${name})`)
      .replace(
        new RegExp(`rgba\\(254,\\s*0,\\s*${blue},\\s*([\\d.]+)\\)`, 'g'),
        (_, alpha) =>
          `color-mix(in srgb, var(${name}) ${Number(alpha) * 100}%, transparent)`,
      );
  }
  // Mermaid derives this from the surface for contrast text.
  out = out.replace(/#01fffe/gi, 'var(--diagram-text)');
  const leftover = out.match(/#fe00[0-9a-f]{2}|rgba?\(\s*254,\s*0,/gi);
  if (leftover) throw new Error(`Unmapped theme colors: ${leftover}`);
  return out;
}

const sources = new Map();
for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
  for (const source of blocks(readFileSync(join(postsDir, file), 'utf8'))) {
    sources.set(hash(source), source);
  }
}

mkdirSync(outDir, { recursive: true });
const existing = new Set(
  readdirSync(outDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.svg'))
    .map((e) => e.name.replace(/\.svg$/, '')),
);

for (const name of existing) {
  if (!sources.has(name)) {
    rmSync(join(outDir, `${name}.svg`));
    console.log(`removed diagrams/${name}.svg`);
  }
}

const missing = [...sources].filter(([name]) => !existing.has(name));
if (missing.length) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=block">`,
  );
  await page.evaluate(() => document.fonts.load('16px Inter'));
  await page.addScriptTag({
    path: require.resolve('mermaid/dist/mermaid.min.js'),
  });
  for (const [name, source] of missing) {
    const svg = await page.evaluate(
      async ({ name, source, config }) => {
        window.mermaid.initialize(config);
        return (await window.mermaid.render(`mermaid-${name}`, source)).svg;
      },
      { name, source, config },
    );
    writeFileSync(join(outDir, `${name}.svg`), `${themed(svg)}\n`);
    console.log(`rendered diagrams/${name}.svg`);
  }
  await browser.close();
}

console.log(`${sources.size} diagram(s) up to date`);

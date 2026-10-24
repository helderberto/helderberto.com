import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const diagramsDirectory = path.join(process.cwd(), 'diagrams');

// Keep in sync with scripts/render-diagrams.mjs.
export function diagramHash(source: string) {
  return createHash('sha256').update(source.trim()).digest('hex').slice(0, 12);
}

export function mermaidBlocks(markdown: string) {
  return [...markdown.matchAll(/^```mermaid\n([\s\S]*?)\n```$/gm)].map(
    (match) => match[1],
  );
}

export function readDiagram(source: string) {
  const file = path.join(diagramsDirectory, `${diagramHash(source)}.svg`);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    throw new Error(
      `No rendered diagram for this mermaid block. Run \`npm run diagrams\`.\n${source}`,
    );
  }
}

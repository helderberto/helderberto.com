import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { diagramHash, diagramsDirectory, mermaidBlocks } from './diagrams';

const postsDirectory = path.join(process.cwd(), 'posts');

function postBlocks() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) =>
      mermaidBlocks(fs.readFileSync(path.join(postsDirectory, file), 'utf8')),
    );
}

function renderedNames() {
  if (!fs.existsSync(diagramsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(diagramsDirectory)
    .filter((file) => file.endsWith('.svg'))
    .map((file) => file.replace(/\.svg$/, ''));
}

describe('diagrams', () => {
  it('hashes a chart the same regardless of surrounding whitespace', () => {
    expect(diagramHash('\n  A --> B  \n')).toBe(diagramHash('A --> B'));
    expect(diagramHash('A --> B')).not.toBe(diagramHash('A --> C'));
  });

  it('finds only mermaid fences', () => {
    const markdown = [
      '```mermaid\nflowchart LR\n  A --> B\n```',
      '```js\nconst a = 1;\n```',
    ].join('\n\n');
    expect(mermaidBlocks(markdown)).toEqual(['flowchart LR\n  A --> B']);
  });

  it('has a rendered svg for every mermaid block in the posts', () => {
    const rendered = new Set(renderedNames());
    const missing = postBlocks().filter(
      (block) => !rendered.has(diagramHash(block)),
    );
    expect(missing, 'Run `npm run diagrams`').toEqual([]);
  });

  it('has no rendered svg left over from a removed or changed block', () => {
    const used = new Set(postBlocks().map(diagramHash));
    expect(
      renderedNames().filter((name) => !used.has(name)),
      'Run `npm run diagrams`',
    ).toEqual([]);
  });

  it('colors every rendered svg with tokens defined in globals.css', () => {
    const globals = fs.readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );
    for (const name of renderedNames()) {
      const svg = fs.readFileSync(
        path.join(diagramsDirectory, `${name}.svg`),
        'utf8',
      );
      const used = new Set(
        [...svg.matchAll(/var\((--diagram-[\w-]+)\)/g)].map((m) => m[1]),
      );
      expect(used.size).toBeGreaterThan(0);
      for (const token of used) {
        expect(globals).toContain(`${token}:`);
      }
      expect(svg).not.toMatch(/#fe00[0-9a-f]{2}|rgba?\(254, ?0,/i);
    }
  });
});

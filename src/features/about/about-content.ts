import { matter } from '@/lib/gray-matter';
import fs from 'fs';
import path from 'path';

export interface AboutContent {
  title?: string;
  body: string;
}

/** Reads content/about.md, promoting a leading `# heading` to the title. */
export function getAboutContent(): AboutContent {
  const aboutPath = path.join(process.cwd(), 'content', 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { content } = matter(fileContents);

  const trimmed = content.trimStart();
  const titleMatch = trimmed.match(/^#\s+(.+)\r?\n/);
  const title = titleMatch?.[1];
  const body = titleMatch ? trimmed.slice(titleMatch[0].length) : trimmed;

  return { title, body };
}

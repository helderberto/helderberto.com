import { parser, RuleType, type MarkdownToJSX } from '@/lib/markdown-to-jsx';
import type { Heading } from '@/types/heading';

function textOf(nodes: MarkdownToJSX.ASTNode[]): string {
  return nodes
    .map((node) => {
      if ('text' in node && typeof node.text === 'string') {
        return node.text;
      }
      if ('children' in node && Array.isArray(node.children)) {
        return textOf(node.children);
      }
      return '';
    })
    .join('');
}

export function getHeadings(markdown: string): Heading[] {
  return parser(markdown).flatMap((node) =>
    node.type === RuleType.heading && node.level === 2
      ? [{ id: node.id, text: textOf(node.children) }]
      : [],
  );
}

import Markdown from 'markdown-to-jsx';
import { CodeBlock } from './code-block';
import { HeadingAnchor } from './heading-anchor';
import { Mermaid } from './mermaid';

interface MarkdownContentProps {
  content: string;
}

// CodeBlock renders its own pre, so drop the one markdown-to-jsx adds.
function Unwrapped({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

// Fenced ```mermaid blocks become diagrams; everything else stays code.
function Code({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  if (/(?:^|\s)lang-mermaid(?:\s|$)/.test(className ?? '')) {
    return <Mermaid chart={String(children)} />;
  }
  return <CodeBlock className={className}>{children}</CodeBlock>;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Markdown
      options={{
        overrides: {
          pre: {
            component: Unwrapped,
          },
          code: {
            component: Code,
          },
          h2: {
            component: HeadingAnchor,
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
}

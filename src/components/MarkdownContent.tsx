import Markdown from 'markdown-to-jsx';
import { CodeBlock } from './CodeBlock';
import { HeadingAnchor } from './HeadingAnchor';

interface MarkdownContentProps {
  content: string;
}

// CodeBlock renders its own pre, so drop the one markdown-to-jsx adds.
function Unwrapped({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
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
            component: CodeBlock,
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

"use client";

import Markdown from "markdown-to-jsx";
import { CodeBlock } from "./CodeBlock";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Markdown
      options={{
        overrides: {
          code: {
            component: CodeBlock,
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
}

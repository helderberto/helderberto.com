import { readDiagram } from './diagrams';
import styles from './mermaid.module.css';

interface MermaidProps {
  chart: string;
}

// Diagrams this wide or wider can't fit a phone column at 75% text size.
const SCROLL_WIDTH = 400;

function viewBoxWidth(svg: string) {
  const width = Number(svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/)?.[1]);
  return Number.isFinite(width) && width > 0 ? width : undefined;
}

// Inlines the SVG that `npm run diagrams` rendered from this chart, so pages
// ship no diagram JavaScript.
export function Mermaid({ chart }: MermaidProps) {
  const svg = readDiagram(chart);
  const width = viewBoxWidth(svg);
  const title = chart.match(/^\s*accTitle:\s*(.+?)\s*$/m)?.[1];
  const captionId = `${svg.match(/id="([^"]+)"/)?.[1] ?? 'diagram'}-caption`;
  const scrollable = width !== undefined && width >= SCROLL_WIDTH;

  return (
    <figure
      className={styles.figure}
      aria-labelledby={title ? captionId : undefined}
    >
      <div
        className={styles.frame}
        style={
          width
            ? ({ '--diagram-width': `${width / 16}rem` } as React.CSSProperties)
            : undefined
        }
        {...(scrollable && {
          role: 'region',
          tabIndex: 0,
          'aria-label': `${title ?? 'Diagram'} (scrollable)`,
        })}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {title && (
        <figcaption id={captionId} className={styles.caption}>
          {title}
        </figcaption>
      )}
    </figure>
  );
}

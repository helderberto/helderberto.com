import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from './json-ld';

function renderScript(data: Record<string, unknown>) {
  const { container } = render(<JsonLd data={data} />);
  return container.querySelector('script[type="application/ld+json"]')!;
}

describe('JsonLd', () => {
  it('serializes data as JSON-LD', () => {
    const script = renderScript({ '@type': 'Person', name: 'Ada' });
    expect(JSON.parse(script.innerHTML)).toEqual({
      '@type': 'Person',
      name: 'Ada',
    });
  });

  it('escapes < so data cannot close the script tag', () => {
    const name = '</script><script>alert(1)</script>';
    const script = renderScript({ name });
    expect(script.innerHTML).not.toContain('<');
    expect(JSON.parse(script.innerHTML)).toEqual({ name });
  });
});

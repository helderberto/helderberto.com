'use client';

export function PrintButton() {
  return (
    <button type="button" className="rs-button" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}

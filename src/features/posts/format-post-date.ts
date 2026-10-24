const styles = {
  short: { day: '2-digit', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

/** Formats a `YYYY-MM-DD` date in UTC, so it keeps its day in every time zone. */
export function formatPostDate(date: string, style: keyof typeof styles) {
  return new Date(date).toLocaleDateString('en-US', {
    ...styles[style],
    timeZone: 'UTC',
  });
}

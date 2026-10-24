import { describe, expect, it } from 'vitest';
import { experience } from './resume-experience';

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

// "Oct. 2016 - Oct. 2018" → months since year 0 of the end date.
function endOf(period: string) {
  const end = period.split(' - ')[1];
  if (end === 'Present') {
    return Infinity;
  }
  const [month, year] = end.replace('.', '').split(' ');
  return Number(year) * 12 + months.indexOf(month);
}

function isNewestFirst(periods: string[]) {
  const ends = periods.map(endOf);
  return ends.every((end, index) => index === 0 || end <= ends[index - 1]);
}

describe('resume experience', () => {
  it('lists jobs newest first by end date', () => {
    expect(isNewestFirst(experience.map((job) => job.period))).toBe(true);
  });

  it('lists the positions within a job newest first', () => {
    for (const job of experience) {
      const periods = job.positions?.map((position) => position.period) ?? [];
      expect(isNewestFirst(periods)).toBe(true);
    }
  });
});

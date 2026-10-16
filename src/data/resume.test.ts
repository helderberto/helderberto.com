import { describe, expect, it } from 'vitest';
import { detailedExperience, earlierExperience } from './resume';

describe('resume experience', () => {
  it('splits jobs with details from earlier ones', () => {
    expect(detailedExperience.map((job) => job.company)).toEqual([
      'PagerDuty',
      'FARFETCH',
      'Cheesecake Labs',
      'D3',
    ]);
    expect(earlierExperience.map((job) => job.company)).toEqual([
      'Applann Digital',
      'Project Commerce',
      'Homeyou',
      'Virtualiza',
      'Burn web.studio',
    ]);
  });

  it('defaults missing lists to empty arrays', () => {
    const pagerDuty = detailedExperience[0];
    const farfetch = detailedExperience[1];

    expect(pagerDuty.bullets).toEqual([]);
    expect(farfetch.positions).toEqual([]);
    expect(earlierExperience[0]).toMatchObject({
      positions: [],
      bullets: [],
    });
  });
});

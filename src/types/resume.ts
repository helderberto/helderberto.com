export type Position = {
  level: string;
  period: string;
  bullets: string[];
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  positions?: Position[];
  bullets?: string[];
  tech?: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

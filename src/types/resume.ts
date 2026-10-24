export interface Position {
  level: string;
  period: string;
  bullets: string[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  positions?: Position[];
  bullets?: string[];
  tech?: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

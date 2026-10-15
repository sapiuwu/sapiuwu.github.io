export type Side = "engineer" | "analyst";
export type Lang = "id" | "en";

export interface Localized {
  id: string;
  en: string;
}

export interface SkillGroup {
  title: Localized;
  items: { name: string; level: number }[];
}

export interface Project {
  title: Localized;
  description: Localized;
  tags: string[];
  link: string;
}

export interface Experience {
  role: Localized;
  company: string;
  period: Localized;
  description: Localized;
}

export interface Stat {
  value: string;
  label: Localized;
}

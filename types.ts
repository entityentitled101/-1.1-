export enum CharacterRole {
  PROTAGONIST = "Protagonist",
  ANTAGONIST = "Antagonist",
  SUPPORTING = "Supporting",
  BACKGROUND = "Background"
}

export enum WorldviewType {
  MODERN_CYBER = "Modern / Cyber_Realism",
  HIGH_FANTASY = "High Fantasy / D&D",
  POST_APOCALYPTIC = "Post Apocalyptic",
  CUSTOM = "Custom / Unspecified"
}

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  worldview: WorldviewType;
  race: string; // e.g., Elf, Human, Orc
  characterClass: string; // Renamed from 'class' to avoid keyword conflict
  faction?: string;
  description: string;
  appearance: string;
  imageUrl?: string;
  tags: string[];
  relationships: Relationship[];
  lastUpdated: number;
}

export interface Relationship {
  targetId: string;
  type: string; // e.g., "Sibling", "Enemy", "Lover"
  intensity: number; // 0-100 for heatmap
}

export interface Location {
  id: string;
  name: string;
  type: string; // e.g. "City", "Dungeon", "Space Station"
  worldview: WorldviewType;
  coordinates: string;
  population: string;
  description: string;
  history: string;
  culture: string;
  imageUrl?: string;
  residents: string[]; // List of Character IDs currently here
}

export type ThemeMode = 'dark' | 'light';

export const SAMPLE_TAGS = [
  "Magic User", "Royal Guard", "Outlaw", "Divine", "Cursed", "Merchant", "Assassin", "Hacker", "Corporate"
];
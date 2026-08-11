import data from '../data/units.json';

export type Faction = 'Aeon' | 'UEF' | 'Cybran' | 'Seraphim';

export interface Unit {
  id: string;
  name: string;
  desc: string;
  faction: Faction;
  tech: string; // T1 | T2 | T3 | Experimental | Commander
  techRank: number;
  type: 'Unit' | 'Building';
  domain: string; // Land | Air | Naval | Amphibious
  weapon: string[];
  produces: string[];
  role: string[];
  mass: number;
  energy: number;
  hp: number;
  buildTime: number;
  abilities: string[];
}

export const UNITS = (data as unknown as Unit[]).slice();

export const FACTION_COLOR: Record<Faction, string> = {
  Aeon: '#7ad7c4',
  UEF: '#5fa8ff',
  Cybran: '#ff5d5d',
  Seraphim: '#ffc24d',
};

export function findById(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

// Unit build-icon, served same-origin from public/icons/ (populated by
// scripts/fetch-icons.mjs from the FAForever UnitDB repo). Self-hosting avoids
// jsDelivr rate limits, adblocker/tracking-protection blocks, and cross-origin
// canvas tainting. Falls back to a faction placeholder on error.
export function iconUrl(id: string): string {
  return `/icons/${id}.png`;
}

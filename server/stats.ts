/// <reference types="node" />
// Per-day solve counters for the daily and challenge, persisted in the same
// /data volume as the answer secret. Counting is best-effort: the client pings
// once per browser when it first solves (guarded by localStorage), so this is a
// rough "how many people solved today" tally, not an exact figure.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { todayKey } from '../src/lib/daily';
import type { Mode } from './answer';

export interface SolveCounts {
  daily: number;
  challenge: number;
}
type Store = Record<string, SolveCounts>;

const FILE = process.env.DAILY_STATS_FILE || '/data/stats.json';
const KEEP_DAYS = 60; // trim old days so the file can't grow without bound

let store: Store = loadStore();

function loadStore(): Store {
  try {
    if (existsSync(FILE)) return JSON.parse(readFileSync(FILE, 'utf8')) as Store;
  } catch (err) {
    console.error('[daily-api] could not read stats, starting fresh:', err);
  }
  return {};
}

function persist(): void {
  try {
    mkdirSync(dirname(FILE), { recursive: true });
    writeFileSync(FILE, JSON.stringify(store));
  } catch (err) {
    console.error('[daily-api] could not write stats:', err);
  }
}

function prune(): void {
  const keys = Object.keys(store).sort();
  while (keys.length > KEEP_DAYS) delete store[keys.shift() as string];
}

export function statsFor(date: Date): SolveCounts {
  return store[todayKey(date)] ?? { daily: 0, challenge: 0 };
}

export function recordSolve(date: Date, mode: Mode): SolveCounts {
  const key = todayKey(date);
  const counts = store[key] ?? { daily: 0, challenge: 0 };
  counts[mode] += 1;
  store[key] = counts;
  prune();
  persist();
  return counts;
}

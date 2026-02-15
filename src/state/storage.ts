import { GameState } from './types';

const STORAGE_KEY = 'edh-tracker-state-v2';

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.version === 'number' &&
      Array.isArray(parsed.players) &&
      parsed.players.length >= 2
    ) {
      // Migrate: ensure commanderDamage exists on each player
      for (const p of parsed.players) {
        if (!p.commanderDamage) p.commanderDamage = {};
      }
      // Migrate: ensure commanderDamageSourceId exists
      if (parsed.commanderDamageSourceId === undefined) {
        parsed.commanderDamageSourceId = null;
      }
      return parsed as GameState;
    }
    return null;
  } catch {
    return null;
  }
}

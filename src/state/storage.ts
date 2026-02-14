import { GameState } from './types';

const STORAGE_KEY = 'edh-tracker-state';

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
      // Migrate old state that lacks visibleCount
      if (typeof parsed.visibleCount !== 'number') {
        parsed.visibleCount = parsed.players.length;
      }
      return parsed as GameState;
    }
    return null;
  } catch {
    return null;
  }
}

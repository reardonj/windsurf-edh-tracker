export type CounterType = 'poison' | 'radiation' | 'energy' | 'commander_casts';

export interface PlayerCounters {
  poison: number;
  radiation: number;
  energy: number;
  commander_casts: number;
}

export interface Player {
  id: string;
  life: number;
  colorIndex: number;
  commanderDamage: Record<string, number>;
  counters: PlayerCounters;
}

export interface GameState {
  version: number;
  players: Player[];
  visibleCount: number;
  selectedPlayerId: string | null;
  commanderDamageSourceId: string | null;
  activeCounterType: CounterType | null;
  activeCounterPlayerId: string | null;
}

export const STARTING_LIFE = 40;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const PLAYER_COLOR_COUNT = 6;

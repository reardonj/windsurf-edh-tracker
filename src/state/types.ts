export interface Player {
  id: string;
  life: number;
  colorIndex: number;
}

export interface GameState {
  version: number;
  players: Player[];
  visibleCount: number;
  selectedPlayerId: string | null;
}

export const STARTING_LIFE = 40;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const PLAYER_COLOR_COUNT = 6;

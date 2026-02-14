export interface Player {
  id: string;
  life: number;
  color: string;
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

export const PLAYER_COLORS = [
  '#e74c3c', // red
  '#3498db', // blue
  '#f39c12', // amber
  '#1abc9c', // teal
  '#2ecc71', // green
  '#9b59b6', // purple
];

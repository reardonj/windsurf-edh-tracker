import { Player } from '../state/types';
import PlayerTile from './PlayerTile';

interface PlayerGridProps {
  players: Player[];
  selectedPlayerId: string | null;
  onIncrement: (playerId: string, delta: number) => void;
}

/**
 * Determines the rotation (in degrees) for each player tile so the content
 * faces the nearest screen edge. The layout is always 2 rows:
 * - Top row tiles rotate 180° (face the top edge)
 * - Bottom row tiles stay at 0° (face the bottom edge)
 */
function getRotation(index: number, total: number): number {
  const cols = getColCount(total);
  const row = Math.floor(index / cols);

  if (total <= 1) return 0;
  if (row === 0) return 180;
  return 0;
}

function getColCount(total: number): number {
  if (total <= 2) return 1;
  if (total <= 4) return 2;
  return 3;
}

/**
 * Returns Tailwind grid classes for the given player count.
 * 2 players: 1 col, 2 rows
 * 3 players: 2 cols, 2 rows (last spans)
 * 4 players: 2 cols, 2 rows
 * 5 players: 3 cols, 2 rows (last spans 2 cols)
 * 6 players: 3 cols, 2 rows
 */
function getGridClass(count: number): string {
  switch (count) {
    case 2:
      return 'grid-cols-1 grid-rows-2';
    case 3:
      return 'grid-cols-2 grid-rows-2';
    case 4:
      return 'grid-cols-2 grid-rows-2';
    case 5:
      return 'grid-cols-6 grid-rows-2';
    case 6:
      return 'grid-cols-3 grid-rows-2';
    default:
      return 'grid-cols-2 grid-rows-2';
  }
}

function getTileSpanClass(index: number, total: number): string {
  // For 3 players: last tile spans 2 columns
  if (total === 3 && index === 2) return 'col-span-2';
  // For 5 players: use a 6-column grid so 3 top tiles get col-span-2 each,
  // and the 2 bottom tiles get col-span-3 each to center them.
  if (total === 5 && index < 3) return 'col-span-2';
  if (total === 5 && index >= 3) return 'col-span-3';
  return '';
}

export default function PlayerGrid({ players, selectedPlayerId, onIncrement }: PlayerGridProps) {
  return (
    <div className={`grid gap-1.5 p-1.5 flex-1 min-h-0 ${getGridClass(players.length)}`}>
      {players.map((player, i) => (
        <div key={player.id} className={`h-full ${getTileSpanClass(i, players.length)}`}>
          <PlayerTile
            player={player}
            isSelected={player.id === selectedPlayerId}
            rotation={getRotation(i, players.length)}
            onIncrement={(delta) => onIncrement(player.id, delta)}
          />
        </div>
      ))}
    </div>
  );
}

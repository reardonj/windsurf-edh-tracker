import { useRef, useEffect } from 'react';
import { Player } from '../state/types';

interface PlayerTileProps {
  player: Player;
  isSelected: boolean;
  rotation: number;
  onIncrement: (delta: number) => void;
}

export default function PlayerTile({ player, isSelected, rotation, onIncrement }: PlayerTileProps) {
  const topTimerRef = useRef<number | null>(null);
  const bottomTimerRef = useRef<number | null>(null);
  const topIntervalRef = useRef<number | null>(null);
  const bottomIntervalRef = useRef<number | null>(null);

  // For 180° tiles the screen top/bottom are flipped relative to the user's view
  const isFlipped = rotation === 180;
  const topDelta = isFlipped ? -1 : 1;
  const bottomDelta = isFlipped ? 1 : -1;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (topTimerRef.current) clearTimeout(topTimerRef.current);
      if (bottomTimerRef.current) clearTimeout(bottomTimerRef.current);
      if (topIntervalRef.current) clearInterval(topIntervalRef.current);
      if (bottomIntervalRef.current) clearInterval(bottomIntervalRef.current);
    };
  }, []);

  const handleTopStart = () => {
    // Start 1s delay timer
    topTimerRef.current = setTimeout(() => {
      // First increment of +5 after 1s, then start repeating +5 every 1s
      onIncrement(topDelta * 5);
      topIntervalRef.current = setInterval(() => {
        onIncrement(topDelta * 5);
      }, 1000);
      topTimerRef.current = null; // Clear timeout ref
    }, 1000);
  };

  const handleBottomStart = () => {
    // Start 1s delay timer
    bottomTimerRef.current = setTimeout(() => {
      // First increment of +5 after 1s, then start repeating +5 every 1s
      onIncrement(bottomDelta * 5);
      bottomIntervalRef.current = setInterval(() => {
        onIncrement(bottomDelta * 5);
      }, 1000);
      bottomTimerRef.current = null; // Clear timeout ref
    }, 1000);
  };

  const handleTopEnd = () => {
    // Clear timeout if still active (user released before 1s)
    if (topTimerRef.current) {
      clearTimeout(topTimerRef.current);
      topTimerRef.current = null;
      // Increment once on release
      onIncrement(topDelta);
    }
    // Clear interval if active
    if (topIntervalRef.current) {
      clearInterval(topIntervalRef.current);
      topIntervalRef.current = null;
    }
  };

  const handleBottomEnd = () => {
    // Clear timeout if still active (user released before 1s)
    if (bottomTimerRef.current) {
      clearTimeout(bottomTimerRef.current);
      bottomTimerRef.current = null;
      // Increment once on release
      onIncrement(bottomDelta);
    }
    // Clear interval if active
    if (bottomIntervalRef.current) {
      clearInterval(bottomIntervalRef.current);
      bottomIntervalRef.current = null;
    }
  };

  return (
    <div
      className="relative flex items-center justify-center rounded-2xl select-none overflow-hidden h-full"
      style={{ backgroundColor: player.color }}
    >
      {/* Rotated content wrapper */}
      <div
        className="flex flex-col items-center justify-center w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <span className="pointer-events-none text-white/40 text-xl font-bold">+</span>
        <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-white drop-shadow-lg tabular-nums leading-none py-2">
          {player.life}
        </span>
        <span className="pointer-events-none text-white/40 text-xl font-bold">−</span>
      </div>

      {/* Selection highlight — persistent ring + 3x pulse */}
      {isSelected && (
        <>
          <div
            className="absolute inset-0 rounded-2xl border-4 border-yellow-300 pointer-events-none z-20"
            style={{ animation: 'fade-in 150ms ease-out forwards' }}
          />
          <div
            className="absolute inset-0 rounded-2xl bg-white/50 pointer-events-none z-20"
            style={{ animation: 'pulse-3x 1200ms ease-in-out 2 forwards' }}
          />
        </>
      )}

      {/* Divider line — rotated with content */}
      <div
        className="absolute pointer-events-none w-full border-t border-white/10"
        style={{ top: '50%' }}
      />

      {/* Tap zones — NOT rotated, use computed deltas */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 opacity-0 active:opacity-10 active:bg-white cursor-pointer z-10"
        onMouseDown={handleTopStart}
        onMouseUp={handleTopEnd}
        onMouseLeave={handleTopEnd}
        onTouchStart={handleTopStart}
        onTouchEnd={handleTopEnd}
        aria-label={topDelta > 0 ? 'Increase life' : 'Decrease life'}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-0 active:opacity-10 active:bg-white cursor-pointer z-10"
        onMouseDown={handleBottomStart}
        onMouseUp={handleBottomEnd}
        onMouseLeave={handleBottomEnd}
        onTouchStart={handleBottomStart}
        onTouchEnd={handleBottomEnd}
        aria-label={bottomDelta > 0 ? 'Increase life' : 'Decrease life'}
      />
    </div>
  );
}

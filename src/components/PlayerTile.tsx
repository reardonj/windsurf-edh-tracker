import { useRef, useEffect } from 'react';
import { Swords, Droplet, Zap, Crown, Radiation } from 'lucide-react';
import { Player, CounterType } from '../state/types';
import CounterButton from './CounterButton';

interface PlayerTileProps {
  player: Player;
  isSelected: boolean;
  rotation: number;
  commanderDamageSourceId: string | null;
  activeCounterType: CounterType | null;
  activeCounterPlayerId: string | null;
  onIncrement: (delta: number) => void;
  onToggleCommanderDamage: () => void;
  onToggleCounter: (counterType: CounterType) => void;
}

const holdTimeout = 750;

export default function PlayerTile({ player, isSelected, rotation, commanderDamageSourceId, activeCounterType, activeCounterPlayerId, onIncrement, onToggleCommanderDamage, onToggleCounter }: PlayerTileProps) {
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
      }, holdTimeout);
      topTimerRef.current = null; // Clear timeout ref
    }, holdTimeout);
  };

  const handleBottomStart = () => {
    // Start 1s delay timer
    bottomTimerRef.current = setTimeout(() => {
      // First increment of +5 after 1s, then start repeating +5 every 1s
      onIncrement(bottomDelta * 5);
      bottomIntervalRef.current = setInterval(() => {
        onIncrement(bottomDelta * 5);
      }, holdTimeout);
      bottomTimerRef.current = null; // Clear timeout ref
    }, holdTimeout);
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
      style={{ backgroundColor: `var(--player-color-${player.colorIndex})` }}
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
          {commanderDamageSourceId && commanderDamageSourceId !== player.id ? (
            player.commanderDamage[commanderDamageSourceId] ?? 0
          ) : (activeCounterType && activeCounterPlayerId === player.id) ? (
            player.counters[activeCounterType] ?? 0
          ) : (player.life)}
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

      {/* Commander damage lowlight */}
      {(commanderDamageSourceId && commanderDamageSourceId == player.id) && (
        <>
          <div
            className="absolute inset-0 rounded-2xl bg-black/30 pointer-events-none z-20"
          />
        </>
      )}

      {/* Counter lowlight for other players */}
      {activeCounterPlayerId && activeCounterPlayerId !== player.id && (
        <>
          <div
            className="absolute inset-0 rounded-2xl bg-black/30 pointer-events-none z-20"
          />
        </>
      )}


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

      <div
        className="absolute flex flex-col items-center justify-center w-full h-full pointer-events-none z-30"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Counter buttons - left side */}
        <div className="absolute left-4 flex flex-col gap-2">
          <CounterButton
            counterType="commander_casts"
            icon={Crown}
            count={player.counters.commander_casts}
            playerId={player.id}
            activeCounterType={activeCounterType}
            activeCounterPlayerId={activeCounterPlayerId}
            commanderDamageSourceId={commanderDamageSourceId}
            onToggle={onToggleCounter}
          />
          <CounterButton
            counterType="energy"
            icon={Zap}
            count={player.counters.energy}
            playerId={player.id}
            activeCounterType={activeCounterType}
            activeCounterPlayerId={activeCounterPlayerId}
            commanderDamageSourceId={commanderDamageSourceId}
            onToggle={onToggleCounter}
          />
          <CounterButton
            counterType="poison"
            icon={Droplet}
            count={player.counters.poison}
            playerId={player.id}
            activeCounterType={activeCounterType}
            activeCounterPlayerId={activeCounterPlayerId}
            commanderDamageSourceId={commanderDamageSourceId}
            onToggle={onToggleCounter}
          />
          <CounterButton
            counterType="radiation"
            icon={Radiation}
            count={player.counters.radiation}
            playerId={player.id}
            activeCounterType={activeCounterType}
            activeCounterPlayerId={activeCounterPlayerId}
            commanderDamageSourceId={commanderDamageSourceId}
            onToggle={onToggleCounter}
          />
        </div>

        {/* Commander damage toggle button - right side */}
        <button
          className={`absolute middle-2 right-4 p-4 rounded-2xl transition-colors pointer-events-auto cursor-pointer ${commanderDamageSourceId === player.id
            ? 'bg-white/30 text-white'
            : commanderDamageSourceId || activeCounterPlayerId
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white/20 text-white hover:bg-white/50 hover:text-white/70'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!commanderDamageSourceId && !activeCounterPlayerId) {
              onToggleCommanderDamage();
            } else if (commanderDamageSourceId === player.id) {
              onToggleCommanderDamage();
            }
          }}
          disabled={(!!commanderDamageSourceId && commanderDamageSourceId !== player.id) || !!activeCounterPlayerId}
          aria-label="Toggle commander damage"
        >
          <Swords size={32} />
        </button>
      </div>
    </div>
  );
}

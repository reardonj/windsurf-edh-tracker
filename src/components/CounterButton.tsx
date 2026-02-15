import { LucideIcon } from 'lucide-react';
import { CounterType } from '../state/types';

interface CounterButtonProps {
  counterType: CounterType;
  icon: LucideIcon;
  count: number;
  playerId: string;
  activeCounterType: CounterType | null;
  activeCounterPlayerId: string | null;
  commanderDamageSourceId: string | null;
  onToggle: (counterType: CounterType) => void;
}

export default function CounterButton({
  counterType,
  icon: Icon,
  count,
  playerId,
  activeCounterType,
  activeCounterPlayerId,
  commanderDamageSourceId,
  onToggle,
}: CounterButtonProps) {
  const isThisPlayerActiveForCounter = activeCounterPlayerId === playerId;
  const isAnotherPlayerActiveForCounter = activeCounterPlayerId !== null && !isThisPlayerActiveForCounter;
  const isActive = activeCounterType === counterType && isThisPlayerActiveForCounter;
  const isDisabled = isAnotherPlayerActiveForCounter || !!commanderDamageSourceId || (activeCounterType !== counterType && isThisPlayerActiveForCounter);

  return (
    <div className="flex items-center gap-2">
      <button
        className={`p-4 rounded-xl transition-colors pointer-events-auto cursor-pointer ${isActive
            ? 'bg-white/50 text-white'
            : isDisabled
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white/20 text-white hover:bg-white/50 hover:text-white/70'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled || isActive) {
            onToggle(counterType);
          }
        }}
        disabled={isDisabled && !isActive}
        aria-label={`Toggle ${counterType} counter`}
      >
        <Icon size={24} />
      </button>
      {count > 0 && (
        <span className="text-2xl font-bold text-white drop-shadow-lg tabular-nums pointer-events-none">
          {count}
        </span>
      )}
    </div>
  );
}

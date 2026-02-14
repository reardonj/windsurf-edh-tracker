import { useState } from 'react';
import { UserPlus, UserMinus, Dices, RotateCcw } from 'lucide-react';
import { MAX_PLAYERS, MIN_PLAYERS } from '../state/types';

interface TopBarProps {
  playerCount: number;
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onRandomPlayer: () => void;
  onReset: () => void;
}

export default function TopBar({
  playerCount,
  onAddPlayer,
  onRemovePlayer,
  onRandomPlayer,
  onReset,
}: TopBarProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const btnClass =
    'w-full flex-1 flex items-center justify-center rounded-lg text-2xl transition-colors disabled:opacity-30';

  return (
    <>
      <div className="flex flex-col items-stretch gap-1.5 p-1.5 pe-0 shrink-0 w-10">
        <button
          className={`${btnClass} bg-gray-700 hover:bg-gray-600 text-white`}
          onClick={onAddPlayer}
          disabled={playerCount >= MAX_PLAYERS}
          aria-label="Add player"
        >
          <span className="-rotate-90"><UserPlus size={22} /></span>
        </button>
        <button
          className={`${btnClass} bg-gray-700 hover:bg-gray-600 text-white`}
          onClick={onRemovePlayer}
          disabled={playerCount <= MIN_PLAYERS}
          aria-label="Remove player"
        >
          <span className="-rotate-90"><UserMinus size={22} /></span>
        </button>
        <button
          className={`${btnClass} bg-sky-600 hover:bg-sky-500 text-white`}
          onClick={onRandomPlayer}
          aria-label="Random player"
        >
          <span className="-rotate-90"><Dices size={22} /></span>
        </button>
        <button
          className={`${btnClass} bg-rose-600 hover:bg-rose-500 text-white`}
          onClick={() => setShowConfirm(true)}
          aria-label="Reset game"
        >
          <span className="-rotate-90"><RotateCcw size={22} /></span>
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl text-center max-w-xs mx-4">
            <p className="text-lg font-semibold text-white mb-4">
              Reset all life totals to 40?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium"
                onClick={() => {
                  onReset();
                  setShowConfirm(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

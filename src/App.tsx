import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, createInitialState } from './state/reducer';
import { saveState, loadState } from './state/storage';
import TopBar from './components/TopBar';
import PlayerGrid from './components/PlayerGrid';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    const saved = loadState();
    return saved ?? createInitialState(4);
  });

  // Persist state to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleIncrement = useCallback(
    (playerId: string, delta: number) => {
      dispatch({ type: 'CLEAR_SELECTION' });
      dispatch({ type: 'INCREMENT_LIFE', playerId, delta });
    },
    [],
  );

  return (
    <div className="flex flex-row h-full w-full">
      <TopBar
        playerCount={state.visibleCount}
        onAddPlayer={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'ADD_PLAYER' })
        }}
        onRemovePlayer={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'REMOVE_PLAYER' })
        }}
        onRandomPlayer={() => dispatch({ type: 'SELECT_RANDOM_PLAYER' })}
        onReset={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'RESET_GAME' })
        }}
      />
      <PlayerGrid
        players={state.players.slice(0, state.visibleCount)}
        selectedPlayerId={state.selectedPlayerId}
        onIncrement={handleIncrement}
      />
    </div>
  );
}

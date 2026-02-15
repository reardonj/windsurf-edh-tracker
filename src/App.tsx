import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, createInitialState } from './state/reducer';
import { saveState, loadState } from './state/storage';
import { CounterType } from './state/types';
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
      if (state.commanderDamageSourceId) {
        dispatch({
          type: 'INCREMENT_COMMANDER_DAMAGE',
          sourcePlayerId: state.commanderDamageSourceId,
          targetPlayerId: playerId,
          delta,
        });
      } else if (state.activeCounterType) {
        dispatch({
          type: 'INCREMENT_COUNTER',
          playerId,
          counterType: state.activeCounterType,
          delta,
        });
      } else {
        dispatch({ type: 'INCREMENT_LIFE', playerId, delta });
      }
    },
    [state.commanderDamageSourceId, state.activeCounterType],
  );

  const handleToggleCommanderDamage = useCallback(
    (sourcePlayerId: string) => {
      dispatch({ type: 'CLEAR_SELECTION' });
      dispatch({ type: 'TOGGLE_COMMANDER_DAMAGE_VIEW', sourcePlayerId });
    },
    [],
  );

  const handleToggleCounter = useCallback(
    (playerId: string, counterType: CounterType) => {
      dispatch({ type: 'CLEAR_SELECTION' });
      dispatch({ type: 'TOGGLE_COUNTER_VIEW', counterType, playerId });
    },
    [],
  );

  return (
    <div className="flex flex-row h-full w-full">
      <TopBar
        modalIncrementInProgress={!!state.commanderDamageSourceId || !!state.activeCounterType}
        playerCount={state.visibleCount}
        onAddPlayer={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'ADD_PLAYER' })
        }}
        onRemovePlayer={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'REMOVE_PLAYER' })
        }}
        onRandomPlayer={() => {
          if (state.selectedPlayerId) {
            dispatch({ type: 'CLEAR_SELECTION' });
          } else {
            return dispatch({ type: 'SELECT_RANDOM_PLAYER' });
          }
        }}
        onReset={() => {
          dispatch({ type: 'CLEAR_SELECTION' });
          dispatch({ type: 'RESET_GAME' })
        }}
      />
      <PlayerGrid
        players={state.players.slice(0, state.visibleCount)}
        selectedPlayerId={state.selectedPlayerId}
        commanderDamageSourceId={state.commanderDamageSourceId}
        activeCounterType={state.activeCounterType}
        activeCounterPlayerId={state.activeCounterPlayerId}
        onIncrement={handleIncrement}
        onToggleCommanderDamage={handleToggleCommanderDamage}
        onToggleCounter={handleToggleCounter}
      />
    </div>
  );
}

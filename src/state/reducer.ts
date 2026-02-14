import { GameState, Player, STARTING_LIFE, MIN_PLAYERS, MAX_PLAYERS, PLAYER_COLORS } from './types';

export type GameAction =
  | { type: 'INCREMENT_LIFE'; playerId: string; delta: number }
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER' }
  | { type: 'SELECT_RANDOM_PLAYER' }
  | { type: 'SET_SELECTED'; playerId: string | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESET_GAME' }
  | { type: 'HYDRATE'; state: GameState };

function makePlayer(index: number): Player {
  return {
    id: `p${index}`,
    life: STARTING_LIFE,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  };
}

export function createInitialState(visibleCount: number = 4): GameState {
  const players: Player[] = [];
  for (let i = 0; i < MAX_PLAYERS; i++) {
    players.push(makePlayer(i));
  }
  return {
    version: 1,
    players,
    visibleCount,
    selectedPlayerId: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INCREMENT_LIFE': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.playerId ? { ...p, life: p.life + action.delta } : p,
        ),
      };
    }

    case 'ADD_PLAYER': {
      if (state.visibleCount >= MAX_PLAYERS) return state;
      return {
        ...state,
        visibleCount: state.visibleCount + 1,
      };
    }

    case 'REMOVE_PLAYER': {
      if (state.visibleCount <= MIN_PLAYERS) return state;
      const newCount = state.visibleCount - 1;
      const hiddenPlayer = state.players[newCount];
      return {
        ...state,
        visibleCount: newCount,
        selectedPlayerId:
          state.selectedPlayerId === hiddenPlayer.id ? null : state.selectedPlayerId,
      };
    }

    case 'SELECT_RANDOM_PLAYER': {
      const visible = state.players.slice(0, state.visibleCount);
      const idx = Math.floor(Math.random() * visible.length);
      return {
        ...state,
        selectedPlayerId: visible[idx].id,
      };
    }

    case 'SET_SELECTED': {
      return { ...state, selectedPlayerId: action.playerId };
    }

    case 'CLEAR_SELECTION': {
      return { ...state, selectedPlayerId: null };
    }

    case 'RESET_GAME': {
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, life: STARTING_LIFE })),
        selectedPlayerId: null,
      };
    }

    case 'HYDRATE': {
      return action.state;
    }

    default:
      return state;
  }
}

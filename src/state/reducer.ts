import { GameState, Player, STARTING_LIFE, MIN_PLAYERS, MAX_PLAYERS, PLAYER_COLOR_COUNT } from './types';

export type GameAction =
  | { type: 'INCREMENT_LIFE'; playerId: string; delta: number }
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER' }
  | { type: 'SELECT_RANDOM_PLAYER' }
  | { type: 'SET_SELECTED'; playerId: string | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESET_GAME' }
  | { type: 'HYDRATE'; state: GameState }
  | { type: 'TOGGLE_COMMANDER_DAMAGE_VIEW'; sourcePlayerId: string }
  | { type: 'INCREMENT_COMMANDER_DAMAGE'; sourcePlayerId: string; targetPlayerId: string; delta: number }
  | { type: 'RESET_COMMANDER_DAMAGE' };

function makePlayer(index: number): Player {
  return {
    id: `p${index}`,
    life: STARTING_LIFE,
    colorIndex: index % PLAYER_COLOR_COUNT,
    commanderDamage: {},
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
    commanderDamageSourceId: null,
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
        players: state.players.map((p) => ({ ...p, life: STARTING_LIFE, commanderDamage: {} })),
        selectedPlayerId: null,
        commanderDamageSourceId: null,
      };
    }

    case 'HYDRATE': {
      return action.state;
    }

    case 'TOGGLE_COMMANDER_DAMAGE_VIEW': {
      const isActive = state.commanderDamageSourceId === action.sourcePlayerId;
      return {
        ...state,
        commanderDamageSourceId: isActive ? null : action.sourcePlayerId,
      };
    }

    case 'INCREMENT_COMMANDER_DAMAGE': {
      return {
        ...state,
        players: state.players.map((p) => {
          if (p.id !== action.targetPlayerId) return p;
          const current = p.commanderDamage[action.sourcePlayerId] ?? 0;
          const next = Math.max(0, current + action.delta);
          return {
            ...p,
            commanderDamage: { ...p.commanderDamage, [action.sourcePlayerId]: next },
          };
        }),
      };
    }

    case 'RESET_COMMANDER_DAMAGE': {
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, commanderDamage: {} })),
        commanderDamageSourceId: null,
      };
    }

    default:
      return state;
  }
}

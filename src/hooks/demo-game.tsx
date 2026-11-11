'use client';

import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode
} from 'react';
import { ROUND_RESULT_DISPLAY_MS } from '@/constants/room';
import { CursorStore } from './cursor-store';
import { DEMO_SELF_ID, DemoRoom, type DemoOptions } from './demo-room';
import {
  deriveGameContext,
  GameContext,
  initGameState,
  type GameActions
} from './game';
import { gameReducer } from './game-reducer';

type DemoGameProviderProps = {
  options: DemoOptions;
  children: ReactNode;
};

const noop = () => {};

/**
 * A GameContext backed by a Room simulated in the browser (see DemoRoom), so
 * any layout can be played against bots with no backend.
 *
 * @example
 * <DemoGameProvider options={options}><Game /></DemoGameProvider>
 */
export function DemoGameProvider({ options, children }: DemoGameProviderProps) {
  const [sim] = useState(() => new DemoRoom(options));
  const [state, dispatch] = useReducer(gameReducer, sim, room =>
    initGameState(room.snapshot())
  );
  const [cursors] = useState(() => new CursorStore());

  useEffect(() => {
    sim.start({
      cursors,
      emit: event => {
        dispatch({ type: 'event', event });
        const snapshot = sim.roundSnapshot();
        const needsDeadlines =
          event.event === 'room.round-start' ||
          event.event === 'room.time-to-judge';
        if (needsDeadlines && snapshot) {
          dispatch({ type: 'deadlines', snapshot });
        }
      },
      selectCard: cardId => dispatch({ type: 'select-card', cardId }),
      cardsPlayed: cards => dispatch({ type: 'cards-played', cards })
    });
    return () => sim.stop();
  }, [sim, cursors]);

  useEffect(() => {
    if (!state.lastResult) return;
    const timer = setTimeout(
      () => dispatch({ type: 'dismiss-result' }),
      ROUND_RESULT_DISPLAY_MS
    );
    return () => clearTimeout(timer);
  }, [state.lastResult]);

  const actions = useMemo<GameActions>(
    () => ({
      toggleReady: sim.toggleReady,
      startGame: sim.startGame,
      playCards: sim.playCards,
      pickWinner: sim.pickWinner
    }),
    [sim]
  );

  const value = useMemo(
    () =>
      deriveGameContext(state, DEMO_SELF_ID, {
        actions,
        connection: 'open',
        cursors,
        sendCursor: noop,
        dispatch
      }),
    [state, actions, cursors]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

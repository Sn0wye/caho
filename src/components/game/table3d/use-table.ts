'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useGame } from '@/hooks/game';
import type { GameRound, RoundResult } from '@/hooks/game-reducer';
import type { useJudgePick } from '../round/use-judge-pick';
import { arrangeSeats } from '../table/table-seats';
import { toSeats3D, type Seat3D } from './space';
import { fx } from './store';

// Mirrors the backend's HAND_SIZE (services/room/gameRules.ts).
export const HAND_SIZE = 10;

/**
 * Every Player's seat in the 3D world, and this Player's own.
 *
 * @example
 * const { seats, self } = useSeats();
 */
export function useSeats(): { seats: Seat3D[]; self: Seat3D | null } {
  const { players, currentPlayer } = useGame();
  const selfId = currentPlayer?.id ?? null;
  return useMemo(() => {
    const seats = toSeats3D(arrangeSeats(players, selfId).seats, selfId);
    return { seats, self: seats.find(seat => seat.isSelf) ?? null };
  }, [players, selfId]);
}

// What the table is showing. The result of a Round stays on the table for a
// few seconds even though the next Round has already started underneath, so
// layers read this instead of `round.status`.
export type Stage =
  | { kind: 'lobby' }
  // The game started and the first Round hasn't arrived yet.
  | { kind: 'dealing' }
  | { kind: 'playing'; round: GameRound }
  | { kind: 'judging'; round: GameRound }
  | { kind: 'result'; result: RoundResult }
  | { kind: 'finished' };

/**
 * @example
 * const stage = useStage();
 * if (stage.kind === 'result') celebrate(stage.result.winnerId);
 */
export function useStage(): Stage {
  const { room, round, lastResult } = useGame();
  return useMemo<Stage>(() => {
    if (lastResult) return { kind: 'result', result: lastResult };
    if (room.status === 'FINISHED') return { kind: 'finished' };
    if (room.status === 'LOBBY') return { kind: 'lobby' };
    if (!round) return { kind: 'dealing' };
    if (round.status === 'JUDGING') return { kind: 'judging', round };
    if (round.status === 'PLAYING') return { kind: 'playing', round };
    // COMPLETE or ABORTED with the result already dismissed: between Rounds.
    return { kind: 'dealing' };
  }, [room.status, round, lastResult]);
}

/**
 * How many cards a Player shows in hand. Hands aren't shared, so derive it:
 * a full Hand, less the cards played this Round until the refill, and none
 * for the Judge, who sets theirs aside.
 *
 * @example
 * const handSize = useHandSize();
 * handSize(seat.player.id); // 10, or 9 right after they played
 */
export function useHandSize(): (playerId: string) => number {
  const { round, judgeId, players } = useGame();
  const pick = round?.blackCard?.pick ?? 0;
  return useMemo(() => {
    const played = new Set(
      players
        .filter(player => player.isReady && player.id !== judgeId)
        .map(player => player.id)
    );
    return (playerId: string) => {
      // The Judge doesn't play: no cards in hand, the gavel instead.
      if (!round || playerId === judgeId) return 0;
      const isWaiting = round.status === 'PLAYING' && played.has(playerId);
      return HAND_SIZE - (isWaiting ? pick : 0);
    };
  }, [round, judgeId, players, pick]);
}

type JudgePick = ReturnType<typeof useJudgePick>;

const JudgeContext = createContext<JudgePick | null>(null);

export const JudgeProvider = JudgeContext.Provider;

/**
 * The judging phase's answers (sorted the same on every client) and the
 * Judge's pick, shared by the cards on the felt and the HUD's confirm button.
 *
 * @example
 * const { answers, isJudge, chosenPlayerId, setChosenPlayerId } = useJudge();
 */
export function useJudge(): JudgePick {
  const judge = useContext(JudgeContext);
  if (!judge) throw new Error('useJudge must be used inside <Table3D>');
  return judge;
}

// Turns game state changes into one-shot fx events (sound, particles).
export function useGameFx() {
  const { players, room, round, lastResult, ranking, currentPlayer } =
    useGame();
  const selfId = currentPlayer?.id ?? null;
  const previous = useRef({
    players,
    status: room.status,
    roundNumber: round?.number ?? 0,
    roundStatus: round?.status ?? null,
    lastResult
  });

  useEffect(() => {
    const before = previous.current;
    const roundNumber = round?.number ?? 0;
    const roundStatus = round?.status ?? null;

    for (const player of players) {
      const old = before.players.find(p => p.id === player.id);
      if (!old) fx.emit({ type: 'player-join', playerId: player.id });
      else if (!old.isReady && player.isReady) {
        fx.emit({
          type: room.status === 'LOBBY' ? 'player-ready' : 'player-played',
          playerId: player.id
        });
      }
    }
    if (before.status === 'LOBBY' && room.status === 'IN_PROGRESS') {
      fx.emit({ type: 'game-start' });
    }
    if (roundNumber !== before.roundNumber && roundStatus === 'PLAYING') {
      fx.emit({ type: 'round-start' });
    }
    if (before.roundStatus === 'PLAYING' && roundStatus === 'JUDGING') {
      fx.emit({ type: 'judging-start' });
    }
    if (lastResult && lastResult !== before.lastResult) {
      if (lastResult.reason === 'picked' && lastResult.winnerId) {
        fx.emit({
          type: 'round-won',
          playerId: lastResult.winnerId,
          isSelf: lastResult.winnerId === selfId
        });
      } else {
        fx.emit({ type: 'round-aborted' });
      }
    }
    if (before.status !== 'FINISHED' && room.status === 'FINISHED') {
      fx.emit({ type: 'game-end', isSelfWinner: ranking?.[0]?.id === selfId });
    }

    previous.current = {
      players,
      status: room.status,
      roundNumber,
      roundStatus,
      lastResult
    };
  }, [players, room.status, round, lastResult, ranking, selfId]);
}

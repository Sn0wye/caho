'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '@/hooks/game';
import type { RoomPlayer } from '@/schemas';
import type { Seat3D, Vec3 } from '../space';
import { useSeats, useStage, type Stage } from '../use-table';
import { Confetti } from './confetti';
import { CursorBroadcast } from './cursor-broadcast';
import { Cursors3D } from './cursors-3d';
import { Gavel } from './gavel';
import { Pawn, type PawnRole } from './pawn';

// How long a leaving pawn takes to pop away before it unmounts.
const LEAVE_MS = 600;

type RoleContext = {
  stage: Stage;
  judgeId: string | null;
  championId: string | null;
};

function roleFor(
  player: RoomPlayer,
  { stage, judgeId, championId }: RoleContext
): PawnRole {
  const isJudge =
    judgeId === player.id &&
    stage.kind !== 'lobby' &&
    stage.kind !== 'finished';
  const isChampion = stage.kind === 'finished' && championId === player.id;
  let mood: PawnRole['mood'] = 'idle';
  if (stage.kind === 'lobby') mood = player.isReady ? 'ready' : 'waiting';
  else if (stage.kind === 'playing' && !isJudge) {
    mood = player.isReady ? 'played' : 'thinking';
  } else if (stage.kind === 'result' && stage.result.winnerId === player.id) {
    mood = 'winner';
  } else if (isChampion) mood = 'champion';

  const tag = !player.isActive
    ? 'caiu'
    : isJudge
      ? 'juiz'
      : isChampion
        ? 'campeão'
        : null;
  return { mood, hasCrown: isJudge || isChampion, tag };
}

/**
 * The other Players around the table: their pawns, their live 3D cursors,
 * this Player's own cursor broadcast, and confetti for the big moments.
 *
 * @example
 * <Canvas><Players3D /></Canvas>
 */
export default function Players3D() {
  const { seats } = useSeats();
  const stage = useStage();
  const { judgeId, ranking } = useGame();

  // During `result` the next Round (and its Judge) is already underneath:
  // keep the finished Round's Judge until the stage moves on.
  const [roundJudge, setRoundJudge] = useState(judgeId);
  if (stage.kind !== 'result' && roundJudge !== judgeId) setRoundJudge(judgeId);
  const shownJudge = stage.kind === 'result' ? roundJudge : judgeId;
  const championId = ranking?.[0]?.id ?? null;

  // Everyone around the table watches the winner celebrate.
  const celebrated =
    stage.kind === 'result'
      ? stage.result.winnerId
      : stage.kind === 'finished'
        ? championId
        : null;
  const focus = useMemo<Vec3 | null>(() => {
    const seat = seats.find(s => s.player.id === celebrated);
    if (!seat) return null;
    return [seat.world[0], 0.4, seat.world[2]];
  }, [seats, celebrated]);

  // Pawns already here when the table opens drop in one after another.
  const [initialOrder] = useState(
    () => new Map(seats.filter(s => !s.isSelf).map((s, i) => [s.player.id, i]))
  );

  const [leaving, setLeaving] = useState<Seat3D[]>([]);
  const previous = useRef(seats);
  useEffect(() => {
    const gone = previous.current.filter(
      old =>
        !old.isSelf && !seats.some(seat => seat.player.id === old.player.id)
    );
    previous.current = seats;
    if (gone.length === 0) return;
    setLeaving(list => [...list, ...gone]);
    setTimeout(
      () => setLeaving(list => list.filter(seat => !gone.includes(seat))),
      LEAVE_MS
    );
  }, [seats]);

  const hasJudge = stage.kind !== 'lobby' && stage.kind !== 'finished';
  const judgeSeat =
    (hasJudge && seats.find(seat => seat.player.id === shownJudge)) || null;

  const context: RoleContext = { stage, judgeId: shownJudge, championId };

  return (
    <>
      {seats
        .filter(seat => !seat.isSelf)
        .map(seat => (
          <Pawn
            key={seat.player.id}
            seat={seat}
            role={roleFor(seat.player, context)}
            dropDelay={
              initialOrder.has(seat.player.id)
                ? 0.25 + (initialOrder.get(seat.player.id) ?? 0) * 0.16
                : 0
            }
            isLeaving={false}
            focus={seat.player.id === celebrated ? null : focus}
          />
        ))}
      {leaving.map(seat => (
        <Pawn
          key={`leaving-${seat.player.id}`}
          seat={seat}
          role={{ mood: 'idle', hasCrown: false, tag: null }}
          dropDelay={0}
          isLeaving
          focus={null}
        />
      ))}
      <Gavel seat={judgeSeat} />
      <Cursors3D seats={seats} />
      <CursorBroadcast />
      <Confetti seats={seats} />
    </>
  );
}

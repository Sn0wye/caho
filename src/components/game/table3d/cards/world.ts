'use client';

import type { ThreeEvent } from '@react-three/fiber';
import { Matrix4, Mesh, Vector3, type Camera, type Raycaster } from 'three';
import type { CursorStore } from '@/hooks/cursor-store';
import type { BlackCard, RoundPlayedCard, WhiteCard } from '@/schemas';
import { feltCardAt, pointOnCard, type FeltCard } from '../../table/felt-cards';
import { handSlotPosition } from '../../table/table-seats';
import {
  nearCameraFade,
  playedPose,
  worldToTable,
  type Seat3D
} from '../space';
import { fx, useTable3D } from '../store';
import type { Stage } from '../use-table';
import {
  answerAim,
  gatherAim,
  HAND_DEPTH,
  handAim,
  handLayout,
  handSlotAt,
  heldAim,
  heroAim,
  resultAim,
  still,
  type HandMode
} from './aims';
import {
  acquireFace,
  backMaterial,
  faceKey,
  makeGlowMaterial,
  paperShaded,
  releaseFace,
  type CardKind,
  type FaceSpec
} from './art';
import {
  CardEntity,
  type Aim,
  type CardFx,
  type FrameContext,
  type Glow,
  type Step
} from './entity';
import {
  deckTopPose,
  discardPose,
  fromCardPose,
  judgeYaw,
  makeTarget,
  rectUV,
  STAGED_PROP,
  STAGED_SCALE,
  stagedPose,
  trophyPose
} from './poses';

// Every card on the table as a persistent entity. `sync` runs on each game
// state change and decides what each card is for and where it goes (with
// timed steps); `frame` moves them and reads the live inputs (cursors,
// hover) without React.

export type TableSnapshot = {
  stage: Stage;
  seats: Seat3D[];
  self: Seat3D | null;
  judgeId: string | null;
  isJudge: boolean;
  hasPlayed: boolean;
  visibleHand: WhiteCard[];
  selectedCards: WhiteCard[];
  playedCards: WhiteCard[];
  isSelectionComplete: boolean;
  handSize: (playerId: string) => number;
  answers: RoundPlayedCard[];
  rects: FeltCard[];
  chosenPlayerId: string | null;
  isPending: boolean;
  cursors: CursorStore;
  selectCard: (card: WhiteCard) => void;
  unselectCard: (card: WhiteCard) => void;
  setChosenPlayerId: (playerId: string | null) => void;
};

// What the last judging looked like, to keep presenting it during the result
// (the next Round is already in the game state by then).
type JudgingMemory = {
  round: number;
  answers: RoundPlayedCard[];
  answerIds: string[][];
  blackCard: BlackCard | null;
};

type Live = {
  rects: FeltCard[];
  answers: RoundPlayedCard[];
  isJudge: boolean;
  judgeId: string | null;
  chosenPlayerId: string | null;
};

const clock = () => performance.now() / 1000;

// The result shows for 6 s (ROUND_RESULT_DISPLAY_MS): the line-up holds for
// most of it, then the Black Card flies to its trophy pile and the winners
// leave, both landing just before the next Round deals.
const RESULT_TROPHY_AT = 4.75;
const RESULT_CLEAR_AT = 4.95;
const GOLD: Glow = { color: '#ffc44d', strength: 1 };
const CHOSEN: Glow = { color: '#ff8a1f', strength: 1 };
// Fewer of each sound when a whole Hand is dealt at once.
const FX_GAP = {
  'card-deal': 0.07,
  'card-slide': 0.08,
  'card-flip': 0.12,
  'card-hover': 0.05,
  'card-select': 0.05
};

const HIDDEN_WHITE: FaceSpec = { kind: 'hidden', card: 'white' };
const HIDDEN_BLACK: FaceSpec = { kind: 'hidden', card: 'black' };

const atVector = new Vector3();
const pointVector = new Vector3();
const bandMatrix = new Matrix4();
const cameraInverse = new Matrix4();
// A pointer that left the Hand lets go of the hovered card after this long,
// unless it lands on another card or the Hand's band first.
const HAND_LEAVE_DELAY = 0.08;
const eyeVector = new Vector3();
const meshRaycast = Mesh.prototype.raycast;
const noRaycast = (_: Raycaster) => undefined;

// How much a card's face glows from its own texture, by where it lies: a
// floor so paper reads white in the lamp's shadow, not tinted by the neon.
const GLOW = { table: 0.34, hero: 0.36, winner: 0.42 } as const;
// Paper's response to the room's lights on the table (the Hand is lit almost
// only by itself, see apply).
const TABLE_ALBEDO = 0.78;

export class CardWorld {
  readonly entities = new Map<string, CardEntity>();
  private ids: string[] = [];
  private readonly listeners = new Set<() => void>();
  private snapshot: TableSnapshot | null = null;

  private readonly held = new Map<string, string[]>();
  private readonly played = new Map<string, string[]>();
  private playedRound = -1;
  private readonly trophies = new Map<string, string[]>();
  private readonly lastHovered = new Map<string, number>();
  private readonly retired = new Set<string>();
  private memory: JudgingMemory | null = null;
  private live: Live | null = null;
  private stageKey = '';
  private stageStart = 0;
  private serial = 0;
  private readonly lastFx = new Map<CardFx, number>();
  private isPointerOwner = false;
  private isAnswerPinned = false;
  // This Player's Hand, for the hover band (see HandBand).
  private hand = { size: 0, isLive: false };
  private handLeaveAt: number | null = null;
  handBand: Mesh | null = null;

  readonly ctx: FrameContext = {
    now: 0,
    dt: 0,
    // Replaced on the first frame.
    camera: undefined as unknown as Camera,
    hoveredHandId: null,
    hoveredHandSlot: null,
    hoveredAnswer: null,
    liftedAnswer: null,
    chosenAnswer: null,
    heldLift: new Map(),
    seatFade: new Map()
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getIds = () => this.ids;

  private publish() {
    const ids = [...this.entities.keys()];
    if (
      ids.length === this.ids.length &&
      ids.every((id, index) => id === this.ids[index])
    ) {
      return;
    }
    this.ids = ids;
    for (const listener of this.listeners) listener();
  }

  // --- Sync: game state → roles and steps ---------------------------------

  sync(s: TableSnapshot) {
    this.snapshot = s;
    const now = clock();
    const { stage, seats, self } = s;
    const seatCount = seats.length;
    const round =
      stage.kind === 'playing' || stage.kind === 'judging' ? stage.round : null;
    const roundNumber =
      stage.kind === 'result' ? stage.result.roundNumber : (round?.number ?? 0);
    const key = `${stage.kind}:${roundNumber}`;
    if (key !== this.stageKey) {
      this.stageKey = key;
      this.stageStart = now;
      this.retired.clear();
    }
    const t0 = this.stageStart;
    const pick = round?.blackCard?.pick ?? 1;
    const direction = self?.direction ?? { x: 0, y: 1 };
    const seatOf = new Map(seats.map(seat => [seat.player.id, seat]));
    const claimed = new Set<string>();

    if (round && this.playedRound !== round.number) {
      this.played.clear();
      this.playedRound = round.number;
    }

    const whiteDeck = still(deckTopPose('white', seatCount));
    const blackDeck = still(deckTopPose('black', seatCount));
    const discard = (salt: number) => still(discardPose(seatCount, salt));

    // Claims a card for this sync, dealing it from its deck if it's new.
    const claim = (
      id: string,
      kind: CardKind,
      face: FaceSpec,
      steps: Step[],
      { delay = 0, sink }: { delay?: number; sink?: Aim } = {}
    ): CardEntity | null => {
      if (this.retired.has(id)) return null;
      let entity = this.entities.get(id);
      if (!entity) {
        const spawn = fromCardPose(
          makeTarget(),
          deckTopPose(kind === 'black' ? 'black' : 'white', seatCount)
        );
        entity = new CardEntity(id, kind, face, spawn, discard(this.serial));
        entity.readyAt = now + delay;
        this.entities.set(id, entity);
      }
      entity.kind = kind;
      entity.face = face;
      entity.faceFn = null;
      entity.glowFn = null;
      entity.role = null;
      entity.card = null;
      entity.emissive = GLOW.table;
      entity.dim = 1;
      entity.seatId = null;
      entity.isOverlay = false;
      entity.renderOrder = 0;
      entity.interactiveAt = 0;
      entity.isCastingShadow = true;
      entity.sink = sink ?? discard(id.length + this.serial);
      entity.setSteps(steps);
      claimed.add(id);
      return entity;
    };

    // Trophies first: the result below may hand the Black Card to a pile.
    const heroId = (n: number) => `black:${n}`;
    if (stage.kind === 'result') {
      const { result } = stage;
      const winnerSeat = result.winnerId ? seatOf.get(result.winnerId) : null;
      if (result.reason === 'picked' && winnerSeat) {
        const list = this.trophies.get(winnerSeat.player.id) ?? [];
        if (!list.includes(heroId(roundNumber))) list.push(heroId(roundNumber));
        this.trophies.set(winnerSeat.player.id, list);
      }
    }
    for (const seat of seats) {
      const playerId = seat.player.id;
      const list = this.trophies.get(playerId) ?? [];
      const score = stage.kind === 'lobby' ? 0 : seat.player.score;
      while (list.length > score) list.pop();
      while (list.length < score)
        list.push(`trophy:${playerId}:${this.serial++}`);
      this.trophies.set(playerId, list);
      list.forEach((id, index) => {
        claim(
          id,
          'black',
          HIDDEN_BLACK,
          [{ at: 0, aim: still(trophyPose(seat, index)), fx: 'card-slide' }],
          { delay: 0.4 + index * 0.12, sink: blackDeck }
        );
      });
    }

    // The round's Black Card, the hero.
    if (round?.blackCard) {
      const black = round.blackCard;
      const hero = claim(
        heroId(round.number),
        'black',
        { kind: 'black', text: black.text, answers: this.heroAnswers(s) },
        [
          {
            at: t0,
            aim: heroAim(
              stage.kind === 'judging' ? 'judging' : 'playing',
              direction,
              s.rects
            ),
            fx: 'card-deal'
          }
        ],
        { delay: 0.25 }
      );
      if (hero) {
        hero.emissive = GLOW.hero;
        if (stage.kind === 'judging') {
          hero.faceFn = ctx => {
            const live = this.live;
            const focus =
              ctx.hoveredAnswer ?? ctx.liftedAnswer ?? ctx.chosenAnswer;
            const answer = focus === null ? undefined : live?.answers[focus];
            return {
              kind: 'black',
              text: black.text,
              answers: answer?.whiteCards.map(card => card.text) ?? []
            };
          };
        }
      }
    }

    // Other Players' Hands, and the piles of those who played.
    seats.forEach((seat, seatIndex) => {
      if (seat.isSelf) return;
      const playerId = seat.player.id;
      const isDealt =
        stage.kind === 'playing' ||
        stage.kind === 'judging' ||
        stage.kind === 'result';
      const size = isDealt ? s.handSize(playerId) : 0;
      const list = this.held.get(playerId) ?? [];

      if (
        stage.kind === 'playing' &&
        round &&
        seat.player.isReady &&
        playerId !== s.judgeId &&
        !this.played.has(playerId)
      ) {
        // The cards leave the fan from where the Player last pointed.
        const hovered = this.lastHovered.get(playerId) ?? list.length / 2;
        const slot = Math.max(
          0,
          Math.min(Math.round(hovered), list.length - pick)
        );
        const pile = list.splice(slot, pick);
        while (pile.length < pick) {
          pile.push(`played:${round.number}:${playerId}:${pile.length}`);
        }
        this.played.set(playerId, pile);
      }

      while (list.length > size) list.pop();
      let fresh = 0;
      while (list.length < size) {
        list.push(`held:${playerId}:${this.serial++}`);
        fresh++;
      }
      this.held.set(playerId, list);
      list.forEach((id, slot) => {
        const isFresh = !this.entities.has(id);
        const entity = claim(
          id,
          'white',
          HIDDEN_WHITE,
          [
            {
              at: 0,
              aim: heldAim(seat, slot, size, seatCount),
              fx: 'card-deal'
            }
          ],
          {
            delay: isFresh
              ? 0.35 + (slot - (size - fresh)) * 0.09 + seatIndex * 0.05
              : 0,
            sink: whiteDeck
          }
        );
        // Fades with the pawn when the camera comes close (see frame).
        if (entity) entity.seatId = playerId;
      });

      if (stage.kind === 'playing') {
        this.played.get(playerId)?.forEach((id, index) => {
          claim(id, 'white', HIDDEN_WHITE, [
            {
              at: 0,
              aim: still(playedPose(seat, index, pick)),
              fx: 'card-slide'
            }
          ]);
        });
      }
    });

    // This Player: Hand, picks on the felt, the submitted pile.
    this.hand = { size: 0, isLive: false };
    if (self) {
      const selfId = self.player.id;
      const mode: HandMode | null =
        stage.kind === 'playing'
          ? s.isJudge
            ? 'judge'
            : s.hasPlayed
              ? 'waiting'
              : 'play'
          : stage.kind === 'judging' && s.isJudge
            ? 'judge'
            : stage.kind === 'judging' || stage.kind === 'result'
              ? 'tucked'
              : stage.kind === 'finished'
                ? null
                : 'play';
      this.hand = {
        size: s.visibleHand.length,
        isLive: mode === 'play' || mode === 'waiting'
      };
      if (mode) {
        const size = s.visibleHand.length;
        let fresh = 0;
        s.visibleHand.forEach((card, slot) => {
          const isFresh = !this.entities.has(card.id);
          const entity = claim(
            card.id,
            'white',
            { kind: 'white', text: card.text },
            [{ at: 0, aim: handAim(slot, size, mode), fx: 'card-deal' }],
            { delay: isFresh ? 0.3 + fresh++ * 0.08 : 0, sink: whiteDeck }
          );
          if (!entity) return;
          entity.card = card;
          entity.role = {
            type: 'hand',
            slot,
            size,
            isHoverable: mode === 'play' || mode === 'waiting',
            // Still selectable with every pick placed: clicking another
            // card swaps it in.
            isSelectable: mode === 'play' && !s.hasPlayed
          };
          entity.isOverlay = true;
          entity.isCastingShadow = false;
          entity.renderOrder = 100 + slot;
          entity.emissive = mode === 'judge' || mode === 'tucked' ? 0.8 : 1;
          entity.dim = mode === 'judge' || mode === 'tucked' ? 0.5 : 1;
        });
      }

      if (stage.kind === 'playing' && !s.hasPlayed) {
        s.selectedCards.forEach((card, index) => {
          const entity = claim(
            card.id,
            'white',
            { kind: 'white', text: card.text },
            [
              {
                at: 0,
                aim: still(
                  stagedPose(self, index, pick),
                  STAGED_SCALE,
                  STAGED_PROP
                ),
                fx: 'card-select'
              }
            ]
          );
          if (!entity) return;
          entity.card = card;
          entity.role = { type: 'staged', isClickable: true };
        });
      }

      if (stage.kind === 'playing' && s.hasPlayed && !s.isJudge) {
        const ids = s.playedCards.length
          ? s.playedCards.map(card => card.id)
          : (this.played.get(selfId) ??
            Array.from(
              { length: pick },
              (_, index) => `played:${roundNumber}:${selfId}:${index}`
            ));
        this.played.set(selfId, ids);
        ids.forEach((id, index) => {
          const card = s.playedCards[index];
          claim(
            id,
            'white',
            card ? { kind: 'white', text: card.text } : HIDDEN_WHITE,
            [
              {
                at: 0,
                aim: still(playedPose(self, index, pick)),
                fx: 'card-slide'
              }
            ]
          );
        });
      }
    }

    // Judging: the piles gather in the middle, then deal face up, one answer
    // at a time, onto the same rects the 2.5D layout uses.
    this.live = null;
    if (stage.kind === 'judging' && round) {
      const judgeSeat = s.judgeId ? seatOf.get(s.judgeId) : undefined;
      const judgeColor = judgeSeat?.color ?? '#ffffff';
      const yaw = s.rects[0] ? judgeYaw(s.rects[0]) : (judgeSeat?.yaw ?? 0);
      let order = 0;
      const answerIds = s.answers.map((answer, answerIndex) => {
        const playerId = answer.player.id;
        const pile = this.played.get(playerId) ?? [];
        const rect = s.rects[answerIndex];
        const count = answer.whiteCards.length;
        const ids = answer.whiteCards.map(
          (card, index) =>
            pile[index] ??
            (playerId === self?.player.id
              ? card.id
              : `played:${round.number}:${playerId}:${index}`)
        );
        this.played.set(playerId, ids);
        ids.forEach((id, index) => {
          const entity = claim(
            id,
            'white',
            { kind: 'white', text: answer.whiteCards[index].text },
            [
              { at: t0, aim: gatherAim(order, yaw), fx: 'card-slide' },
              {
                at: t0 + 1.1 + answerIndex * 0.42 + index * 0.14,
                aim: rect
                  ? answerAim(rect, answerIndex, index, count)
                  : gatherAim(order, yaw),
                fx: 'card-flip'
              }
            ]
          );
          order++;
          if (!entity) return;
          entity.role = { type: 'answer', index: answerIndex };
          entity.interactiveAt = t0 + 1.4 + answerIndex * 0.42;
          entity.glowFn = ctx => {
            const live = this.live;
            if (ctx.chosenAnswer === answerIndex) return CHOSEN;
            if (live && !live.isJudge && ctx.liftedAnswer === answerIndex) {
              return { color: judgeColor, strength: 0.85 };
            }
            if (ctx.hoveredAnswer === answerIndex) {
              return { color: '#ffffff', strength: 0.28 };
            }
            return null;
          };
        });
        return ids;
      });
      this.memory = {
        round: round.number,
        answers: s.answers,
        answerIds,
        blackCard: round.blackCard
      };
      this.live = {
        rects: s.rects,
        answers: s.answers,
        isJudge: s.isJudge,
        judgeId: s.judgeId,
        chosenPlayerId: s.chosenPlayerId
      };
    }

    // The result: the winning answer stands beside the Black Card, the rest
    // are swept away, then the Black Card flies to the winner's trophies.
    if (stage.kind === 'result') {
      const { result } = stage;
      const memory = this.memory?.round === roundNumber ? this.memory : null;
      const black = result.blackCard ?? memory?.blackCard ?? null;
      const winnerSeat = result.winnerId ? seatOf.get(result.winnerId) : null;
      const isPicked = result.reason === 'picked' && !!winnerSeat;
      const winnerIndex = memory
        ? memory.answers.findIndex(
            answer => answer.player.id === result.winnerId
          )
        : -1;
      const winnerCards = result.winner?.whiteCards ?? [];
      const winnerIds =
        winnerIndex >= 0
          ? (memory?.answerIds[winnerIndex] ?? [])
          : winnerCards.map(card => card.id);

      let swept = 0;
      memory?.answerIds.forEach((ids, answerIndex) => {
        if (isPicked && answerIndex === winnerIndex) return;
        ids.forEach((id, index) => {
          claim(
            id,
            'white',
            {
              kind: 'white',
              text: memory.answers[answerIndex].whiteCards[index]?.text ?? ''
            },
            [
              {
                at: t0 + 0.6 + swept * 0.07,
                aim: discard(swept),
                isLeaving: true,
                fx: 'card-slide'
              }
            ]
          );
          swept++;
        });
      });

      if (black) {
        const heroSteps: Step[] = [];
        if (isPicked && winnerSeat) {
          const trophies = this.trophies.get(winnerSeat.player.id) ?? [];
          const index = Math.max(0, trophies.indexOf(heroId(roundNumber)));
          heroSteps.push(
            { at: t0, aim: resultAim(-1, winnerIds.length) },
            {
              at: t0 + RESULT_TROPHY_AT,
              aim: still(trophyPose(winnerSeat, index)),
              fx: 'card-slide'
            }
          );
        } else {
          heroSteps.push({
            at: t0 + 0.5,
            aim: discard(99),
            isLeaving: true,
            fx: 'card-slide'
          });
        }
        const hero = claim(
          heroId(roundNumber),
          'black',
          {
            kind: 'black',
            text: black.text,
            answers: isPicked ? winnerCards.map(card => card.text) : []
          },
          heroSteps,
          { sink: blackDeck }
        );
        if (hero) hero.emissive = GLOW.hero;
      }

      if (isPicked) {
        winnerIds.forEach((id, index) => {
          const card = winnerCards[index];
          const entity = claim(
            id,
            'white',
            card ? { kind: 'white', text: card.text } : HIDDEN_WHITE,
            [
              {
                at: t0 + 0.2 + index * 0.12,
                aim: resultAim(index, winnerIds.length),
                fx: 'card-flip'
              },
              {
                at: t0 + RESULT_CLEAR_AT + index * 0.08,
                aim: discard(index + 40),
                isLeaving: true
              }
            ]
          );
          if (!entity) return;
          entity.emissive = GLOW.winner;
          entity.glowFn = () => GOLD;
        });
      }
    }

    // Whatever nothing claimed goes to its sink and fades.
    for (const entity of this.entities.values()) {
      if (claimed.has(entity.id) || entity.isLeaving) continue;
      if (!entity.isBorn) {
        this.entities.delete(entity.id);
        continue;
      }
      entity.leave(now);
    }

    // Hover that no longer applies (the card was picked, the stage moved on).
    const hoveredEntity = this.ctx.hoveredHandId
      ? this.entities.get(this.ctx.hoveredHandId)
      : null;
    if (
      this.ctx.hoveredHandId &&
      !(hoveredEntity?.role?.type === 'hand' && hoveredEntity.role.isHoverable)
    ) {
      this.clearHandHover();
    }
    if (stage.kind !== 'judging') this.clearAnswerHover();

    this.publish();
  }

  private heroAnswers(s: TableSnapshot): string[] {
    if (s.stage.kind !== 'playing' || s.isJudge) return [];
    const cards =
      s.hasPlayed && s.playedCards.length ? s.playedCards : s.selectedCards;
    return cards.map(card => card.text);
  }

  // --- Frame ---------------------------------------------------------------

  frame(camera: Camera, dt: number) {
    const ctx = this.ctx;
    ctx.now = clock();
    ctx.dt = dt;
    ctx.camera = camera;

    const cursors = this.snapshot?.cursors.snapshot();
    ctx.heldLift.clear();
    if (cursors) {
      for (const [playerId, cursor] of cursors) {
        if (cursor.card === null || cursor.card === undefined) continue;
        ctx.heldLift.set(playerId, cursor.card);
        this.lastHovered.set(playerId, cursor.card);
      }
    }

    // Other Players' Hands fade with their pawns as the camera nears them.
    const eye = eyeVector.setFromMatrixPosition(camera.matrixWorld);
    for (const seat of this.snapshot?.seats ?? []) {
      if (seat.isSelf) continue;
      // In or out, eased: matches the pawn, which never parks half-faded.
      const shown = nearCameraFade(eye, seat.world) > 0.5 ? 1 : 0;
      const before = ctx.seatFade.get(seat.player.id) ?? shown;
      const eased = before + (shown - before) * 0.14;
      ctx.seatFade.set(
        seat.player.id,
        Math.abs(shown - eased) < 0.004 ? shown : eased
      );
    }

    if (
      this.handLeaveAt !== null &&
      ctx.now - this.handLeaveAt > HAND_LEAVE_DELAY
    ) {
      this.clearHandHover();
    }
    this.placeHandBand(camera);

    const hovered = ctx.hoveredHandId
      ? this.entities.get(ctx.hoveredHandId)
      : null;
    ctx.hoveredHandSlot =
      hovered?.role?.type === 'hand' ? hovered.role.slot : null;

    const live = this.live;
    if (live) {
      const hoveredAnswer = useTable3D.getState().hoveredAnswer;
      ctx.hoveredAnswer = hoveredAnswer;
      if (live.isJudge) {
        ctx.liftedAnswer = hoveredAnswer;
      } else {
        const judgeCursor = live.judgeId
          ? cursors?.get(live.judgeId)
          : undefined;
        ctx.liftedAnswer = judgeCursor
          ? feltCardAt(live.rects, judgeCursor)
          : null;
      }
      const chosen = live.answers.findIndex(
        answer => answer.player.id === live.chosenPlayerId
      );
      ctx.chosenAnswer = chosen >= 0 ? chosen : null;
    } else {
      ctx.hoveredAnswer = null;
      ctx.liftedAnswer = null;
      ctx.chosenAnswer = null;
    }

    let isRemoved = false;
    for (const entity of this.entities.values()) {
      entity.update(ctx);
      if (entity.pendingFx) {
        this.emitFx(entity.pendingFx, entity);
        entity.pendingFx = null;
      }
      if (entity.isGone) {
        this.entities.delete(entity.id);
        this.retired.add(entity.id);
        isRemoved = true;
        continue;
      }
      this.apply(entity, camera);
    }
    if (isRemoved) this.publish();
  }

  private apply(entity: CardEntity, camera: Camera) {
    const mesh = entity.mesh;
    if (!mesh) return;
    const seatFade = entity.seatId
      ? (this.ctx.seatFade.get(entity.seatId) ?? 1)
      : 1;
    mesh.visible = entity.isBorn && seatFade > 0.02;
    // A fading fan stops catching the pointer well before it is gone.
    const raycast = seatFade > 0.6 ? meshRaycast : noRaycast;
    if (mesh.raycast !== raycast) mesh.raycast = raycast;
    if (!mesh.visible) return;
    mesh.matrix.copy(entity.resolve(camera));
    mesh.matrixWorld.copy(mesh.matrix);
    mesh.castShadow = entity.isCastingShadow && entity.space === 'world';
    mesh.renderOrder = entity.isOverlay
      ? entity.renderOrder + (this.ctx.hoveredHandId === entity.id ? 50 : 0)
      : 0;

    const spec = entity.faceFn ? entity.faceFn(this.ctx) : entity.face;
    const key = faceKey(spec);
    if (key !== entity.appliedFaceKey) {
      const previous = entity.faceMaterial;
      entity.faceMaterial = acquireFace(spec);
      entity.appliedFaceKey = key;
      if (previous) releaseFace(previous);
    }
    const face = entity.faceMaterial;
    const back = backMaterial(entity.kind);
    if (!face) return;
    const dt = Math.min(this.ctx.dt, 0.05);
    face.emissiveIntensity +=
      (entity.emissive * entity.dim - face.emissiveIntensity) *
      (1 - Math.exp(-dt * 10));
    // In the Hand the face is lit almost only by itself: the room's coloured
    // lights shouldn't tint the paper.
    const albedo =
      entity.space === 'camera' ? 0.1 * entity.dim : TABLE_ALBEDO * entity.dim;
    const shade =
      face.color.r + (albedo - face.color.r) * (1 - Math.exp(-dt * 10));
    face.color.setScalar(shade);
    // This Player's Hand draws over the world and skips tone mapping, so
    // it stays paper white whatever the lamp does.
    const isOverlay = entity.isOverlay && entity.space === 'camera';
    face.depthTest = !isOverlay;
    if (face.toneMapped === isOverlay) {
      face.toneMapped = !isOverlay;
      face.needsUpdate = true;
    }

    const opacity = entity.opacity * seatFade;
    if (opacity < 0.999) {
      if (!entity.fadeMaterials) {
        entity.fadeMaterials = [
          paperShaded(face.clone()),
          paperShaded(back.clone())
        ];
        for (const material of entity.fadeMaterials) {
          material.transparent = true;
          material.depthWrite = false;
        }
      }
      const [fadeFace, fadeBack] = entity.fadeMaterials;
      if (fadeFace.map !== face.map) {
        fadeFace.map = face.map;
        fadeFace.emissiveMap = face.map;
      }
      fadeFace.color.copy(face.color);
      fadeFace.emissiveIntensity = face.emissiveIntensity;
      fadeBack.color.copy(back.color);
      fadeBack.emissiveIntensity = back.emissiveIntensity;
      for (const material of entity.fadeMaterials) material.opacity = opacity;
      mesh.material = entity.fadeMaterials;
    } else {
      if (entity.fadeMaterials) {
        for (const material of entity.fadeMaterials) material.dispose();
        entity.fadeMaterials = null;
      }
      entity.materials[0] = face;
      entity.materials[1] = back;
      if (mesh.material !== entity.materials) mesh.material = entity.materials;
    }

    const glow = entity.glowFn?.(this.ctx) ?? null;
    const glowTarget = glow ? glow.strength * entity.opacity : 0;
    entity.glowOpacity +=
      (glowTarget - entity.glowOpacity) * (1 - Math.exp(-dt * 9));
    const halo = entity.glowMesh;
    if (halo) {
      const isShown = entity.glowOpacity > 0.01;
      halo.visible = isShown;
      if (isShown) {
        entity.glowMaterial ??= makeGlowMaterial();
        if (glow) entity.glowColor.set(glow.color);
        entity.glowMaterial.color.copy(entity.glowColor);
        entity.glowMaterial.opacity = entity.glowOpacity;
        halo.material = entity.glowMaterial;
      }
    }
  }

  // The Hand's hover band: an invisible strip over the resting fan (and up to
  // a lifted card), so the hovered card is picked by where the pointer is in
  // the fan, not by which card happens to be under it while cards move.
  private placeHandBand(camera: Camera & { fov?: number; aspect?: number }) {
    const band = this.handBand;
    if (!band) return;
    const { size, isLive } = this.hand;
    band.visible = isLive && size > 0;
    // Raycasting ignores `visible`.
    const raycast = band.visible ? meshRaycast : noRaycast;
    if (band.raycast !== raycast) band.raycast = raycast;
    if (!band.visible) return;
    const layout = handLayout(camera.fov ?? 38, camera.aspect ?? 16 / 9, size);
    const width = (size - 1) * layout.step + layout.cardWidth;
    const top =
      this.ctx.hoveredHandId !== null
        ? Math.max(layout.restTop, layout.liftBottom)
        : layout.restTop;
    const bottom = -layout.halfHeight;
    bandMatrix.makeScale(width, top - bottom, 1);
    bandMatrix.setPosition(0, (top + bottom) / 2, -HAND_DEPTH - 0.004);
    band.matrix.multiplyMatrices(camera.matrixWorld, bandMatrix);
    band.matrixWorld.copy(band.matrix);
  }

  private emitFx(type: CardFx, entity: CardEntity) {
    const last = this.lastFx.get(type) ?? 0;
    if (this.ctx.now - last < FX_GAP[type]) return;
    this.lastFx.set(type, this.ctx.now);
    const at = atVector.setFromMatrixPosition(entity.world);
    fx.emit({ type, at: [at.x, at.y, at.z] });
  }

  // Frees what a card mesh used, when it unmounts.
  detach(entity: CardEntity) {
    if (entity.faceMaterial) releaseFace(entity.faceMaterial);
    entity.faceMaterial = null;
    entity.appliedFaceKey = null;
    entity.glowMaterial?.dispose();
    entity.glowMaterial = null;
    for (const material of entity.fadeMaterials ?? []) material.dispose();
    entity.fadeMaterials = null;
    entity.mesh = null;
    entity.glowMesh = null;
  }

  dispose() {
    this.clearHandHover();
    this.clearAnswerHover();
    this.setPointer(false);
  }

  private clearAnswerHover() {
    const store = useTable3D.getState();
    if (store.hoveredAnswer !== null) store.setHoveredAnswer(null);
    if (this.isAnswerPinned) {
      store.setCursorPin(null);
      this.isAnswerPinned = false;
      this.setPointer(false);
    }
  }

  // --- Pointer -------------------------------------------------------------

  private setPointer(isPointer: boolean) {
    if (isPointer) {
      document.body.style.cursor = 'pointer';
      this.isPointerOwner = true;
    } else if (this.isPointerOwner) {
      document.body.style.cursor = '';
      this.isPointerOwner = false;
    }
  }

  private clearHandHover() {
    this.handLeaveAt = null;
    if (!this.ctx.hoveredHandId) return;
    this.ctx.hoveredHandId = null;
    useTable3D.getState().setCursorPin(null);
    this.setPointer(false);
  }

  pointerMove(entity: CardEntity, event: ThreeEvent<PointerEvent>) {
    if (event.pointerType === 'touch') return;
    const s = this.snapshot;
    const role = entity.role;
    if (!s || !role || entity.isLeaving) return;

    if (role.type === 'hand') {
      event.stopPropagation();
      if (!role.isHoverable) return;
      // The lifted card keeps the hover; elsewhere the fan decides.
      if (this.ctx.hoveredHandId === entity.id) {
        this.handLeaveAt = null;
        this.setPointer(role.isSelectable);
        return;
      }
      this.bandMove(event);
      return;
    }

    if (role.type === 'staged') {
      this.setPointer(role.isClickable);
      return;
    }

    if (role.type === 'answer') {
      if (this.ctx.now < entity.interactiveAt) return;
      event.stopPropagation();
      this.isAnswerPinned = true;
      const live = this.live;
      const rect = live?.rects[role.index];
      if (!live || !rect) return;
      const store = useTable3D.getState();
      if (store.hoveredAnswer !== role.index)
        store.setHoveredAnswer(role.index);
      const { u, v } = rectUV(rect, worldToTable(event.point));
      store.setCursorPin(pointOnCard(rect, u, v));
      this.setPointer(live.isJudge && !s.isPending);
    }
  }

  /**
   * The pointer over the Hand: hover the fan's card under it.
   *
   * @example
   * <mesh onPointerMove={event => world.bandMove(event)} />
   */
  bandMove(event: ThreeEvent<PointerEvent>) {
    if (event.pointerType === 'touch') return;
    event.stopPropagation();
    const s = this.snapshot;
    const camera = this.ctx.camera;
    const { size, isLive } = this.hand;
    if (!s?.self || !camera || !isLive || size === 0) return;
    cameraInverse.copy(camera.matrixWorld).invert();
    pointVector.copy(event.point).applyMatrix4(cameraInverse);
    const layout = handLayout(
      (camera as { fov?: number }).fov ?? 38,
      (camera as { aspect?: number }).aspect ?? 16 / 9,
      size
    );
    const slot = handSlotAt(layout, pointVector.x, size);
    let target: CardEntity | null = null;
    for (const entity of this.entities.values()) {
      if (entity.role?.type === 'hand' && entity.role.slot === slot) {
        target = entity;
        break;
      }
    }
    if (target?.role?.type !== 'hand' || target.isLeaving) return;
    this.handLeaveAt = null;
    if (this.ctx.hoveredHandId !== target.id) {
      this.ctx.hoveredHandId = target.id;
      this.emitFx('card-hover', target);
      useTable3D.getState().setCursorPin({
        ...handSlotPosition(s.self, slot, size),
        card: slot
      });
    }
    this.setPointer(target.role.isSelectable);
  }

  /**
   * @example
   * <mesh onPointerOut={() => world.bandOut()} />
   */
  bandOut() {
    if (this.ctx.hoveredHandId) this.handLeaveAt ??= this.ctx.now;
  }

  /**
   * A click on the Hand picks the hovered card (or, with no hover, as on a
   * touch screen, the card tapped).
   *
   * @example
   * <mesh onClick={event => world.bandClick(event)} />
   */
  bandClick(event: ThreeEvent<MouseEvent>, tapped: CardEntity | null = null) {
    if (event.nativeEvent.button !== 0) return;
    event.stopPropagation();
    const id = this.ctx.hoveredHandId;
    const entity = (id ? this.entities.get(id) : null) ?? tapped;
    const s = this.snapshot;
    if (!s || !entity || entity.role?.type !== 'hand') return;
    if (!entity.role.isSelectable || !entity.card || entity.isLeaving) return;
    this.emitFx('card-select', entity);
    // Every pick already placed: the new card takes the last one's place.
    const last = s.selectedCards.at(-1);
    if (s.isSelectionComplete && last) s.unselectCard(last);
    s.selectCard(entity.card);
  }

  pointerOut(entity: CardEntity) {
    const role = entity.role;
    if (this.ctx.hoveredHandId && role?.type === 'hand') this.bandOut();
    if (role?.type === 'staged') this.setPointer(false);
    if (role?.type === 'answer') {
      const store = useTable3D.getState();
      if (store.hoveredAnswer === role.index) store.setHoveredAnswer(null);
      store.setCursorPin(null);
      this.isAnswerPinned = false;
      this.setPointer(false);
    }
  }

  click(entity: CardEntity, event: ThreeEvent<MouseEvent>) {
    if (event.nativeEvent.button !== 0) return;
    const s = this.snapshot;
    const role = entity.role;
    if (!s || !role || entity.isLeaving) return;
    if (role.type === 'hand') {
      // Whatever card is under the pointer, the hovered one is meant.
      this.bandClick(event, entity);
    } else if (role.type === 'staged') {
      if (!role.isClickable || !entity.card) return;
      event.stopPropagation();
      this.emitFx('card-select', entity);
      s.unselectCard(entity.card);
    } else if (role.type === 'answer') {
      if (this.ctx.now < entity.interactiveAt) return;
      event.stopPropagation();
      const answer = this.live?.answers[role.index];
      if (!s.isJudge || s.isPending || !answer) return;
      this.emitFx('card-select', entity);
      s.setChosenPlayerId(answer.player.id);
    }
  }
}

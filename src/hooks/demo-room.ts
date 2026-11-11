import basePack from 'packs/base-pack';
import {
  layoutFeltCards,
  pointOnCard
} from '@/components/game/table/felt-cards';
import {
  arrangeSeats,
  handSlotPosition
} from '@/components/game/table/table-seats';
import type { RoomResync } from '@/utils/game-api';
import type { CursorPosition, PlayerEvent, RoomEvent } from '@/contracts';
import type {
  BlackCard,
  RoomPlayer,
  RoundPlayedCard,
  RoundSnapshot,
  SanitizedRoom,
  WhiteCard
} from '@/schemas';
import type { CursorStore } from './cursor-store';

// A whole Room simulated in the browser, for the /demo route: bots join, get
// ready, play, judge and move their cursors, speaking the backend's own events
// so the real reducer and every layout run unchanged, with no backend.

export type DemoPhase = 'lobby' | 'playing' | 'judging' | 'finished';

export type DemoOptions = {
  // Bots besides this Player, 2 to 7.
  bots: number;
  // Where the Room starts; anything past the lobby is fast-forwarded.
  phase: DemoPhase;
  // Whether this Player judges the first Round.
  selfIsJudge: boolean;
  // Forces every Black Card's pick count.
  pick: number | null;
  // Attract mode: this Player's seat plays itself too.
  auto: boolean;
  maxPoints: number;
  // Bots act this many times faster.
  speed: number;
  seed: number;
};

export const DEMO_SELF_ID = 'demo-player-m';

const HAND_SIZE = 10;
const ROUND_SECONDS = 90;
const CURSOR_TICK_MS = 50;

const BOTS = [
  { id: 'demo-player-a', username: 'Ana Banana' },
  { id: 'demo-player-f', username: 'Betão' },
  { id: 'demo-player-r', username: 'Caio do Grau' },
  { id: 'demo-player-d', username: 'Duda' },
  { id: 'demo-player-t', username: 'Edu Pix' },
  { id: 'demo-player-h', username: 'Fabi' },
  { id: 'demo-player-x', username: 'Gui' }
];

type Emit = (event: RoomEvent | PlayerEvent) => void;

export type DemoHooks = {
  emit: Emit;
  cursors: CursorStore;
  // Attract mode drives this Player's local selection through the provider.
  selectCard: (cardId: string) => void;
  cardsPlayed: (cards: WhiteCard[]) => void;
};

type SimRound = {
  number: number;
  id: string;
  judgeId: string;
  blackCard: BlackCard;
  status: 'PLAYING' | 'JUDGING' | 'COMPLETE';
  plays: RoundPlayedCard[];
  deadline: Date;
};

type BotCursor = { x: number; y: number; slot: number; nextAt: number };

export class DemoRoom {
  private readonly random: () => number;
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private cursorTimer: ReturnType<typeof setInterval> | null = null;
  private hooks: DemoHooks | null = null;
  private players: RoomPlayer[] = [];
  private readonly hands = new Map<string, WhiteCard[]>();
  private whiteDeck: WhiteCard[] = [];
  private blackDeck: BlackCard[] = [];
  private round: SimRound | null = null;
  private room: SanitizedRoom;
  private readonly botCursors = new Map<string, BotCursor>();
  private judgeTarget: number | null = null;
  private cardSeq = 0;

  constructor(private readonly options: DemoOptions) {
    this.random = mulberry32(options.seed);
    const now = new Date();
    this.room = {
      id: 'demo-room',
      code: 'DEMO3D',
      maxPlayers: 8,
      maxPoints: options.maxPoints,
      status: 'LOBBY',
      hostId: DEMO_SELF_ID,
      hasPassword: false,
      prevJudgeId: null,
      judgeId: null,
      round: 0,
      pickedWhiteCards: [],
      pickedBlackCards: [],
      currentBlackCardId: null,
      createdAt: now,
      updatedAt: now
    };
    this.players = [
      {
        id: DEMO_SELF_ID,
        username: 'Você',
        avatarUrl: null,
        isHost: true,
        isReady: false,
        isActive: true,
        score: 0
      }
    ];
    this.fastForward();
  }

  // What a page load would fetch over REST.
  snapshot(): RoomResync {
    return {
      room: { ...this.room },
      players: this.players.map(player => ({ ...player })),
      hand: [...(this.hands.get(DEMO_SELF_ID) ?? [])],
      round: this.roundSnapshot()
    };
  }

  roundSnapshot(): RoundSnapshot | null {
    const round = this.round;
    if (!round) return null;
    return {
      roundNumber: round.number,
      status: round.status,
      judgeId: round.judgeId,
      playDeadline: round.status === 'PLAYING' ? round.deadline : null,
      judgeDeadline: round.status === 'JUDGING' ? round.deadline : null,
      blackCard: round.blackCard,
      roundPlayedCards: round.status === 'PLAYING' ? [] : [...round.plays]
    };
  }

  start(hooks: DemoHooks) {
    this.hooks = hooks;
    this.plan();
    this.cursorTimer = setInterval(() => this.tickCursors(), CURSOR_TICK_MS);
  }

  stop() {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    if (this.cursorTimer) clearInterval(this.cursorTimer);
    this.cursorTimer = null;
    this.hooks = null;
  }

  // --- This Player's commands -------------------------------------------

  toggleReady = async () => {
    const self = this.player(DEMO_SELF_ID);
    if (!self || this.room.status !== 'LOBBY') return;
    this.updatePlayer({ ...self, isReady: !self.isReady });
    this.plan();
  };

  startGame = async () => {
    if (this.room.status !== 'LOBBY') return;
    this.beginGame();
    this.plan();
  };

  playCards = async (cardIds: string[]) => {
    this.play(DEMO_SELF_ID, cardIds);
    this.plan();
  };

  pickWinner = async (winnerPlayerId: string) => {
    this.endRound(winnerPlayerId);
    this.plan();
  };

  // --- Simulation -------------------------------------------------------

  private fastForward() {
    const { phase, bots } = this.options;
    if (phase === 'lobby') return;
    for (let i = 0; i < bots; i++) this.joinBot();
    this.players = this.players.map(player => ({ ...player, isReady: true }));
    this.beginGame();
    this.beginRound();
    if (phase === 'playing') {
      // A couple of bots have already played, so the table isn't empty.
      const contenders = this.botContenders();
      for (const bot of contenders.slice(0, Math.ceil(contenders.length / 2))) {
        this.botPlay(bot.id);
      }
      return;
    }
    for (const player of this.contenders()) {
      this.play(
        player.id,
        this.pickFromHand(player.id).map(card => card.id)
      );
    }
    this.openJudging();
    if (phase === 'finished') {
      this.players = this.players.map((player, index) => ({
        ...player,
        score: Math.max(0, this.options.maxPoints - index * 2)
      }));
      this.room = { ...this.room, status: 'FINISHED' };
    }
  }

  // Schedules whatever the current state is waiting on. Safe to call again:
  // each wait has a key and is only scheduled once.
  private plan() {
    if (!this.hooks) return;
    const { auto, bots } = this.options;
    const round = this.round;

    if (this.room.status === 'LOBBY') {
      const botCount = this.players.length - 1;
      if (botCount < bots) {
        this.once(`join-${botCount}`, 900 + this.random() * 900, () => {
          this.joinBot();
          this.plan();
        });
      }
      for (const bot of this.bots().filter(bot => !bot.isReady)) {
        this.once(`ready-${bot.id}`, 1400 + this.random() * 2600, () => {
          const current = this.player(bot.id);
          if (current) this.updatePlayer({ ...current, isReady: true });
          this.plan();
        });
      }
      const self = this.player(DEMO_SELF_ID);
      if (auto && self && !self.isReady) {
        this.once('self-ready', 2500, () => void this.toggleReady());
      }
      const everyoneIn =
        botCount >= bots && this.players.every(player => player.isReady);
      if (auto && everyoneIn) {
        this.once('self-start', 1800, () => void this.startGame());
      }
      return;
    }

    if (this.room.status !== 'IN_PROGRESS') return;

    if (!round) {
      this.once('first-round', 900, () => {
        this.beginRound();
        this.plan();
      });
      return;
    }

    if (round.status === 'PLAYING') {
      const key = `r${round.number}`;
      for (const bot of this.botContenders()) {
        if (round.plays.some(play => play.player.id === bot.id)) continue;
        this.once(`${key}-play-${bot.id}`, 3500 + this.random() * 9000, () => {
          this.botPlay(bot.id);
          this.plan();
        });
      }
      const selfPlays = round.judgeId !== DEMO_SELF_ID;
      const selfPlayed = round.plays.some(
        play => play.player.id === DEMO_SELF_ID
      );
      if (auto && selfPlays && !selfPlayed) {
        const picks = this.pickFromHand(DEMO_SELF_ID);
        picks.forEach((card, index) => {
          this.once(`${key}-self-select-${index}`, 4200 + index * 1100, () =>
            this.hooks?.selectCard(card.id)
          );
        });
        this.once(`${key}-self-play`, 4200 + picks.length * 1100 + 900, () => {
          this.hooks?.cardsPlayed(picks);
          void this.playCards(picks.map(card => card.id));
        });
      }
      if (round.plays.length >= this.contenders().length) {
        this.once(`${key}-judge`, 1400, () => {
          this.openJudging();
          this.plan();
        });
      }
      return;
    }

    if (round.status === 'JUDGING') {
      const key = `r${round.number}`;
      const selfJudges = round.judgeId === DEMO_SELF_ID;
      if (selfJudges && !auto) return;
      const answers = sortedAnswers(round.plays);
      // The bot reads every answer, then settles on one.
      const readMs = 1700;
      answers.forEach((_, index) => {
        this.once(`${key}-read-${index}`, 1500 + index * readMs, () => {
          this.judgeTarget = index;
        });
      });
      const choice = Math.floor(this.random() * answers.length);
      const decideAt = 1500 + answers.length * readMs;
      this.once(`${key}-settle`, decideAt, () => {
        this.judgeTarget = choice;
      });
      this.once(`${key}-pick`, decideAt + 1600, () => {
        this.endRound(answers[choice].player.id);
        this.plan();
      });
      return;
    }

    // COMPLETE: the result shows for a moment, then the next Round (or the end).
    const key = `r${round.number}`;
    const champion = this.players.find(
      player => player.score >= this.room.maxPoints
    );
    if (champion) {
      this.once(`${key}-game-end`, 6500, () => this.endGame());
    } else {
      this.once(`${key}-next`, 1200, () => {
        this.beginRound();
        this.plan();
      });
    }
  }

  private joinBot() {
    const bot = BOTS[this.players.length - 1];
    if (!bot) return;
    const player: RoomPlayer = {
      ...bot,
      avatarUrl: null,
      isHost: false,
      isReady: false,
      isActive: true,
      score: 0
    };
    this.players = [...this.players, player];
    this.emit({ event: 'room.player-joined', payload: player });
  }

  private beginGame() {
    this.whiteDeck = shuffle(
      basePack.cards.white.map(card => ({ ...card, id: '' })),
      this.random
    );
    this.blackDeck = shuffle(
      basePack.cards.black.filter(card => card.pick <= 2),
      this.random
    );
    this.players = this.players.map(player => ({ ...player, score: 0 }));
    this.room = { ...this.room, status: 'IN_PROGRESS' };
    this.emit({
      event: 'room.started',
      payload: { room: { ...this.room }, players: [...this.players] }
    });
  }

  private beginRound() {
    const number = (this.round?.number ?? 0) + 1;
    const judgeId = this.nextJudgeId();
    const drawn = this.blackDeck.pop() ?? {
      text: 'O que acabou? ___.',
      pick: 1,
      packId: 'base-pack'
    };
    const blackCard = this.options.pick
      ? withPick(drawn, this.options.pick)
      : drawn;
    this.round = {
      number,
      id: `demo-round-${number}`,
      judgeId,
      blackCard,
      status: 'PLAYING',
      plays: [],
      deadline: secondsFromNow(ROUND_SECONDS)
    };
    this.judgeTarget = null;
    this.room = {
      ...this.room,
      round: number,
      prevJudgeId: this.room.judgeId,
      judgeId
    };
    this.players = this.players.map(player => ({ ...player, isReady: false }));
    this.emit({
      event: 'room.round-start',
      payload: { roundNumber: number, judgeId, blackCard }
    });
    for (const player of this.players) this.refill(player.id);
  }

  private nextJudgeId(): string {
    const ordered = [...this.players].sort((a, b) => a.id.localeCompare(b.id));
    if (!this.round) {
      const firstBot = ordered.find(player => player.id !== DEMO_SELF_ID);
      return this.options.selfIsJudge || !firstBot ? DEMO_SELF_ID : firstBot.id;
    }
    const index = ordered.findIndex(p => p.id === this.round?.judgeId);
    return ordered[(index + 1) % ordered.length].id;
  }

  private refill(playerId: string) {
    const hand = [...(this.hands.get(playerId) ?? [])];
    while (hand.length < HAND_SIZE) {
      const card = this.whiteDeck.pop();
      if (!card) break;
      hand.push({ ...card, id: `demo-white-${this.cardSeq++}` });
    }
    this.hands.set(playerId, hand);
    if (playerId === DEMO_SELF_ID) {
      this.emit({ event: 'player.cards-drawn', payload: [...hand] });
    }
  }

  private pickFromHand(playerId: string): WhiteCard[] {
    const hand = shuffle([...(this.hands.get(playerId) ?? [])], this.random);
    return hand.slice(0, this.round?.blackCard.pick ?? 1);
  }

  private botPlay(botId: string) {
    this.play(
      botId,
      this.pickFromHand(botId).map(card => card.id)
    );
  }

  private play(playerId: string, cardIds: string[]) {
    const round = this.round;
    const player = this.player(playerId);
    if (!round || !player || round.status !== 'PLAYING') return;
    if (round.plays.some(play => play.player.id === playerId)) return;
    const hand = this.hands.get(playerId) ?? [];
    const cards = cardIds
      .map(id => hand.find(card => card.id === id))
      .filter((card): card is WhiteCard => !!card);
    if (cards.length !== round.blackCard.pick) return;

    this.hands.set(
      playerId,
      hand.filter(card => !cardIds.includes(card.id))
    );
    const now = new Date();
    round.plays.push({
      // Random-looking, like the backend's cuids: sorting by it hides who
      // played first.
      id: `demo-play-${Math.floor(this.random() * 1e9).toString(36)}`,
      roundId: round.id,
      player: {
        id: player.id,
        username: player.username,
        avatarUrl: player.avatarUrl
      },
      whiteCards: cards,
      createdAt: now,
      updatedAt: now
    });
    this.updatePlayer({ ...player, isReady: true });
    this.refill(playerId);
  }

  private openJudging() {
    const round = this.round;
    if (!round || round.status !== 'PLAYING') return;
    round.status = 'JUDGING';
    round.deadline = secondsFromNow(ROUND_SECONDS);
    this.emit({
      event: 'room.time-to-judge',
      payload: { roundNumber: round.number, roundPlayedCards: [...round.plays] }
    });
  }

  private endRound(winnerId: string) {
    const round = this.round;
    if (!round || round.status !== 'JUDGING') return;
    const winner = round.plays.find(play => play.player.id === winnerId);
    const player = this.player(winnerId);
    if (!winner || !player) return;
    round.status = 'COMPLETE';
    this.judgeTarget = null;
    const newScore = player.score + 1;
    this.players = this.players.map(p =>
      p.id === winnerId ? { ...p, score: newScore } : p
    );
    this.emit({
      event: 'room.round-end',
      payload: {
        roundNumber: round.number,
        winner,
        winnerId,
        newScore,
        reason: 'picked'
      }
    });
  }

  private endGame() {
    this.room = { ...this.room, status: 'FINISHED' };
    this.emit({
      event: 'room.game-end',
      payload: [...this.players]
        .sort((a, b) => b.score - a.score)
        .map(({ id, username, avatarUrl, score }) => ({
          id,
          username,
          avatarUrl,
          score
        }))
    });
  }

  // --- Bot cursors ------------------------------------------------------

  private tickCursors() {
    const hooks = this.hooks;
    if (!hooks) return;
    const now = Date.now();
    const round = this.round;
    const { seats } = arrangeSeats(this.players, null);
    const judgeSeat = seats.find(seat => seat.player.id === round?.judgeId);
    const answerCards =
      round?.status === 'JUDGING'
        ? layoutFeltCards(round.plays.length, judgeSeat?.facingDeg ?? 0)
        : [];

    for (const seat of seats) {
      const { id } = seat.player;
      if (id === DEMO_SELF_ID) continue;
      const cursor = this.botCursors.get(id) ?? {
        x: seat.handPosition.x,
        y: seat.handPosition.y,
        slot: 0,
        nextAt: 0
      };
      this.botCursors.set(id, cursor);

      const isJudge = round?.judgeId === id;
      const hasPlayed = round?.plays.some(play => play.player.id === id);
      let target: CursorPosition;
      let card: number | null = null;
      let ease = 0.12;

      if (round?.status === 'PLAYING' && !isJudge && !hasPlayed) {
        // Thinking: runs a finger along the Hand.
        if (now >= cursor.nextAt) {
          cursor.slot = Math.floor(this.random() * HAND_SIZE);
          // Unhurried: a real Player looks at a card for a while.
          cursor.nextAt = now + 1800 + this.random() * 3200;
        }
        target = handSlotPosition(seat, cursor.slot, HAND_SIZE);
        card = cursor.slot;
        ease = 0.18;
      } else if (
        round?.status === 'JUDGING' &&
        isJudge &&
        this.judgeTarget !== null &&
        answerCards[this.judgeTarget]
      ) {
        const wobble = now / 1500 + seat.position.x;
        target = pointOnCard(
          answerCards[this.judgeTarget],
          0.5 + Math.sin(wobble) * 0.12,
          0.5 + Math.cos(wobble * 1.3) * 0.12
        );
        ease = 0.16;
      } else {
        // Idle: drifts around the felt in front of the seat.
        const t = now / 6000 + seat.position.x * 3;
        target = {
          x: seat.position.x * 0.42 + Math.sin(t) * 0.07,
          y: seat.position.y * 0.42 + Math.cos(t * 0.8) * 0.07
        };
        ease = 0.04;
      }

      cursor.x += (target.x - cursor.x) * ease;
      cursor.y += (target.y - cursor.y) * ease;
      // A pinned Hand card sends the card's own spot, like the real client.
      hooks.cursors.move(
        id,
        card === null
          ? { x: cursor.x, y: cursor.y }
          : { x: target.x, y: target.y, card }
      );
    }
  }

  // --- Helpers ----------------------------------------------------------

  private emit(event: RoomEvent | PlayerEvent) {
    this.hooks?.emit(event);
  }

  private once(key: string, ms: number, run: () => void) {
    if (this.timers.has(key)) return;
    this.timers.set(
      key,
      setTimeout(() => {
        // Left in the map on purpose: a wait that already fired must not be
        // scheduled again by a later plan().
        run();
      }, ms / this.options.speed)
    );
  }

  private player(id: string) {
    return this.players.find(player => player.id === id);
  }

  private bots() {
    return this.players.filter(player => player.id !== DEMO_SELF_ID);
  }

  private contenders() {
    return this.players.filter(player => player.id !== this.round?.judgeId);
  }

  private botContenders() {
    return this.contenders().filter(player => player.id !== DEMO_SELF_ID);
  }

  private updatePlayer(player: RoomPlayer) {
    this.players = this.players.map(p => (p.id === player.id ? player : p));
    this.emit({ event: 'room.player-update', payload: player });
  }
}

// The order every client lays the answers out in (see useJudgePick).
function sortedAnswers(plays: RoundPlayedCard[]) {
  return [...plays].sort((a, b) => a.id.localeCompare(b.id));
}

function withPick(card: BlackCard, pick: number): BlackCard {
  const blanks = card.text.split('___').length - 1;
  const missing = Math.max(0, pick - blanks);
  return {
    ...card,
    pick,
    text: blanks === 0 ? card.text : card.text + ' ___.'.repeat(missing)
  };
}

function secondsFromNow(seconds: number) {
  return new Date(Date.now() + seconds * 1000);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

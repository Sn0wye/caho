// Development-only measurement: renders every recipe offline through the real
// master chain and reports duration, peak and RMS. Run it from the browser:
//   window.__cahoSoundCheck().then(JSON.stringify)
import type { FxEvent } from '../store';
import { buildMaster } from './engine';
import { renderEvent } from './recipes';
import { createVoice, makeNoises } from './synth';

const SAMPLE_RATE = 44100;
const START = 0.01;
const TRIALS = 4;
// Below this level a tail counts as finished (-60 dBFS).
const SILENCE = 0.001;

type Case = { name: string; event: FxEvent; maxDur: number };

const hit = (toy: 'die' | 'chip' | 'duck', strength: number): FxEvent => ({
  type: 'toy-hit',
  toy,
  strength
});

// maxDur: the intended length including the reverb tail.
const CASES: Case[] = [
  { name: 'card-deal', event: { type: 'card-deal' }, maxDur: 0.9 },
  { name: 'card-slide', event: { type: 'card-slide' }, maxDur: 0.9 },
  { name: 'card-flip', event: { type: 'card-flip' }, maxDur: 0.9 },
  { name: 'card-hover', event: { type: 'card-hover' }, maxDur: 0.8 },
  { name: 'card-select', event: { type: 'card-select' }, maxDur: 0.9 },
  { name: 'toy-hit die 0.3', event: hit('die', 0.3), maxDur: 0.9 },
  { name: 'toy-hit die 1', event: hit('die', 1), maxDur: 0.9 },
  { name: 'toy-hit chip 0.3', event: hit('chip', 0.3), maxDur: 1 },
  { name: 'toy-hit chip 1', event: hit('chip', 1), maxDur: 1 },
  { name: 'toy-hit duck 0.3', event: hit('duck', 0.3), maxDur: 0.9 },
  { name: 'toy-hit duck 1 (squeak)', event: hit('duck', 1), maxDur: 0.9 },
  { name: 'toy-grab', event: { type: 'toy-grab' }, maxDur: 0.8 },
  {
    name: 'player-join',
    event: { type: 'player-join', playerId: 'a' },
    maxDur: 1
  },
  {
    name: 'player-ready',
    event: { type: 'player-ready', playerId: 'a' },
    maxDur: 1
  },
  {
    name: 'player-played',
    event: { type: 'player-played', playerId: 'a' },
    maxDur: 1
  },
  { name: 'game-start', event: { type: 'game-start' }, maxDur: 1.9 },
  { name: 'round-start', event: { type: 'round-start' }, maxDur: 1.6 },
  { name: 'judging-start', event: { type: 'judging-start' }, maxDur: 2.2 },
  {
    name: 'round-won (other)',
    event: { type: 'round-won', playerId: 'a', isSelf: false },
    maxDur: 1.9
  },
  {
    name: 'round-won (self)',
    event: { type: 'round-won', playerId: 'a', isSelf: true },
    maxDur: 1.9
  },
  { name: 'round-aborted', event: { type: 'round-aborted' }, maxDur: 1.7 },
  {
    name: 'game-end (modest)',
    event: { type: 'game-end', isSelfWinner: false },
    maxDur: 2.9
  },
  {
    name: 'game-end (triumph)',
    event: { type: 'game-end', isSelfWinner: true },
    maxDur: 3.5
  },
  { name: 'ui-click', event: { type: 'ui-click' }, maxDur: 0.8 }
];

type Measure = { dur: number; peak: number; rms: number; live: number };

async function render(
  seconds: number,
  schedule: (
    ctx: OfflineAudioContext,
    add: (e: FxEvent, t: number) => void
  ) => void
): Promise<Measure> {
  const ctx = new OfflineAudioContext(
    2,
    Math.ceil(seconds * SAMPLE_RATE),
    SAMPLE_RATE
  );
  const master = buildMaster(ctx, 0.9);
  const noises = makeNoises(ctx);
  const voices: ReturnType<typeof createVoice>[] = [];
  schedule(ctx, (event, t) => {
    const voice = createVoice(ctx, noises, master.input, master.reverb, {
      wet: 0.18
    });
    voices.push(voice);
    renderEvent(voice, t, event);
  });
  const buffer = await ctx.startRendering();
  // Let the `ended` callbacks run before counting stuck voices.
  await new Promise(resolve => setTimeout(resolve, 30));
  let peak = 0;
  let sum = 0;
  let last = 0;
  const length = buffer.length;
  const channels = [buffer.getChannelData(0), buffer.getChannelData(1)];
  for (let i = 0; i < length; i++) {
    for (const data of channels) {
      const x = Math.abs(data[i]);
      if (x > peak) peak = x;
      if (x > SILENCE) last = i;
      sum += x * x;
    }
  }
  const activeSamples = Math.max(1, last - Math.floor(START * SAMPLE_RATE));
  return {
    dur: Math.max(0, last / SAMPLE_RATE - START),
    peak,
    rms: Math.sqrt(sum / 2 / activeSamples),
    live: voices.reduce((n, voice) => n + voice.live(), 0)
  };
}

const db = (x: number) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
const round = (x: number, digits = 1) => Number(x.toFixed(digits));

export type SoundReport = {
  rows: {
    name: string;
    durS: number;
    maxDurS: number;
    peakDb: number;
    rmsDb: number;
    stuck: number;
    ok: boolean;
  }[];
  pileUp: { peakDb: number; ok: boolean };
  allOk: boolean;
};

/**
 * Renders every recipe offline (worst of a few random trials) and the
 * worst-case pile-up, then reports whether each stays within its limits.
 * @example window.__cahoSoundCheck = runSoundCheck;
 */
export async function runSoundCheck(): Promise<SoundReport> {
  const rows: SoundReport['rows'] = [];
  for (const c of CASES) {
    let worst: Measure = { dur: 0, peak: 0, rms: 0, live: 0 };
    let rms = 0;
    for (let i = 0; i < TRIALS; i++) {
      const m = await render(c.maxDur + 1, (_, add) => add(c.event, START));
      worst = {
        dur: Math.max(worst.dur, m.dur),
        peak: Math.max(worst.peak, m.peak),
        rms: 0,
        live: Math.max(worst.live, m.live)
      };
      rms += m.rms / TRIALS;
    }
    const peakDb = db(worst.peak);
    rows.push({
      name: c.name,
      durS: round(worst.dur, 2),
      maxDurS: c.maxDur,
      peakDb: round(peakDb),
      rmsDb: round(db(rms)),
      stuck: worst.live,
      ok:
        peakDb < -3 && peakDb > -45 && worst.dur <= c.maxDur && worst.live === 0
    });
  }
  // Worst case: 20 deals in a second, a fanfare, a game end and a riffle.
  const pile = await render(4, (_, add) => {
    for (let i = 0; i < 20; i++) add({ type: 'card-deal' }, 0.05 + i * 0.05);
    add({ type: 'round-won', playerId: 'a', isSelf: true }, 0.4);
    add({ type: 'game-end', isSelfWinner: true }, 0.5);
    add({ type: 'game-start' }, 0.3);
  });
  const pileDb = db(pile.peak);
  const pileUp = { peakDb: round(pileDb), ok: pileDb < 0 };
  return {
    rows,
    pileUp,
    allOk: pileUp.ok && rows.every(row => row.ok)
  };
}

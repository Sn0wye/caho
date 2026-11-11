// One sound recipe per FxEvent. Each schedules sources on a Voice starting at
// `t` and returns nothing: all gains are written to sit well under full scale
// (the master limiter handles pile-ups). Tune numbers here.
import type { FxEvent } from '../store';
import { noise, rnd, tone, type Voice } from './synth';

type Of<T extends FxEvent['type']> = Extract<FxEvent, { type: T }>;

// Equal-tempered helper so fanfares read as notes, not magic numbers.
const note = (semitonesFromA4: number) => 440 * 2 ** (semitonesFromA4 / 12);
const C5 = note(-9);
const E5 = note(-5);
const G5 = note(-2);
const C6 = note(3);
const E6 = note(7);
const G6 = note(10);

/** Warm plucked bell: triangle body, octave, and a quiet inharmonic partial. */
function pluck(voice: Voice, t: number, f: number, g: number, dur: number) {
  tone(voice, { t, f, dur, g, type: 'triangle', attack: 0.004 });
  tone(voice, { t, f: f * 2, dur: dur * 0.55, g: g * 0.35 });
  tone(voice, { t, f: f * 2.76, dur: dur * 0.25, g: g * 0.1 });
}

/** A rapid accelerating train of tiny ticks; returns when it ends. */
function riffle(
  voice: Voice,
  t: number,
  count: number,
  gap: number,
  g: number
) {
  let at = t;
  for (let i = 0; i < count; i++) {
    noise(voice, {
      t: at,
      dur: 0.012,
      g: g * (0.7 + 0.3 * (i / count)) * rnd(0.8, 1.1),
      filter: { type: 'bandpass', f: 3200 + i * 60, q: 1.4 }
    });
    at += gap * 0.92 ** i * rnd(0.85, 1.15);
  }
  return at;
}

function cardDeal(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.11,
    g: 0.15,
    attack: 0.02,
    kind: 'pink',
    filter: { type: 'bandpass', f: 2200, f2: 6500, q: 0.8 }
  });
  noise(voice, {
    t: t + 0.1,
    dur: 0.03,
    g: 0.14,
    filter: { type: 'highpass', f: 2500 }
  });
  tone(voice, { t: t + 0.1, f: 230, f2: 120, dur: 0.06, g: 0.13 });
}

function cardSlide(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.24,
    g: 0.2,
    attack: 0.06,
    kind: 'pink',
    filter: { type: 'bandpass', f: 1900, f2: 800, q: 1.1 }
  });
  noise(voice, {
    t,
    dur: 0.2,
    g: 0.05,
    attack: 0.08,
    filter: { type: 'highpass', f: 5000 }
  });
}

function cardFlip(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.03,
    g: 0.35,
    filter: { type: 'highpass', f: 2800 }
  });
  tone(voice, { t, f: 1900, f2: 800, dur: 0.035, g: 0.08, type: 'triangle' });
  for (let i = 0; i < 3; i++) {
    noise(voice, {
      t: t + 0.035 + i * 0.022,
      dur: 0.012,
      g: 0.12 * 0.6 ** i,
      filter: { type: 'bandpass', f: 4500, q: 1.5 }
    });
  }
}

function cardHover(voice: Voice, t: number) {
  tone(voice, { t, f: 1500, f2: 1200, dur: 0.02, g: 0.035 });
  noise(voice, {
    t,
    dur: 0.014,
    g: 0.04,
    filter: { type: 'bandpass', f: 3600, q: 1 }
  });
}

function cardSelect(voice: Voice, t: number) {
  tone(voice, { t, f: 190, f2: 68, dur: 0.14, g: 0.42 });
  noise(voice, {
    t,
    dur: 0.05,
    g: 0.2,
    filter: { type: 'lowpass', f: 900 }
  });
  noise(voice, {
    t: t + 0.012,
    dur: 0.07,
    g: 0.1,
    filter: { type: 'bandpass', f: 4000, q: 0.9 }
  });
}

function toyHit(voice: Voice, t: number, e: Of<'toy-hit'>) {
  const s = Math.min(1, Math.max(0, e.strength));
  if (e.toy === 'die') {
    const g = 0.08 + 0.4 * s;
    const base = rnd(1300, 1700);
    noise(voice, {
      t,
      dur: 0.014,
      g,
      filter: { type: 'highpass', f: 3000 }
    });
    noise(voice, {
      t,
      dur: 0.035,
      g: g * 0.5,
      filter: { type: 'bandpass', f: 1800, q: 4 }
    });
    [1, 1.62, 2.31, 3.4].forEach((ratio, i) =>
      tone(voice, {
        t,
        f: base * ratio,
        dur: 0.05 - i * 0.008,
        g: g * 0.3 * 0.7 ** i
      })
    );
  } else if (e.toy === 'chip') {
    const g = 0.06 + 0.3 * s;
    const base = rnd(2900, 3300);
    [1, 1.51, 2.27].forEach((ratio, i) =>
      tone(voice, {
        t,
        f: base * ratio,
        detune: rnd(-12, 12),
        dur: 0.14 - i * 0.04,
        g: g * 0.5 ** i
      })
    );
    noise(voice, {
      t,
      dur: 0.01,
      g: g * 0.6,
      filter: { type: 'highpass', f: 4500 }
    });
  } else if (s < 0.7) {
    tone(voice, { t, f: 160, f2: 60, dur: 0.13, g: 0.1 + 0.4 * s });
    noise(voice, {
      t,
      dur: 0.05,
      g: 0.08 + 0.2 * s,
      filter: { type: 'lowpass', f: 700 }
    });
  } else {
    // Rubber squeak: a quick upward chirp through a lowpass.
    tone(voice, {
      t,
      f: 700,
      f2: 1500,
      dur: 0.13,
      g: 0.12,
      type: 'sawtooth',
      attack: 0.01,
      filter: { type: 'lowpass', f: 2400, q: 3 }
    });
    tone(voice, { t, f: 150, f2: 70, dur: 0.1, g: 0.25 });
  }
}

function toyGrab(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.014,
    g: 0.1,
    filter: { type: 'bandpass', f: 3000, q: 1.2 }
  });
  tone(voice, { t, f: 900, f2: 700, dur: 0.025, g: 0.05 });
}

function playerJoin(voice: Voice, t: number) {
  tone(voice, { t, f: 280, f2: 720, sweep: 0.06, dur: 0.16, g: 0.26 });
  tone(voice, { t, f: 560, f2: 1440, sweep: 0.06, dur: 0.08, g: 0.05 });
}

function playerReady(voice: Voice, t: number) {
  tone(voice, { t, f: 660, dur: 0.14, g: 0.2, type: 'triangle' });
  tone(voice, { t: t + 0.08, f: 880, dur: 0.18, g: 0.2, type: 'triangle' });
}

function playerPlayed(voice: Voice, t: number) {
  tone(voice, { t, f: 130, f2: 52, dur: 0.16, g: 0.45 });
  noise(voice, {
    t,
    dur: 0.06,
    g: 0.28,
    filter: { type: 'lowpass', f: 1300 }
  });
  noise(voice, {
    t,
    dur: 0.09,
    g: 0.14,
    kind: 'pink',
    filter: { type: 'bandpass', f: 3500, q: 0.8 }
  });
}

function gameStart(voice: Voice, t: number) {
  const end = riffle(voice, t, 22, 0.07, 0.11);
  tone(voice, { t: end + 0.03, f: 150, f2: 80, dur: 0.1, g: 0.25 });
  noise(voice, {
    t: end + 0.03,
    dur: 0.03,
    g: 0.2,
    filter: { type: 'lowpass', f: 1500 }
  });
}

function roundStart(voice: Voice, t: number) {
  const end = riffle(voice, t, 8, 0.05, 0.12);
  pluck(voice, end + 0.02, note(7 - 12), 0.12, 0.5);
}

function judgingStart(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.95,
    g: 0.15,
    shape: 'swell',
    kind: 'pink',
    filter: { type: 'bandpass', f: 400, f2: 2600, q: 1 }
  });
  // Drum-roll-ish ticks that tighten and grow, then a stop.
  let at = t;
  for (let i = 0; i < 14; i++) {
    noise(voice, {
      t: at,
      dur: 0.04,
      g: 0.04 + 0.07 * (i / 14),
      filter: { type: 'lowpass', f: 700 }
    });
    at += 0.075 * 0.94 ** i;
  }
  tone(voice, { t: t + 0.98, f: 100, f2: 50, dur: 0.2, g: 0.28 });
  noise(voice, {
    t: t + 0.98,
    dur: 0.03,
    g: 0.18,
    filter: { type: 'bandpass', f: 2500, q: 1 }
  });
}

function roundWon(voice: Voice, t: number, e: Of<'round-won'>) {
  const notes = e.isSelf ? [C5, E5, G5, C6, E6] : [C5, E5, G5, C6];
  const g = e.isSelf ? 0.26 : 0.18;
  notes.forEach((f, i) =>
    pluck(voice, t + i * 0.085, f, g, i === notes.length - 1 ? 0.75 : 0.35)
  );
  if (e.isSelf) {
    voice.setWet(0.3);
    pluck(voice, t + notes.length * 0.085, G6, g * 0.7, 0.5);
  }
}

function roundAborted(voice: Voice, t: number) {
  const muted = { type: 'lowpass', f: 900, f2: 350, q: 1.5 } as const;
  tone(voice, {
    t,
    f: 392,
    f2: 360,
    dur: 0.3,
    g: 0.22,
    type: 'sawtooth',
    attack: 0.02,
    filter: muted
  });
  tone(voice, {
    t: t + 0.3,
    f: 330,
    f2: 262,
    dur: 0.5,
    g: 0.22,
    type: 'sawtooth',
    attack: 0.02,
    filter: muted
  });
}

function gameEnd(voice: Voice, t: number, e: Of<'game-end'>) {
  const win = e.isSelfWinner;
  const run = win ? [C5, E5, G5, C6, E6, G6] : [C5, E5, G5];
  const g = win ? 0.14 : 0.13;
  run.forEach((f, i) => pluck(voice, t + i * 0.1, f, g, 0.4));
  const chordAt = t + run.length * 0.1 + 0.05;
  const chord = win ? [C5, E5, G5, C6] : [C5, G5, C6];
  // Strummed, so the notes don't stack into one peak.
  chord.forEach((f, i) =>
    pluck(voice, chordAt + i * 0.018, f, g * 0.38, win ? 1.4 : 0.9)
  );
  voice.setWet(win ? 0.32 : 0.22);
  // A glint on top of the chord.
  if (win) pluck(voice, chordAt + 0.08, C6 * 2, g * 0.25, 0.6);
}

function uiClick(voice: Voice, t: number) {
  noise(voice, {
    t,
    dur: 0.014,
    g: 0.09,
    filter: { type: 'bandpass', f: 2500, q: 1 }
  });
  tone(voice, { t, f: 1100, f2: 700, dur: 0.02, g: 0.07 });
}

/**
 * Schedules the sound of one event on `voice` at time `t`. The switch is
 * exhaustive: a new FxEvent type fails to compile here until it has a recipe.
 * @example renderEvent(voice, ctx.currentTime, { type: 'ui-click' });
 */
export function renderEvent(voice: Voice, t: number, event: FxEvent) {
  switch (event.type) {
    case 'card-deal':
      return cardDeal(voice, t);
    case 'card-slide':
      return cardSlide(voice, t);
    case 'card-flip':
      return cardFlip(voice, t);
    case 'card-hover':
      return cardHover(voice, t);
    case 'card-select':
      return cardSelect(voice, t);
    case 'toy-hit':
      return toyHit(voice, t, event);
    case 'toy-grab':
      return toyGrab(voice, t);
    case 'player-join':
      return playerJoin(voice, t);
    case 'player-ready':
      return playerReady(voice, t);
    case 'game-start':
      return gameStart(voice, t);
    case 'round-start':
      return roundStart(voice, t);
    case 'player-played':
      return playerPlayed(voice, t);
    case 'judging-start':
      return judgingStart(voice, t);
    case 'round-won':
      return roundWon(voice, t, event);
    case 'round-aborted':
      return roundAborted(voice, t);
    case 'game-end':
      return gameEnd(voice, t, event);
    case 'ui-click':
      return uiClick(voice, t);
    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}

// Musical events keep their pitch; effects get a little random detune.
const MUSICAL = new Set<FxEvent['type']>([
  'player-ready',
  'round-start',
  'round-won',
  'round-aborted',
  'game-end'
]);

/** Pitch jitter amount for an event type (fraction, e.g. 0.05 = ±5%). */
export function pitchJitter(type: FxEvent['type']) {
  return MUSICAL.has(type) ? 0.008 : 0.05;
}

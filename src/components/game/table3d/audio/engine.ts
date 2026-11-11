// The audio engine: one lazily created AudioContext, a master chain that can't
// clip, a small dark-room reverb, and voice management. Plain TypeScript.
import type { FxEvent } from '../store';
import { pitchJitter, renderEvent } from './recipes';
import { createVoice, makeNoises, rnd, type Noises } from './synth';

const MASTER_VOLUME = 0.9;
const MAX_VOICES = 28;
// Frequent, low-value events are the first to be dropped under load.
const LOW_PRIORITY_VOICES = 16;
const LOW_PRIORITY = new Set<FxEvent['type']>([
  'card-hover',
  'card-slide',
  'toy-hit',
  'toy-grab',
  'ui-click'
]);

// Minimum milliseconds between two events of a type.
const RATE_LIMIT_MS: Partial<Record<FxEvent['type'], number>> = {
  'card-hover': 70,
  'card-slide': 90,
  'card-deal': 30,
  'card-flip': 45,
  'card-select': 60,
  'toy-hit': 40,
  'toy-grab': 60,
  'ui-click': 30
};
const DEFAULT_RATE_LIMIT_MS = 20;

export type Master = {
  // Dry voices connect here.
  input: AudioNode;
  // Reverb sends connect here.
  reverb: AudioNode;
  gain: GainNode;
};

/** A dark, short decaying-noise impulse: a small room with soft walls. */
function makeImpulse(ctx: BaseAudioContext, seconds = 0.6) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < length; i++) {
      const progress = i / length;
      // The room darkens as it decays: the filter closes over time.
      lp += (Math.random() * 2 - 1 - lp) * (0.55 - 0.42 * progress);
      data[i] = lp * Math.exp(-progress * 6.5) * (i < 40 ? i / 40 : 1);
    }
  }
  return impulse;
}

/**
 * gain, reverb, compressor, soft clip, destination. The soft clip is a hard
 * ceiling just under full scale, so no pile-up can ever exceed 0 dBFS.
 * @example const master = buildMaster(ctx, 0.9);
 */
export function buildMaster(ctx: BaseAudioContext, volume: number): Master {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -16;
  compressor.knee.value = 12;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.2;
  const ceiling = ctx.createWaveShaper();
  const curve = new Float32Array(2049);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / 1024 - 1) * 1.2;
    curve[i] = (0.97 * Math.tanh(x)) / Math.tanh(1.2);
  }
  ceiling.curve = curve;
  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.9;
  reverb.connect(wet);
  wet.connect(gain);
  gain.connect(compressor);
  compressor.connect(ceiling);
  ceiling.connect(ctx.destination);
  return { input: gain, reverb, gain };
}

export type EngineStats = {
  state: AudioContextState | 'none';
  triggered: number;
  dropped: number;
  byType: Record<string, number>;
};

/**
 * Creates an engine. No AudioContext exists until `unlock()`.
 * @example const engine = createEngine(); engine.unlock(); engine.play(event);
 */
export function createEngine() {
  let ctx: AudioContext | null = null;
  let noises: Noises | null = null;
  let master: Master | null = null;
  let isMuted = false;
  let active = 0;
  let isDisposed = false;
  const lastPlayed = new Map<string, number>();
  const stats: EngineStats = {
    state: 'none',
    triggered: 0,
    dropped: 0,
    byType: {}
  };

  // Barely-there room tone: low-passed brown noise with a slow drift.
  function startRoomTone(c: AudioContext, m: Master, n: Noises) {
    const src = c.createBufferSource();
    src.buffer = n.brown;
    src.loop = true;
    const lowpass = c.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 170;
    const bed = c.createGain();
    bed.gain.setValueAtTime(0, c.currentTime);
    bed.gain.linearRampToValueAtTime(0.035, c.currentTime + 4);
    const drift = c.createOscillator();
    drift.frequency.value = 0.07;
    const depth = c.createGain();
    depth.gain.value = 60;
    drift.connect(depth);
    depth.connect(lowpass.frequency);
    src.connect(lowpass);
    lowpass.connect(bed);
    bed.connect(m.input);
    src.start();
    drift.start();
  }

  function init() {
    ctx = new AudioContext({ latencyHint: 'interactive' });
    noises = makeNoises(ctx);
    master = buildMaster(ctx, isMuted ? 0 : MASTER_VOLUME);
    startRoomTone(ctx, master, noises);
    ctx.onstatechange = () => {
      stats.state = ctx?.state ?? 'none';
    };
    stats.state = ctx.state;
  }

  return {
    stats,
    // Call from a user gesture: creates and resumes the context.
    unlock() {
      if (isDisposed) return;
      if (!ctx) init();
      if (ctx && ctx.state !== 'running') void ctx.resume();
    },
    isUnlocked: () => ctx?.state === 'running',
    setMuted(next: boolean) {
      isMuted = next;
      if (!ctx || !master) return;
      master.gain.gain.setTargetAtTime(
        next ? 0 : MASTER_VOLUME,
        ctx.currentTime,
        0.03
      );
    },
    play(event: FxEvent) {
      // Before the first gesture sounds are dropped, never queued.
      if (!ctx || !master || !noises || ctx.state !== 'running' || isMuted) {
        stats.dropped++;
        return;
      }
      const now = performance.now();
      const limit = RATE_LIMIT_MS[event.type] ?? DEFAULT_RATE_LIMIT_MS;
      if (now - (lastPlayed.get(event.type) ?? -Infinity) < limit) return;
      const isCrowded =
        active >= MAX_VOICES ||
        (active >= LOW_PRIORITY_VOICES && LOW_PRIORITY.has(event.type));
      if (isCrowded) {
        stats.dropped++;
        return;
      }
      lastPlayed.set(event.type, now);

      // Position: subtle pan from x, slight distance attenuation.
      const at = 'at' in event ? event.at : undefined;
      const pan = at ? Math.max(-0.6, Math.min(0.6, at[0] * 0.6)) : 0;
      const distance = at ? Math.min(1.5, Math.hypot(at[0], at[2])) : 0;
      const jitter = pitchJitter(event.type);
      active++;
      const voice = createVoice(ctx, noises, master.input, master.reverb, {
        pan,
        gain: (1 - 0.15 * distance) * rnd(0.85, 1.1),
        wet: 0.18,
        pitch: rnd(1 - jitter, 1 + jitter),
        onDone: () => {
          active--;
        }
      });
      renderEvent(voice, ctx.currentTime + rnd(0.001, 0.012), event);
      stats.triggered++;
      stats.byType[event.type] = (stats.byType[event.type] ?? 0) + 1;
    },
    dispose() {
      isDisposed = true;
      const closing = ctx;
      ctx = null;
      master = null;
      stats.state = 'none';
      if (closing && closing.state !== 'closed') void closing.close();
    }
  };
}

export type Engine = ReturnType<typeof createEngine>;

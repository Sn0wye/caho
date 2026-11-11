// Tiny synthesis helpers shared by every recipe. Plain TypeScript, no React.
// Everything takes a BaseAudioContext so recipes render live or offline.

export type Noises = {
  white: AudioBuffer;
  pink: AudioBuffer;
  brown: AudioBuffer;
};

/**
 * Two-second mono noise buffers, made once per context.
 * @example const noises = makeNoises(ctx);
 */
export function makeNoises(ctx: BaseAudioContext): Noises {
  const length = Math.floor(ctx.sampleRate * 2);
  const make = () => ctx.createBuffer(1, length, ctx.sampleRate);
  const white = make();
  const pink = make();
  const brown = make();
  const w = white.getChannelData(0);
  const p = pink.getChannelData(0);
  const b = brown.getChannelData(0);
  // Paul Kellet's economy pink filter; brown is a leaky integrator.
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let last = 0;
  for (let i = 0; i < length; i++) {
    const x = Math.random() * 2 - 1;
    w[i] = x;
    b0 = 0.99765 * b0 + x * 0.099046;
    b1 = 0.963 * b1 + x * 0.2965164;
    b2 = 0.57 * b2 + x * 1.0526913;
    p[i] = (b0 + b1 + b2 + x * 0.1848) * 0.2;
    last = (last + 0.02 * x) / 1.02;
    b[i] = last * 3.5;
  }
  return { white, pink, brown };
}

export type Voice = {
  ctx: BaseAudioContext;
  noises: Noises;
  // Where a recipe connects its sources.
  input: AudioNode;
  // Multiplier on every frequency, for per-trigger variation.
  pitch: number;
  // Reverb send level (0 to 1); recipes may raise it.
  setWet: (amount: number) => void;
  // Registers a source and the nodes it feeds; they are released when it ends.
  track: (source: AudioScheduledSourceNode, ...chain: AudioNode[]) => void;
  // Sources still sounding: 0 once the voice has fully finished.
  live: () => number;
};

export type VoiceOptions = {
  gain?: number;
  pan?: number;
  wet?: number;
  pitch?: number;
  onDone?: () => void;
};

/**
 * A per-event mini mixer: gain, pan and reverb send into the master chain.
 * @example const voice = createVoice(ctx, noises, master.input, master.reverb);
 */
export function createVoice(
  ctx: BaseAudioContext,
  noises: Noises,
  dest: AudioNode,
  reverb: AudioNode | null,
  options: VoiceOptions = {}
): Voice {
  const input = ctx.createGain();
  input.gain.value = options.gain ?? 1;
  const panner = ctx.createStereoPanner();
  panner.pan.value = options.pan ?? 0;
  input.connect(panner);
  panner.connect(dest);
  let send: GainNode | null = null;
  if (reverb) {
    send = ctx.createGain();
    send.gain.value = options.wet ?? 0.2;
    panner.connect(send);
    send.connect(reverb);
  }
  let live = 0;
  return {
    ctx,
    noises,
    input,
    pitch: options.pitch ?? 1,
    setWet: amount => {
      if (send) send.gain.value = amount;
    },
    track: (source, ...chain) => {
      live++;
      source.onended = () => {
        source.disconnect();
        for (const node of chain) node.disconnect();
        if (--live > 0) return;
        input.disconnect();
        panner.disconnect();
        send?.disconnect();
        options.onDone?.();
      };
    },
    live: () => live
  };
}

/** Random number in [min, max). */
export function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const FLOOR = 0.0001;

type FilterOptions = {
  type: BiquadFilterType;
  f: number;
  f2?: number;
  q?: number;
};

function makeFilter(
  voice: Voice,
  o: FilterOptions,
  t: number,
  dur: number
): BiquadFilterNode {
  const filter = voice.ctx.createBiquadFilter();
  filter.type = o.type;
  filter.frequency.setValueAtTime(o.f * voice.pitch, t);
  if (o.f2) {
    filter.frequency.exponentialRampToValueAtTime(o.f2 * voice.pitch, t + dur);
  }
  filter.Q.value = o.q ?? 0.7;
  return filter;
}

type ToneOptions = {
  t: number;
  f: number;
  // Glide target, reached after `sweep` seconds (default: the duration).
  f2?: number;
  sweep?: number;
  dur: number;
  g: number;
  type?: OscillatorType;
  attack?: number;
  filter?: FilterOptions;
  detune?: number;
};

/**
 * One enveloped oscillator: fast attack, exponential decay to silence.
 * @example tone(voice, { t, f: 180, f2: 70, dur: 0.12, g: 0.5 });
 */
export function tone(voice: Voice, o: ToneOptions) {
  const { ctx } = voice;
  const osc = ctx.createOscillator();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.f * voice.pitch, o.t);
  if (o.f2) {
    osc.frequency.exponentialRampToValueAtTime(
      o.f2 * voice.pitch,
      o.t + (o.sweep ?? o.dur)
    );
  }
  if (o.detune) osc.detune.value = o.detune;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(FLOOR, o.t);
  gain.gain.linearRampToValueAtTime(o.g, o.t + (o.attack ?? 0.003));
  gain.gain.exponentialRampToValueAtTime(FLOOR, o.t + o.dur);
  osc.connect(gain);
  const chain: AudioNode[] = [gain];
  let tail: AudioNode = gain;
  if (o.filter) {
    const filter = makeFilter(voice, o.filter, o.t, o.dur);
    gain.connect(filter);
    chain.push(filter);
    tail = filter;
  }
  tail.connect(voice.input);
  osc.start(o.t);
  osc.stop(o.t + o.dur + 0.03);
  voice.track(osc, ...chain);
}

type NoiseOptions = {
  t: number;
  dur: number;
  g: number;
  kind?: keyof Noises;
  attack?: number;
  // 'swell' rises exponentially and cuts off, for crescendos.
  shape?: 'decay' | 'swell';
  filter?: FilterOptions;
};

/**
 * One enveloped, filtered noise burst taken from a random spot of the buffer.
 * @example noise(voice, { t, dur: 0.1, g: 0.3, filter: { type: 'bandpass', f: 3000 } });
 */
export function noise(voice: Voice, o: NoiseOptions) {
  const { ctx } = voice;
  const buffer = voice.noises[o.kind ?? 'white'];
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  if (o.shape === 'swell') {
    gain.gain.setValueAtTime(FLOOR, o.t);
    gain.gain.exponentialRampToValueAtTime(o.g, o.t + o.dur * 0.96);
    gain.gain.linearRampToValueAtTime(FLOOR, o.t + o.dur);
  } else {
    gain.gain.setValueAtTime(FLOOR, o.t);
    gain.gain.linearRampToValueAtTime(o.g, o.t + (o.attack ?? 0.002));
    gain.gain.exponentialRampToValueAtTime(FLOOR, o.t + o.dur);
  }
  src.connect(gain);
  const chain: AudioNode[] = [gain];
  let tail: AudioNode = gain;
  if (o.filter) {
    const filter = makeFilter(voice, o.filter, o.t, o.dur);
    gain.connect(filter);
    chain.push(filter);
    tail = filter;
  }
  tail.connect(voice.input);
  src.start(o.t, rnd(0, buffer.duration - o.dur - 0.1), o.dur + 0.03);
  voice.track(src, ...chain);
}

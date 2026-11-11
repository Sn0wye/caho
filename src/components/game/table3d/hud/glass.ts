// Shared look of the HUD: dark glass over a dark scene, one warm accent.
export const glass =
  'border border-white/10 bg-zinc-950/55 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl';

// The lamp-lit primary action.
export const lampButton =
  'pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-7 text-sm font-semibold text-zinc-950 shadow-[0_0_28px_rgba(251,191,36,0.35),0_6px_18px_rgba(0,0,0,0.5)] transition hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-60';

export const quietButton =
  'pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 text-sm font-medium text-zinc-100 backdrop-blur-md transition hover:bg-white/14 active:scale-95 disabled:pointer-events-none disabled:opacity-50';

// Entrances are short and ease out.
export const popIn = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
};

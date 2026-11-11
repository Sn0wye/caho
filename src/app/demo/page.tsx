import type { DemoOptions, DemoPhase } from '@/hooks/demo-room';
import { DemoGame } from './demo-game';

type DemoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PHASES: DemoPhase[] = ['lobby', 'playing', 'judging', 'finished'];

// A Room played against bots in the browser, no backend or login needed.
//   /demo                      lobby, you click through
//   /demo?auto=1               attract mode: your seat plays itself
//   /demo?phase=judging&judge=me&bots=5&pick=2&speed=2&layout=table
export default async function DemoPage({ searchParams }: DemoPageProps) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const number = (key: string, fallback: number, min: number, max: number) => {
    const value = Number(get(key));
    return Number.isFinite(value) && get(key) !== undefined
      ? Math.min(max, Math.max(min, value))
      : fallback;
  };
  const phase = PHASES.find(candidate => candidate === get('phase')) ?? 'lobby';
  const pick = get('pick') ? number('pick', 1, 1, 3) : null;

  const options: DemoOptions = {
    bots: Math.round(number('bots', 4, 2, 7)),
    phase,
    selfIsJudge: get('judge') === 'me',
    pick,
    auto: get('auto') === '1',
    maxPoints: Math.round(number('points', 5, 1, 30)),
    speed: number('speed', 1, 0.25, 10),
    seed: Math.round(number('seed', 7, 0, 1e9))
  };

  return <DemoGame options={options} layout={get('layout') ?? null} />;
}

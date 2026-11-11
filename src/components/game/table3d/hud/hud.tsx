'use client';

import { useStage } from '../use-table';
import { ActionBar } from './action-bar';
import { FinishedPanel } from './finished-panel';
import { ResultBanner } from './result-banner';
import { Scoreboard } from './scoreboard';
import { StatusPill } from './status-pill';
import { FirstVisitHint, TableControls } from './table-controls';

/**
 * Every 2D control over the 3D table. Containers ignore the pointer so the
 * canvas (and the hand along the bottom) stays interactive; only real controls
 * opt back in.
 */
export default function Hud() {
  const stage = useStage();
  const isFinished = stage.kind === 'finished';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-zinc-100">
      {!isFinished && (
        <>
          <div className="absolute top-4 left-4">
            <Scoreboard stage={stage} />
          </div>
          <div className="absolute inset-x-0 top-4 flex justify-center px-64">
            <StatusPill stage={stage} />
          </div>
        </>
      )}
      <ActionBar stage={stage} />
      <ResultBanner stage={stage} />
      {isFinished && <FinishedPanel />}
      <FirstVisitHint />
      <TableControls />
    </div>
  );
}

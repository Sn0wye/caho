'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { CursorPosition } from '@/contracts';
import { tableToScreen, type TableView } from './table-geometry';

const TableViewContext = createContext<TableView | null>(null);

export const TableViewProvider = TableViewContext.Provider;

export function useTableView(): TableView {
  const view = useContext(TableViewContext);
  if (!view) throw new Error('useTableView must be used inside <GameTable>');
  return view;
}

type FeltAnchorProps = {
  position: CursorPosition;
  // Turns the content on the felt, e.g. a card toward its seat. Defaults to
  // upright for this Player.
  turnDeg?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Lays its children flat on the felt, centred on a table-space point. Lives in
 * the spun world layer, so by default it un-spins to read upright.
 *
 * @example
 * <FeltAnchor position={{ x: 0, y: 0 }}><BlackCard card={card} /></FeltAnchor>
 */
export function FeltAnchor({
  position,
  turnDeg,
  className,
  children
}: FeltAnchorProps) {
  const { radius, spinDeg } = useTableView();
  const turn = turnDeg ?? -spinDeg;

  return (
    <div
      className={cn('absolute top-1/2 left-1/2 h-0 w-0', className)}
      style={{
        transform: `translate(${position.x * radius}px, ${position.y * radius}px) rotate(${turn}deg)`
      }}
    >
      <div className="pointer-events-auto absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
}

type StandingAnchorProps = {
  position: CursorPosition;
  className?: string;
  // Scale with distance, so far seats look smaller (the 2.5D cue).
  perspectiveScale?: boolean;
  // Height above the felt, in table units, e.g. over a lifted card.
  height?: number;
  children: ReactNode;
};

/**
 * Draws its children over the scene at the screen point above a table-space
 * point, with the content's top-left there (a cursor's tip). Drawn flat over
 * the 3D stage, so the felt can never hide it.
 *
 * @example
 * <StandingAnchor position={cursor}><Pointer /></StandingAnchor>
 */
export function StandingAnchor({
  position,
  className,
  perspectiveScale = false,
  height = 0,
  children
}: StandingAnchorProps) {
  const view = useTableView();
  const screen = tableToScreen(position, view, height);
  const scale = perspectiveScale ? ` scale(${screen.scale})` : '';

  return (
    <div
      className={cn('absolute top-0 left-0', className)}
      style={{
        transform: `translate(${screen.x}px, ${screen.y}px)${scale}`,
        transformOrigin: '0 0'
      }}
    >
      {children}
    </div>
  );
}

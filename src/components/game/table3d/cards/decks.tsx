'use client';

import { useEffect, useMemo } from 'react';
import { deckSpot, flatPose } from '../space';
import {
  acquireFace,
  backMaterial,
  deckSideMaterial,
  releaseFace
} from './art';
import { makeDeckGeometry } from './geometry';
import { DECK_DEPTH, fromCardPose, makeTarget } from './poses';

type DecksProps = { seatCount: number };

/**
 * The two draw piles, white and black, lying face down where `deckSpot`
 * puts them.
 *
 * @example
 * <Decks seatCount={seats.length} />
 */
export function Decks({ seatCount }: DecksProps) {
  return (
    <>
      <Deck deck="white" seatCount={seatCount} />
      <Deck deck="black" seatCount={seatCount} />
    </>
  );
}

function Deck({
  deck,
  seatCount
}: {
  deck: 'white' | 'black';
  seatCount: number;
}) {
  const depth = DECK_DEPTH[deck];
  const geometry = useMemo(() => makeDeckGeometry(depth), [depth]);
  const materials = useMemo(
    () => [
      acquireFace({ kind: deck === 'white' ? 'white-blank' : 'black-blank' }),
      backMaterial(deck),
      deckSideMaterial(deck)
    ],
    [deck]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => releaseFace(materials[0]), [materials]);

  const target = useMemo(() => {
    const { point, yaw } = deckSpot(deck, seatCount);
    // A little skew so the two piles don't look machine-placed.
    const skew = deck === 'white' ? 0.08 : -0.06;
    return fromCardPose(
      makeTarget(),
      flatPose(point, yaw + skew, { faceDown: true, height: depth / 2 })
    );
  }, [deck, seatCount, depth]);

  return (
    <mesh
      geometry={geometry}
      material={materials}
      position={target.position}
      quaternion={target.quaternion}
      castShadow
      receiveShadow
    />
  );
}

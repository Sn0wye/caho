'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshBasicMaterial, type Mesh } from 'three';
import { useGame } from '@/hooks/game';
import { useAnswerCards } from '../../table/table-judging';
import { useHandSize, useJudge, useSeats, useStage } from '../use-table';
import { setAnisotropy } from './art';
import { CardMesh } from './card-mesh';
import { Decks } from './decks';
import { CardWorld } from './world';

/**
 * Every card on the table: the decks, each Player's Hand, picks, played
 * piles, the judging grid, the hero Black Card and the trophies. Cards are
 * persistent entities that travel between those places (see world.ts).
 *
 * @example
 * <Canvas><Cards3D /></Canvas>
 */
export default function Cards3D() {
  const game = useGame();
  const stage = useStage();
  const { seats, self } = useSeats();
  const handSize = useHandSize();
  const judge = useJudge();
  const rects = useAnswerCards(judge.answers.length);
  const gl = useThree(state => state.gl);
  const [world] = useState(() => new CardWorld());
  const ids = useSyncExternalStore(world.subscribe, world.getIds, world.getIds);

  useLayoutEffect(() => {
    setAnisotropy(gl.capabilities.getMaxAnisotropy());
  }, [gl]);

  const {
    judgeId,
    isJudge,
    hasPlayed,
    visibleHand,
    selectedCards,
    playedCards,
    isSelectionComplete,
    cursors,
    selectCard,
    unselectCard
  } = game;

  useLayoutEffect(() => {
    world.sync({
      stage,
      seats,
      self,
      judgeId,
      isJudge,
      hasPlayed,
      visibleHand,
      selectedCards,
      playedCards,
      isSelectionComplete,
      handSize,
      answers: judge.answers,
      rects,
      chosenPlayerId: judge.chosenPlayerId,
      isPending: judge.isPending,
      cursors,
      selectCard,
      unselectCard,
      setChosenPlayerId: judge.setChosenPlayerId
    });
  }, [
    world,
    stage,
    seats,
    self,
    judgeId,
    isJudge,
    hasPlayed,
    visibleHand,
    selectedCards,
    playedCards,
    isSelectionComplete,
    handSize,
    judge.answers,
    rects,
    judge.chosenPlayerId,
    judge.isPending,
    judge.setChosenPlayerId,
    cursors,
    selectCard,
    unselectCard
  ]);

  useEffect(() => () => world.dispose(), [world]);

  useFrame((state, delta) => world.frame(state.camera, delta));

  return (
    <group>
      <Decks seatCount={Math.max(seats.length, 1)} />
      <HandBand world={world} />
      {ids.map(id => (
        <CardMesh key={id} world={world} id={id} />
      ))}
    </group>
  );
}

// Never drawn, only hit: see CardWorld.placeHandBand.
const bandMaterial = new MeshBasicMaterial({
  colorWrite: false,
  depthWrite: false,
  depthTest: false
});

function HandBand({ world }: { world: CardWorld }) {
  const ref = useRef<Mesh>(null);
  useLayoutEffect(() => {
    world.handBand = ref.current;
    return () => {
      world.handBand = null;
    };
  }, [world]);
  return (
    <mesh
      ref={ref}
      material={bandMaterial}
      matrixAutoUpdate={false}
      frustumCulled={false}
      visible={false}
      onPointerMove={event => world.bandMove(event)}
      onPointerOut={() => world.bandOut()}
      onClick={event => world.bandClick(event)}
    >
      <planeGeometry />
    </mesh>
  );
}

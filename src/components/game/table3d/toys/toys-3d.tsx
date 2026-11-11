'use client';

// The physics toys: dice, poker chips and a rubber duck you can grab, flick
// and throw. The simulation is local to each client: nothing here is synced
// over the network, so every Player has their own toys.
import { Suspense, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import {
  Physics,
  useAfterPhysicsStep,
  useBeforePhysicsStep
} from '@react-three/rapier';
import { useSeats } from '../use-table';
import { Chips } from './chips';
import { Dice } from './dice';
import { Duck } from './duck';
import { TableColliders } from './table-colliders';
import { toySpots } from './toy-spots';
import { GRAVITY, ToyWorld, ToyWorldProvider } from './toy-world';

export default function Toys3D() {
  // Rapier loads its WASM lazily.
  return (
    <Suspense fallback={null}>
      <Physics
        gravity={[0, GRAVITY, 0]}
        colliders={false}
        timeStep={1 / 60}
        // Toys are centimetre-sized in a world where 1 unit is the table's
        // radius: scale Rapier's tolerances and sleep thresholds to match.
        lengthUnit={0.1}
        // Stiffer contacts: a stack of light chips otherwise sinks into the
        // felt and into itself under its own weight.
        contactNaturalFrequency={60}
      >
        <ToyTable />
      </Physics>
    </Suspense>
  );
}

function ToyTable() {
  const world = useMemo(() => new ToyWorld(), []);
  const get = useThree(state => state.get);
  const canvas = useThree(state => state.gl.domElement);

  useEffect(() => {
    world.getCamera = () => get().camera;
    world.canvas = canvas;
    // Never leave the camera thinking a toy is still in hand.
    return () => world.release();
  }, [world, get, canvas]);

  useBeforePhysicsStep(step => world.beforeStep(step.timestep));
  useAfterPhysicsStep(step => world.afterStep(step.timestep));

  const { seats, self } = useSeats();
  const spots = useMemo(() => toySpots(seats, self), [seats, self]);

  return (
    <ToyWorldProvider value={world}>
      <TableColliders />
      <Dice spot={spots.dice} />
      <Chips spot={spots.chips} />
      <Duck spot={spots.duck} />
    </ToyWorldProvider>
  );
}

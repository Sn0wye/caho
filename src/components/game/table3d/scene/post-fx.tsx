'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  Noise,
  SMAA,
  ToneMapping,
  Vignette
} from '@react-three/postprocessing';
import {
  BlendFunction,
  EffectPass,
  KernelSize,
  ToneMappingMode,
  type EffectComposer as Composer
} from 'postprocessing';
import { HalfFloatType } from 'three';

/**
 * The final image: bloom on emissives only, the same neutral tone curve as
 * the renderer, a soft vignette, a little grain, dithering and SMAA.
 *
 * @example
 * <Canvas><PostFx /></Canvas>
 */
export default function PostFx() {
  const composer = useRef<Composer>(null);
  // The room is mostly near-black gradients (vignette, haze, wall glows):
  // dither the 8-bit output so they don't band. The passes are rebuilt when
  // effects change, so keep checking; it's a few property reads a frame.
  useFrame(() => {
    for (const pass of composer.current?.passes ?? []) {
      if (pass instanceof EffectPass && !pass.dithering) pass.dithering = true;
    }
  });

  return (
    // Half float keeps the HDR range so the threshold can tell neon (> 1)
    // from a white card under the lamp (< 0.9). No MSAA: with three 0.187 the
    // multisampled input buffer blacks out the mipmap bloom, so SMAA it is.
    <EffectComposer
      ref={composer}
      multisampling={0}
      frameBufferType={HalfFloatType}
    >
      <Bloom
        mipmapBlur
        luminanceThreshold={1.15}
        luminanceSmoothing={0.15}
        intensity={1.1}
        radius={0.72}
        kernelSize={KernelSize.LARGE}
      />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.28} darkness={0.62} />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.12}
      />
      <SMAA />
    </EffectComposer>
  );
}

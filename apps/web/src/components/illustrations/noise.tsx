import Image from 'next/image';
import { cn } from '@/utils/cn';
import noiseImage from '../../assets/noise.png';

interface NoiseProps {
  className?: string;
}

export function Noise({ className }: NoiseProps) {
  return (
    <Image
      src={noiseImage}
      className={cn(
        'pointer-events-none absolute left-0 top-0 h-full w-full object-cover mix-blend-overlay',
        className
      )}
      alt=""
      priority
    />
  );
}

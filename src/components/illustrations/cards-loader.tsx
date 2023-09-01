'use client';

import { motion, MotionConfig } from 'framer-motion';
import { LogoSingleCard } from './logo-single-card';

interface CardsLoaderProps {}

export function CardsLoader({}: CardsLoaderProps) {
  return (
    <motion.div
      className="flex -space-x-1 animate-pulse"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 0.75
      }}
    >
      <MotionConfig transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: 'linear' }}>
        <motion.div
          initial={{
            rotate: -30
          }}
          animate={{
            rotate: [-30, -10, -30]
          }}
        >
          <LogoSingleCard variant="blackCard" />
        </motion.div>

        <motion.div
          initial={{
            rotate: 30
          }}
          animate={{
            rotate: [30, 10, 30]
          }}
        >
          <LogoSingleCard variant="whiteCard" />
        </motion.div>
      </MotionConfig>
    </motion.div>
  );
}

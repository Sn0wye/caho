'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AlertTopbarProps {
  icon?: ReactNode;
  label: string;
}

export function AlertTopbar({ icon, label }: AlertTopbarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          exit={{ height: 0, speed: 150 }}
          className={cn(
            'flex w-full items-center justify-center bg-geist-orange px-8 py-2 font-mono text-sm font-black text-zinc-950'
          )}
        >
          <div className="flex w-full grow items-center justify-center gap-2">
            {icon}
            <span className="bg-zinc-950 p-2 leading-none text-zinc-50">
              AVISO IMPORTANTE
            </span>
            <span>{label}</span>
          </div>

          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

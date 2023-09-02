'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const alertTopBarVariants = cva(
  'flex flex-col rounded-md lg:flex-row w-full lg:items-center lg:justify-center gap-4 lg:gap-2 p-4 lg:px-8 lg:py-2  text-sm font-medium relative',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-slate-100 to-slate-300 dark:bg-gradient-to-r dark:from-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-zinc-200',
        warning: 'bg-geist-orange text-zinc-950',
        destructive: 'bg-geist-red text-zinc-950'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

interface AlertTopBarProps extends VariantProps<typeof alertTopBarVariants> {
  icon?: ReactNode;
  label: string;
  actionLabel?: string;
  actionHref?: string;
  isExternal?: boolean;
}

export function AlertTopBar({
  icon,
  label,
  actionLabel,
  actionHref,
  variant,
  isExternal = false
}: AlertTopBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          exit={{ height: 0, speed: 150 }}
          className={cn(alertTopBarVariants({ variant }))}
        >
          <div className="flex w-full grow flex-col gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-2">
            <div className="flex items-center justify-between">
              {icon}

              <DiscloseButton setIsOpen={setIsOpen} />
            </div>

            <span className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
              <span>{label}</span>
              {actionLabel && actionHref && (
                <Link
                  href={actionHref}
                  {...(isExternal && {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  })}
                  className="w-fit underline underline-offset-4"
                >
                  {actionLabel}
                </Link>
              )}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DiscloseButton({
  setIsOpen
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <button
      className="flex items-center justify-center p-2 lg:absolute lg:right-2 lg:top-1/2 lg:-translate-y-1/2"
      onClick={() => setIsOpen(false)}
    >
      <X size={16} />
    </button>
  );
}

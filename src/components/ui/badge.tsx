import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
  'inline-flex rounded font-bold items-center justify-center border border-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-800',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900',
        secondary:
          'border-transparent dark:border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400',
        destructive:
          'border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/80',
        outline: 'text-zinc-950 dark:text-zinc-50',
        purple: 'border-none bg-violet-600 dark:bg-violet-700 text-white',
        orange: 'border-none bg-orange-400 dark:bg-orange-500 text-white',
        ghost:
          'border-none bg-zinc-200 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700'
      },
      size: {
        default: 'px-2 py-1 text-xs',
        avatar: 'p-1 text-2xs !leading-none w-full',
        fit: 'px-2 py-1 text-xs w-fit'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

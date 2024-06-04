import type * as React from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-zinc-200  bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-800',
      className
    )}
    {...props}
  />
);

Textarea.displayName = 'Textarea';

export { Textarea };

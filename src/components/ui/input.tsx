import type * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-black ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900/10 dark:text-white dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-800',
      className
    )}
    {...props}
  />
);
Input.displayName = 'Input';

export { Input };

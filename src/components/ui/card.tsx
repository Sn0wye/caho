import type * as React from 'react';
import { cn } from '@/utils/cn';

const Card = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-xs dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-50',
      className
    )}
    {...props}
  />
);
Card.displayName = 'Card';

const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col space-y-3 p-6', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, ...props }: React.ComponentProps<'h3'>) => (
  <h3
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<'p'>) => (
  <p
    className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

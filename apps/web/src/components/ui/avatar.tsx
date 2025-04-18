'use client';

import type * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        default: 'grayscale-0',
        ghost: 'grayscale'
      },
      size: {
        sm: 'w-8 h-8',
        default: 'w-10 h-10',
        lg: 'w-12 h-12'
      },
      ring: {
        default: 'ring-none',
        teal: 'ring-2 ring-teal-500 ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-950',
        orange:
          'ring-2 ring-orange-400 ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-950',
        tealOrange: 'ring-none',
        ghost:
          'ring-2 ring-zinc-200 dark:ring-zinc-900 ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-950'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      ring: 'default'
    }
  }
);

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

const Avatar = ({ className, variant, size, ring, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn(avatarVariants({ variant, size, ring }), className)}
    {...props}
  />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800',
      className
    )}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };

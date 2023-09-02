'use client';

import * as React from 'react';
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

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, variant, size, ring, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ variant, size, ring }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };

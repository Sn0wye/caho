import type * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Viewport>) => (
  <ToastPrimitives.Viewport
    className={cn(
      'fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group rounded-md pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden border border-zinc-200 p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full dark:border-zinc-800',
  {
    variants: {
      variant: {
        default: 'border bg-white dark:bg-zinc-950',
        destructive:
          'destructive group border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-zinc-950',
        warning:
          'warning group border-orange-500 bg-orange-500 text-zinc-50 dark:border-orange-900 dark:bg-zinc-950'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const Toast = ({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>) => {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Action>) => (
  <ToastPrimitives.Action
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center border border-zinc-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-zinc-100/40 hover:group-[.destructive]:border-red-500/30 hover:group-[.destructive]:bg-red-500 hover:group-[.destructive]:text-zinc-50 focus:group-[.destructive]:ring-red-500 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:hover:bg-zinc-800 dark:focus:ring-zinc-800 dark:group-[.destructive]:border-zinc-800/40 dark:hover:group-[.destructive]:border-red-900/30 dark:hover:group-[.destructive]:bg-red-900 dark:hover:group-[.destructive]:text-red-50 dark:focus:group-[.destructive]:ring-red-900',
      className
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Close>) => (
  <ToastPrimitives.Close
    className={cn(
      'absolute right-2 top-2 p-1 text-zinc-950/50 hover:text-zinc-950 focus:outline-hidden focus:ring-2 group-hover:opacity-100 dark:text-zinc-50/50 dark:hover:text-zinc-50',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Title>) => (
  <ToastPrimitives.Title
    className={cn(
      'w-fit bg-zinc-950 px-2 py-1 font-mono text-sm font-bold leading-none! text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:group-[.destructive]:bg-red-500 dark:group-[.warning]:bg-orange-500 dark:group-[.destructive]:text-zinc-50 dark:group-[.warning]:text-zinc-50',
      className
    )}
    {...props}
  />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Description>) => (
  <ToastPrimitives.Description
    className={cn('mt-1 text-sm opacity-90', className)}
    {...props}
  />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentProps<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps
};

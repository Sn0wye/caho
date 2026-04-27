import { cva, type VariantProps } from 'class-variance-authority';
import { Hash } from 'lucide-react';

const cardHeaderVariants = cva(
  'flex w-full items-center justify-end gap-1 font-mono font-medium',
  {
    variants: {
      variant: {
        default: 'dark:text-zinc-100 text-zinc-800',
        whiteCard: 'text-zinc-800',
        blackCard: 'text-zinc-100'
      },
      size: {
        sm: 'text-2xs',
        default: 'text-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

type CardHeaderProps = VariantProps<typeof cardHeaderVariants> & {
  packId: string;
};

export function CardHeader({ packId, variant, size }: CardHeaderProps) {
  return (
    <header className={cardHeaderVariants({ variant, size })}>
      <Hash size={14} className="text-geist-orange" />
      <span>{packId}</span>
    </header>
  );
}

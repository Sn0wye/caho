import { cva, type VariantProps } from 'class-variance-authority';
import { siteConfig } from 'config/site';
import { LogoIcon } from '@/components/brand/logo-icon';

const cardFooterVariants = cva('flex items-center gap-4 font-bold ', {
  variants: {
    variant: {
      default: 'text-zinc-800 dark:text-zinc-100',
      whiteCard: 'text-zinc-800',
      blackCard: 'text-zinc-100'
    },
    size: {
      sm: 'text-xs',
      default: 'text-base max-w-[75%]'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

type CardFooterProps = VariantProps<typeof cardFooterVariants>;

export function CardFooter({ variant, size }: CardFooterProps) {
  return (
    <footer className={cardFooterVariants({ variant, size })}>
      <LogoIcon size={size} variant={variant || 'default'} />
      <span>{siteConfig.nameLong}</span>
    </footer>
  );
}

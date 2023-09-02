import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const logoSingleCardVariants = cva('fill-current h-fit', {
  variants: {
    size: {
      default: 'w-7',
      sm: 'w-6',
      md: 'w-8',
      lg: 'w-14'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

type CardVariantsType = 'default' | 'blackCard' | 'whiteCard';

type LogoSingleCardProps = VariantProps<typeof logoSingleCardVariants> & {
  variant?: CardVariantsType;
  className?: string;
};

const logoSingleCardVariantsStyles: { [key in CardVariantsType]: string[] } = {
  default: [
    'fill-zinc-950 dark:fill-zinc-50',
    'fill-zinc-50 dark:fill-zinc-950'
  ],
  blackCard: ['fill-zinc-50', 'fill-zinc-950'],
  whiteCard: ['fill-zinc-950', 'fill-zinc-50']
};

export function LogoSingleCard({
  variant = 'default',
  size,
  className
}: LogoSingleCardProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 108 148"
      className={cn(logoSingleCardVariants({ size }), className)}
    >
      <path
        className={logoSingleCardVariantsStyles[variant as CardVariantsType][1]}
        d="M6 10a4 4 0 014-4h88a4 4 0 014 4v128a4 4 0 01-4 4H10a4 4 0 01-4-4V10z"
      ></path>
      <path
        className={logoSingleCardVariantsStyles[variant as CardVariantsType][0]}
        fillRule="evenodd"
        d="M10 0h88c5.523 0 10 4.477 10 10v128c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10V10C0 4.477 4.477 0 10 0zm0 6a4 4 0 00-4 4v128a4 4 0 004 4h88a4 4 0 004-4V10a4 4 0 00-4-4H10z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

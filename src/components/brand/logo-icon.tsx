import { cva, type VariantProps } from 'class-variance-authority';

const logoIconVariants = cva('fill-current h-fit', {
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

type LogoIconProps = VariantProps<typeof logoIconVariants> & {
  variant?: 'ghost' | 'default' | 'blackCard' | 'whiteCard';
};

const logoIconVariantsStyles = {
  default: [
    'fill-zinc-950 dark:fill-zinc-50',
    'fill-zinc-50 dark:fill-zinc-950'
  ],
  blackCard: ['fill-zinc-50', 'fill-zinc-950'],
  whiteCard: ['fill-zinc-950', 'fill-zinc-50'],
  ghost: [
    'fill-zinc-500 dark:fill-zinc-700',
    'fill-zinc-100 dark:fill-zinc-950'
  ]
};

export function LogoIcon({ variant = 'default', size }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={logoIconVariants({ size })}
      viewBox="0 0 200 200"
    >
      <path
        className={logoIconVariantsStyles[variant][0]}
        d="M11.549 62.623a4 4 0 012.027-5.281l80.392-35.793a4 4 0 015.281 2.027l52.062 116.934a4 4 0 01-2.027 5.281l-80.392 35.793a4 4 0 01-5.281-2.027L11.549 62.623z"
      ></path>
      <path
        className={logoIconVariantsStyles[variant][0]}
        fillRule="evenodd"
        d="M11.136 51.86l80.391-35.793c5.046-2.246 10.957.023 13.203 5.069l52.063 116.933c2.246 5.046-.023 10.957-5.068 13.203l-80.392 35.793c-5.046 2.246-10.957-.023-13.203-5.068L6.067 65.063c-2.246-5.045.023-10.956 5.069-13.203zm2.44 5.482a4 4 0 00-2.027 5.28L63.61 179.557a4 4 0 005.281 2.028l80.392-35.793a4 4 0 002.027-5.281L99.249 23.576a4 4 0 00-5.281-2.027L13.576 57.342z"
        clipRule="evenodd"
      ></path>
      <path
        className={logoIconVariantsStyles[variant][1]}
        d="M96.938 18a4 4 0 014-4h88a4 4 0 014 4v128a4 4 0 01-4 4h-88a4 4 0 01-4-4V18z"
      ></path>
      <path
        className={logoIconVariantsStyles[variant][0]}
        fillRule="evenodd"
        d="M100.938 8h88c5.523 0 10 4.477 10 10v128c0 5.523-4.477 10-10 10h-88c-5.523 0-10-4.477-10-10V18c0-5.523 4.477-10 10-10zm0 6a4 4 0 00-4 4v128a4 4 0 004 4h88a4 4 0 004-4V18a4 4 0 00-4-4h-88z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

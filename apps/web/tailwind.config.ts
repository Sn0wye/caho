import { type Config } from 'tailwindcss';
import { fontFamily, screens } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'light-zinc',
    'light-red',
    'light-orange',
    'light-green',
    'light-blue',
    'light-yellow',
    'light-violet',
    'light-rose',
    'light-dracula',
    'light-ocean',
    'light-nord',
    'dark-zinc',
    'dark-red',
    'dark-orange',
    'dark-green',
    'dark-blue',
    'dark-yellow',
    'dark-violet',
    'dark-rose',
    'dark-dracula',
    'dark-ocean',
    'dark-nord',
    'bg-zinc-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-violet-500',
    'bg-rose-500',
  ],
  theme: {
    screens: {
      'clerk': '30em',
      ...screens
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        theme: 'var(--theme)',
        geist: {
          yellow: '#E5C443',
          pink: '#FFA0F0',
          green: '#66CCBE',
          orange: '#F1924C',
          blue: '#5C8BD6',
          purple: '#C086EA',
          'dark-purple': '#8465CB',
          red: '#D1757E'
        }
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 1px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5rem' // 8px
      },
      aspectRatio: {
        'card': '2 / 3'
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' }
        },
        'fade-out': {
          to: { opacity: '0' }
        },
        'slide-from-right': {
          from: { transform: 'translate(30px)' }
        },
        'slide-from-left': {
          from: { transform: 'translate(-30px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;

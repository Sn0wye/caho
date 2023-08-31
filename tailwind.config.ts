import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        geist: {
          yellow: '#FFFD6D',
          pink: '#FFA0F0',
          green: '#B4FF91',
          orange: '#ED974F', 
          blue: '#A0E9FF',
          purple: '#D0A0FF',
          'dark-purple': '#8465CB',
          red: '#E77975',
          gray: '#EAEAEA'
        },
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

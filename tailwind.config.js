import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

// Colors are CSS variables (see src/index.css) so light/dark swap in one place.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('border'),
        fg: token('fg'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-solid': token('accent-solid'),
        ok: token('ok'),
        warn: token('warn'),
        danger: token('danger'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Space Grotesk Variable"', '"Inter Variable"', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.35)' },
        },
        flow: {
          to: { strokeDashoffset: '-40' },
        },
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 90s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        flow: 'flow 3s linear infinite',
      },
    },
  },
  plugins: [typography],
}

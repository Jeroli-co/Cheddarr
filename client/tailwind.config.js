/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      'black-alpha-1': 'var(--black-a1)',
      'black-alpha-2': 'var(--black-a2)',
      'black-alpha-3': 'var(--black-a3)',
      'black-alpha-4': 'var(--black-a4)',
      'black-alpha-5': 'var(--black-a5)',
      'black-alpha-6': 'var(--black-a6)',
      'black-alpha-7': 'var(--black-a7)',
      'black-alpha-8': 'var(--black-a8)',
      'black-alpha-9': 'var(--black-a9)',
      'black-alpha-10': 'var(--black-a10)',
      'black-alpha-11': 'var(--black-a11)',
      'black-alpha-12': 'var(--black-a12)',

      black: 'var(--black)',
      grey: 'var(--grey)',
      white: 'var(--white)',

      'primary-lighter': 'var(--primary-lighter)',
      'primary-light': 'var(--primary-light)',
      primary: 'var(--primary)',
      'primary-dark': 'var(--primary-dark)',
      'primary-darker': 'var(--primary-darker)',

      'secondary-lighter': 'var(--secondary)',
      'secondary-light': 'var(--secondary)',
      secondary: 'var(--secondary)',
      'secondary-dark': 'var(--secondary-dark)',
      'secondary-darker': 'var(--secondary-darker)',

      tertiary: 'var(--tertiary)',

      success: 'var(--success)',

      danger: 'var(--danger)',
      'danger-light': 'var(--danger-light)',

      warning: 'var(--warning)',
      'warning-light': 'var(--warning-light)',

      movie: 'var(--movie)',
      series: 'var(--series)',
      season: 'var(--season)',
      episode: 'var(--episode)',

      plex: 'var(--plex)',
    },
    zIndex: {
      nav: 100,
      modal: 200,
    },
    extend: {
      fontFamily: {
        body: ['AtkinsonHyperlegible'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'fade-in-scale': {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        'slide-b-t': { from: { marginTop: '100%' }, to: { marginTop: '0%' } },
      },
      animation: {
        'fade-in': 'fade-in 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-scale': 'fade-in-scale 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-b-t': 'slide-b-t 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary green scale (extended from Tailwind green)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#059669', // Main brand
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Custom brand colors
        forest: '#1B3A2F',
        coffee: '#5D3A1A',
        earth: '#FAFAF8',
        accent: '#C19A2E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      aspectRatio: {
        'golden': '1.618 / 1',
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
};

export default config;


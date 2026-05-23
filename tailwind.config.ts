import type { Config } from 'tailwindcss';
 
const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: {
          0: '#0d0f14',
          1: '#13161d',
          2: '#1a1e28',
          3: '#222736',
          4: '#2a2f3f',
        },
        accent: {
          DEFAULT: '#6c63ff',
          2: '#a78bfa',
          3: '#38bdf8',
        },
        brand: {
          green: '#22d3a4',
          amber: '#f59e0b',
          red: '#f87171',
          pink: '#f472b6',
        },
        text: {
          1: '#f1f0ff',
          2: '#a8a4c0',
          3: '#6b6880',
        },
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.08)',
        DEFAULT: 'rgba(255,255,255,0.13)',
        strong: 'rgba(255,255,255,0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease',
        'slide-up': 'slideUp 0.25s ease',
        'bounce-dot': 'bounceDot 0.9s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%,60%,100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
 
export default config;
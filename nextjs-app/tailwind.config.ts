import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          red: '#e0231f',
          'red-bright': '#ff3b30',
          'red-deep': '#9c0f0d',
          black: '#0a0a0c',
          'black-2': '#0f0f12',
          panel: '#141418',
          'panel-2': '#1a1a20',
          line: '#26262e',
          'line-soft': '#1e1e24',
          white: '#f4f4f6',
          grey: '#9a9aa6',
          'grey-dim': '#62626c',
          blue: '#00A3FF',
          purple: '#7B2FBE',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config

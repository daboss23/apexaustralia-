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
          // Accent — Performance Red (premium accent only)
          red: '#D61F26',
          'red-bright': '#ff3b30',
          'red-deep': '#9c0f0d',
          // Neutrals — engineering / premium product surfaces
          black: '#050505',        // Matte Black (primary bg)
          'black-2': '#0A0D10',
          surface: '#0D1117',      // Secondary surface
          carbon: '#131820',       // Carbon surface
          panel: '#131820',        // Dark Graphite / carbon
          'panel-2': '#1a1f26',
          gunmetal: '#2A3038',
          line: '#2A3038',
          'line-soft': '#1e232a',
          white: '#F5F7FA',
          titanium: '#E4E8ED',
          graphite: '#6E7783',
          grey: '#b0b6c1',
          'grey-dim': '#757b85',
          // Accent — Electric Blue = technology signal
          blue: '#00AEEF',
        },
      },
      fontFamily: {
        luxia: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
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

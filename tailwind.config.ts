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
          // Accent — Red = force/resistance/power
          red: '#E10600',
          'red-bright': '#ff3b30',
          'red-deep': '#9c0f0d',
          // Neutrals — engineering / premium product surfaces
          black: '#050505',        // Matte Black
          'black-2': '#0A0D10',    // Carbon Black
          panel: '#14181D',        // Dark Graphite
          'panel-2': '#1a1f26',
          gunmetal: '#2A3038',     // Gunmetal
          line: '#2A3038',
          'line-soft': '#1e232a',
          white: '#F5F7FA',
          grey: '#9aa0ab',
          'grey-dim': '#62686f',
          // Accent — Blue = intelligence/telemetry/data
          blue: '#00AEEF',
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

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        carbon: "#08090b",
        charcoal: "#121317",
        graphite: "#1c1f25",
        steel: "#2a2e35",
        // Performance Red — primary brand
        red: {
          DEFAULT: "#e22020",
          bright: "#ff2d2d",
          deep: "#a50f0c",
        },
        // Telemetry blue — used sparingly for data only
        telemetry: "#3b82f6",
        white: "#f5f7fa",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 36px -6px rgba(226,32,32,0.55)",
        electric: "0 0 50px -10px rgba(226,32,32,0.65)",
      },
      keyframes: {
        scanline: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        sweep: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(120%)" } },
        stride: { "0%,100%": { transform: "translateX(0)" }, "50%": { transform: "translateX(8px)" } },
      },
      animation: {
        scanline: "scanline 4s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        sweep: "sweep 3.5s cubic-bezier(.7,0,.3,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        carbon: "#0a0c10",
        graphite: "#13171d",
        steel: "#1c2128",
        electric: "#0a84ff",
        cyan: "#22d3ee",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34,211,238,0.5)",
        electric: "0 0 50px -10px rgba(10,132,255,0.6)",
      },
      keyframes: {
        scanline: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        scanline: "scanline 4s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

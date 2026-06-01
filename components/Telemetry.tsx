"use client";

import { motion } from "framer-motion";

function Curve({ d, color, delay = 0 }: { d: string; color: string; delay?: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 1.8, delay, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
}

const READOUTS = [
  { k: "ACCEL CURVE", v: "0 → 11.2 m/s", s: "1.84 s to peak" },
  { k: "RESISTANCE ZONE", v: "32 kgf", s: "adaptive load" },
  { k: "STRIDE TRACKING", v: "4.31 m", s: "contact 0.09 s" },
];

export default function Telemetry() {
  return (
    <section id="technology" className="relative overflow-hidden py-28 sm:py-36">
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan/80">Live Telemetry</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Performance, rendered in real time.
          </h2>
          <p className="mt-4 text-white/55">
            Every stride generates data. Acceleration curves, resistance zones and athlete tracking animate the moment
            movement happens — the way an F1 pit wall reads a car.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Graph panel */}
          <div className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scanline bg-gradient-to-r from-transparent via-cyan to-transparent" />
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/50">SPRINT ACCELERATION · SESSION 04</span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-cyan">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" /> LIVE
              </span>
            </div>
            <svg viewBox="0 0 600 280" className="h-auto w-full">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="0" y1={56 * i + 8} x2="600" y2={56 * i + 8} stroke="rgba(255,255,255,0.06)" />
              ))}
              {/* acceleration curve (rises and plateaus) */}
              <Curve d="M0,260 C120,250 180,120 280,70 C360,32 480,30 600,26" color="#22d3ee" />
              {/* power curve */}
              <Curve d="M0,270 C140,230 220,180 320,150 C420,120 520,135 600,110" color="#0a84ff" delay={0.3} />
              {/* resistance zone */}
              <Curve d="M0,200 C120,200 160,160 280,160 C420,160 480,190 600,150" color="#e0231f" delay={0.6} />
            </svg>
            <div className="mt-4 flex flex-wrap gap-5 font-mono text-[11px] text-white/60">
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-cyan" />Speed</span>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-electric" />Power</span>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#e0231f]" />Resistance</span>
            </div>
          </div>

          {/* Readouts */}
          <div className="grid gap-6">
            {READOUTS.map((r, i) => (
              <motion.div
                key={r.k}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="glass flex flex-col justify-center rounded-2xl p-6"
              >
                <p className="font-mono text-[11px] tracking-[0.22em] text-cyan/80">{r.k}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{r.v}</p>
                <p className="mt-1 text-sm text-white/45">{r.s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

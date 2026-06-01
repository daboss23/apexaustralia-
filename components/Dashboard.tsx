"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DASH_METRICS } from "@/lib/site";

/* Animated velocity curve that "lives" by redrawing a sampled path. */
function VelocityCurve() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let raf: number;
    const loop = () => {
      setPhase((p) => p + 0.02);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 600;
    const base = 120 - 90 * (1 - Math.exp(-i / 9)); // accel-style rise
    const y = base + Math.sin(i * 0.5 + phase) * 5;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 600 140" className="h-auto w-full">
      <defs>
        <linearGradient id="vfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(226,32,32,0.32)" />
          <stop offset="100%" stopColor="rgba(226,32,32,0)" />
        </linearGradient>
      </defs>
      <polyline points={`0,140 ${pts} 600,140`} fill="url(#vfill)" stroke="none" />
      <polyline points={pts} fill="none" stroke="#ff2d2d" strokeWidth={2} style={{ filter: "drop-shadow(0 0 6px #ff2d2d)" }} />
    </svg>
  );
}

function LiveValue({ base, decimals = 0 }: { base: number; decimals?: number }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV(base + (Math.random() - 0.5) * (base * 0.01)), 1400);
    return () => clearInterval(id);
  }, [base]);
  return <>{v.toFixed(decimals)}</>;
}

export default function Dashboard() {
  const ref = useRef(null);
  return (
    <section id="dashboard" ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-carbon to-black" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red/80">Performance Dashboard</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">The pit wall for human performance.</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-strong relative mt-12 overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scanline bg-gradient-to-r from-transparent via-red to-transparent" />

          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/50">ATHLETE · A. NOVAK · SESSION 04</span>
            <span className="flex items-center gap-2 font-mono text-[11px] text-red">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red" /> RECORDING
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {DASH_METRICS.map((m) => (
              <div key={m.k} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/45">{m.k.toUpperCase()}</p>
                <p className="mt-2 font-display text-3xl font-semibold">
                  <LiveValue base={parseFloat(m.v)} decimals={(m.v.split(".")[1] || "").length} />
                  <span className="ml-1 text-sm font-normal text-white/40">{m.u}</span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-red">▲ {m.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-white/50">
                <span>VELOCITY CURVE</span><span className="text-red">m/s</span>
              </div>
              <VelocityCurve />
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <p className="mb-4 font-mono text-[11px] text-white/50">SYMMETRY · L / R</p>
              {[
                { side: "LEFT", pct: 49 },
                { side: "RIGHT", pct: 51 },
              ].map((s) => (
                <div key={s.side} className="mb-4">
                  <div className="flex justify-between font-mono text-[11px] text-white/60">
                    <span>{s.side}</span><span>{s.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-deep to-red-bright"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              <p className="mt-2 font-mono text-[11px] text-red">SESSION REPORT · READY</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPORTS } from "@/lib/site";

export default function SportSelector() {
  const [active, setActive] = useState(0);
  const sport = SPORTS[active];

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(226,32,32,0.10),transparent_55%),#08090b]" />
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red/80">One System · Every Code</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Purpose-built for your sport.
          </h2>
          <p className="mt-4 text-white/55">Select a sport — the metrics, force profiles and KPIs reconfigure to its demands.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Selector */}
          <div className="flex flex-col gap-2">
            {SPORTS.map((s, i) => (
              <button
                key={s.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative flex items-center justify-between overflow-hidden rounded-xl border px-5 py-4 text-left transition-all ${
                  i === active ? "border-red/60 bg-red/[0.06]" : "border-white/5 hover:border-white/20"
                }`}
              >
                {i === active && (
                  <motion.span layoutId="sportbar" className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-bright to-red-deep" />
                )}
                <span className={`font-display text-2xl font-semibold transition-colors ${i === active ? "text-white" : "text-white/55 group-hover:text-white"}`}>
                  {s.name}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>

          {/* Live readout panel that reconfigures per sport */}
          <div className="glass-strong relative overflow-hidden rounded-3xl p-7 sm:p-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scanline bg-gradient-to-r from-transparent via-red to-transparent" />
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/50">SPORT PROFILE</span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-red">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red" /> CONFIGURED
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display text-3xl font-bold">
                  {sport.name}
                  {/*
                    ASSET SLOT — per-sport athlete image. Drop /public/images/sport-{sport.id}.jpg
                    and render it here for the imagery swap called out in the brief.
                  */}
                </h3>
                <p className="mt-2 max-w-md text-white/55">{sport.line}</p>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  {sport.kpis.map((kpi, k) => (
                    <motion.div
                      key={kpi.k}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * k }}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{kpi.k}</p>
                      <p className="mt-2 font-display text-2xl font-semibold text-white">
                        {kpi.v}
                        <span className="ml-1 text-xs font-normal text-red">{kpi.u}</span>
                      </p>
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-red-deep to-red-bright"
                          initial={{ width: 0 }}
                          animate={{ width: `${55 + k * 15}%` }}
                          transition={{ duration: 0.9, delay: 0.1 + k * 0.08, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

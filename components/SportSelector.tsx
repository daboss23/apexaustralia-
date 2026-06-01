"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPORTS } from "@/lib/site";

export default function SportSelector() {
  const [active, setActive] = useState(0);
  const sport = SPORTS[active];

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Scene that recolours per sport */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sport.id}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${sport.tint}22, transparent 60%), #000`,
          }}
        />
      </AnimatePresence>
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-[0.1]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan/80">One System · Every Sport</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Tuned to the demands of the game.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Selector */}
          <div className="flex flex-col gap-2">
            {SPORTS.map((s, i) => (
              <button
                key={s.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-all ${
                  i === active ? "border-cyan/50 bg-white/[0.04]" : "border-white/5 hover:border-white/15"
                }`}
              >
                <span className="font-display text-2xl font-semibold transition-colors" style={{ color: i === active ? s.tint : undefined }}>
                  {s.name}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full transition-all"
                  style={{ background: s.tint, boxShadow: i === active ? `0 0 14px 3px ${s.tint}` : "none", opacity: i === active ? 1 : 0.3 }}
                />
              </button>
            ))}
          </div>

          {/* Scene readout */}
          <div className="relative grid place-items-center overflow-hidden rounded-3xl border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center p-10 text-center"
                style={{ background: `linear-gradient(160deg, ${sport.tint}18, transparent)` }}
              >
                {/*
                  ASSET SLOT — per-sport cinematic loop. Drop /public/video/sport-{id}.webm
                  and render a <video> here keyed on sport.id for the full scene swap.
                */}
                <div
                  className="mb-6 grid h-24 w-24 place-items-center rounded-2xl font-display text-4xl font-bold"
                  style={{ border: `1px solid ${sport.tint}`, color: sport.tint, boxShadow: `0 0 40px -8px ${sport.tint}` }}
                >
                  {sport.name.charAt(0)}
                </div>
                <h3 className="font-display text-3xl font-bold">{sport.name}</h3>
                <p className="mt-3 max-w-sm text-white/55">{sport.line}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

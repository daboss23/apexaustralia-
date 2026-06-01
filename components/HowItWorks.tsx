"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WORK_STEPS } from "@/lib/site";

function Step({ step, index, total }: { step: (typeof WORK_STEPS)[number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "start 0.35"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, x, scale }} className="relative grid grid-cols-[auto_1fr] gap-6 py-10">
      <div className="flex flex-col items-center">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-cyan/40 bg-black font-display font-bold text-cyan shadow-glow">
          {step.no}
        </div>
        {index < total - 1 && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-cyan/50 to-transparent" />}
      </div>
      <div className="pb-4">
        <h3 className="font-display text-2xl font-semibold sm:text-3xl">{step.title}</h3>
        <p className="mt-3 max-w-md text-white/55">{step.body}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-carbon to-black" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-10 lg:grid-cols-[1fr_1fr]">
        {/* Sticky cinematic panel */}
        <div className="lg:sticky lg:top-24 lg:h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl p-8"
          >
            <div className="grid-floor pointer-events-none absolute inset-0 opacity-20" />
            {/*
              ASSET SLOT — process loop video. Drop /public/video/how-it-works.webm
              and replace the abstract pulse block below with a <video> element.
            */}
            <div className="relative">
              <p className="font-mono text-xs tracking-[0.3em] text-cyan/80">SYSTEM SEQUENCE</p>
              <h3 className="mt-3 font-display text-3xl font-bold leading-tight">From connection to calibrated performance.</h3>
            </div>
            <div className="relative mx-auto my-8 grid place-items-center">
              <div className="absolute h-40 w-40 animate-ping rounded-full border border-cyan/20" />
              <div className="absolute h-28 w-28 rounded-full border border-cyan/30" />
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-electric to-cyan shadow-glow" />
            </div>
            <p className="relative font-mono text-[11px] tracking-[0.2em] text-white/50">
              AI CALIBRATION · TELEMETRY · ADAPTIVE LOAD
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan/80">How T-APEX Works</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Five steps. One intelligent loop.
          </h2>
          <div className="mt-6">
            {WORK_STEPS.map((s, i) => (
              <Step key={s.no} step={s} index={i} total={WORK_STEPS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

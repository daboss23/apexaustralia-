"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HERO_METRICS } from "@/lib/site";

const ParticleField = dynamic(() => import("./three/ParticleField"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* WebGL particle/light-trail field */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/*
        ASSET SLOT — cinematic athlete loop. Drop a muted, looping mp4/webm at
        /public/video/hero-athlete.webm and uncomment to layer behind the particles.
        <video className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-screen"
               autoPlay muted loop playsInline src="/video/hero-athlete.webm" />
      */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_30%,#000_82%)]" />
      <div className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-25 [mask-image:linear-gradient(to_top,#000,transparent)]" />

      {/* Floating holographic metrics */}
      {HERO_METRICS.map((m, i) => (
        <motion.div
          key={m.label}
          className="glass holo absolute z-20 rounded-xl px-4 py-3"
          style={m.pos as React.CSSProperties}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.1 + i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] tracking-[0.24em] text-cyan/80">{m.label}</p>
          <p className="font-display text-xl font-semibold text-white">
            {m.value}
            <span className="ml-1 text-xs font-normal text-white/50">{m.unit}</span>
          </p>
        </motion.div>
      ))}

      {/* Headline */}
      <motion.div style={{ y, opacity: fade }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-5 font-mono text-xs uppercase tracking-[0.4em] text-cyan/80"
        >
          Intelligent Resistance Training
        </motion.p>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          {["Train Beyond", "Human Limits"].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={i === 1 ? "block electric-grad text-glow" : "block"}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-6 max-w-xl text-balance text-base text-white/60 sm:text-lg"
        >
          Real-time telemetry. AI-calibrated resistance. The performance system built for elite Australian sport.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#contact" className="rounded-full bg-gradient-to-r from-electric to-cyan px-7 py-3.5 text-sm font-semibold text-black shadow-electric transition-transform hover:scale-105">
            Book Demo
          </a>
          <a href="#technology" className="glass rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-cyan/40">
            Explore Technology
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-white/40"
      >
        SCROLL TO ENGAGE
      </motion.div>
    </section>
  );
}

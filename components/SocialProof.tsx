"use client";

import { motion } from "framer-motion";
import { PROOF } from "@/lib/site";

export default function SocialProof() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red/80">Trusted At The Top</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Where elite programs measure progress.
          </h2>
        </motion.div>

        {/* Video wall — clips + quotes */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PROOF.map((p, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5"
            >
              {/*
                ASSET SLOT — athlete clip. Drop /public/video/proof-{i}.webm and replace
                the animated placeholder below with a muted autoplay loop <video>.
              */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-steel to-black">
                <div className="grid-floor absolute inset-0 opacity-20" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-red/40 text-red transition-transform group-hover:scale-110">
                    ▶
                  </span>
                </div>
                <div className="absolute inset-x-0 top-0 h-px animate-scanline bg-gradient-to-r from-transparent via-red/60 to-transparent" />
                <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-white/50">CLIP · {p.tag}</span>
              </div>
              <figcaption className="glass flex flex-1 flex-col justify-between p-6">
                <blockquote className="font-display text-lg leading-snug">“{p.quote}”</blockquote>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-red/80">
                  {p.who} · <span className="text-white/40">{p.tag}</span>
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* metric strip */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-4">
          {[
            { v: "1000 Hz", k: "Data resolution" },
            { v: "14 m/s", k: "Assisted overspeed" },
            { v: "0.1 kgf", k: "Load precision" },
            { v: "98.2%", k: "Symmetry tracked" },
          ].map((m) => (
            <div key={m.k} className="bg-black p-6 text-center">
              <p className="font-display text-2xl font-semibold text-red sm:text-3xl">{m.v}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">{m.k}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

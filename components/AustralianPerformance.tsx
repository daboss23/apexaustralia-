"use client";

import { motion } from "framer-motion";
import { AU_SPORTS } from "@/lib/site";

export default function AustralianPerformance() {
  return (
    <section id="australia" className="relative overflow-hidden py-28 sm:py-36">
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-[0.12]" />
      {/* Southern-cross style accent field */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(10,132,255,0.12),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red/80">
            <span className="inline-block h-3 w-3 rotate-45 bg-red" /> Made for here
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Built For Elite <span className="electric-grad">Australian</span> Performance
          </h2>
          <p className="mt-4 text-white/55">
            From the MCG to the pool deck — T-APEX is tuned to the codes that define Australian sport, with local
            support and data that transfers straight to the field.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AU_SPORTS.map((s, i) => (
            <motion.article
              key={s.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-graphite to-black p-7"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 font-display text-7xl font-bold text-white/[0.04] transition-colors group-hover:text-red/10">
                {s.code}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px w-0 bg-gradient-to-r from-red-deep to-red-bright transition-all duration-500 group-hover:w-full" />
              <h3 className="relative font-display text-2xl font-semibold">{s.name}</h3>
              <p className="relative mt-2 text-sm text-white/50">{s.line}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

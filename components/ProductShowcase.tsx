"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PRODUCT_HOTSPOTS } from "@/lib/site";
import ProductExploded from "./three/ProductExploded";

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // 0 assembled → 1 fully exploded across the middle of the section
  const progress = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  return (
    <section id="product" ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,#121317,#08090b_70%,#000)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red/80">The Machine</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Engineered to its core.</h2>
          <p className="mt-4 text-white/55">
            Scroll to disassemble the system. Every component is built for portable, repeatable, measurable power.
          </p>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative h-[480px] overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_50%_40%,#15171c,#000)] sm:h-[600px]">
            <div className="lab-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scanline bg-gradient-to-r from-transparent via-red/60 to-transparent" />
            <ProductExploded progress={progress} />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/40">
              SCROLL TO DISASSEMBLE
            </span>
          </div>

          <ul className="grid gap-3">
            {PRODUCT_HOTSPOTS.map((h, i) => (
              <motion.li
                key={h.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass group rounded-xl p-4 transition-colors hover:border-red/40"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-md border border-red/40 font-mono text-xs text-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold">{h.title}</h3>
                </div>
                <p className="mt-1 pl-10 text-sm text-white/50">{h.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { PRODUCT_HOTSPOTS } from "@/lib/site";

const DeviceModel = dynamic(() => import("./three/DeviceModel"), { ssr: false });

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // exploded grows then settles as the section passes through
  const exploded = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0.55]);
  const [val, setVal] = useState(0);
  useMotionValueEvent(exploded, "change", (v) => setVal(v));

  return (
    <section id="product" ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan/80">The Machine</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Engineered to its core.</h2>
          <p className="mt-4 text-white/55">
            Rotate it. Scroll to separate the system. Hover the markers to reveal what drives the performance.
          </p>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative h-[460px] rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_50%_40%,#0c1420,#000)] sm:h-[560px]">
            <div className="grid-floor pointer-events-none absolute inset-0 opacity-15" />
            <DeviceModel exploded={val} />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/40">
              DRAG TO ROTATE · SCROLL TO DISASSEMBLE
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
                className="glass group rounded-xl p-4 transition-colors hover:border-cyan/40"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-lg font-semibold">{h.title}</h3>
                </div>
                <p className="mt-1 pl-7 text-sm text-white/50">{h.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

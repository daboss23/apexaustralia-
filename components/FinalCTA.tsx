"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 sm:py-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(34,211,238,0.14),transparent_60%)]" />
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan/80">T-APEX Australia</p>
        <h2 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl">
          Bring the future into <span className="electric-grad text-glow">your environment.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-white/55">
          Book a demo with the Australian team and see real-time, AI-calibrated resistance training with your athletes.
        </p>

        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const btn = e.currentTarget.querySelector("button");
            if (btn) {
              btn.textContent = "Request received ✓";
              btn.setAttribute("disabled", "true");
            }
          }}
        >
          <input
            type="email"
            required
            placeholder="Your email"
            className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-cyan/50"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-electric to-cyan px-7 py-3.5 text-sm font-semibold text-black shadow-electric transition-transform hover:scale-105"
          >
            Book Demo
          </button>
        </form>
        <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-white/35">
          OR EMAIL · customerservice@myt-apex.com
        </p>
      </motion.div>
    </section>
  );
}

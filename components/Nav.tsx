"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { NAV_LINKS } from "@/lib/site";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.span
        className="fixed left-0 top-0 z-[120] h-0.5 w-full origin-left bg-gradient-to-r from-red-deep via-red to-red-bright"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[110] flex items-center justify-between px-5 transition-all duration-500 sm:px-10 ${
          stuck ? "border-b border-white/5 bg-black/70 py-3 backdrop-blur-xl" : "py-5"
        }`}
      >
        <a href="#top" className="font-display text-lg font-bold tracking-[0.18em]">
          T<span className="text-red">·</span>APEX<span className="ml-2 text-[10px] font-medium tracking-[0.34em] text-red/70">AUSTRALIA</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="group relative font-mono text-xs uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-red-deep to-red-bright px-5 py-2 text-xs font-semibold text-black shadow-electric transition-transform hover:scale-105"
          >
            Book Demo
          </a>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong fixed inset-x-4 top-16 z-[105] flex flex-col gap-1 rounded-2xl p-4 md:hidden"
        >
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-[0.16em] text-white/80 hover:bg-white/5">
              {l.label}
            </a>
          ))}
        </motion.nav>
      )}
    </>
  );
}

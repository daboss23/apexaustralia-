"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 14 + 6;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 450);
      }
      setPct(Math.floor(v));
    }, 130);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid-floor pointer-events-none absolute inset-0 opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-bold tracking-[0.3em] text-white"
          >
            T<span className="text-cyan">·</span>APEX
          </motion.div>
          <div className="mt-6 h-px w-56 overflow-hidden bg-white/10">
            <motion.div className="h-full bg-gradient-to-r from-electric to-cyan" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 font-mono text-[11px] tracking-[0.3em] text-cyan/80">
            INITIALISING SYSTEMS · {pct}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

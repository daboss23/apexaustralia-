'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedBlueprint from './AnimatedBlueprint'

export default function DeviceStructureSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="device" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
      />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,174,239,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,174,239,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(0,174,239,0.06), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            Device Structure
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="h-luxia t-silver leading-[0.9] mb-6 max-w-4xl"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          ENGINEERED<br /><span className="t-blue">DOWN TO THE PART.</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body leading-relaxed max-w-2xl mb-10 md:mb-16"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          A portable motorised unit built for hard use on demanding training floors —
          a retractable pull rod, on-board control panel, swappable battery module, and a
          rugged, airline-approved chassis that sets up in minutes.
        </motion.p>

        {/* Animated engineering blueprint — locked static image with cinematic
            cyan/red overlay effects (see AnimatedBlueprint). */}
        <motion.div
          className="relative border border-apex-line/60 bg-apex-panel/30 p-3 md:p-5 overflow-hidden"
          style={{ borderTop: '2px solid rgba(0,174,239,0.55)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatedBlueprint />
          <div className="mt-4 pt-3 border-t border-apex-line/40 flex items-center justify-between px-1">
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-apex-grey-dim">
              T-APEX // Engineering Blueprint
            </span>
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-apex-blue">
              13 Components
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

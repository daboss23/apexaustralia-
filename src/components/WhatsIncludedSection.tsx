'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function WhatsIncludedSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="whats-included" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.25) 30%, rgba(214,31,38,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Everything-in-the-box graphic — headline, subtitle and the full core
            kit are baked into the image; edges feathered into the section bg */}
        <motion.div
          ref={titleRef}
          className="relative mb-20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/T-apex box.png"
            alt="Everything in the box — T-APEX unit, Pull Rod, Belt, Tablet, User Guide, Power Cord, Type-C Charger and Allen Wrench"
            className="w-full h-auto block select-none"
          />
          {/* Feather left/right edges into the #0A0D10 surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(90deg, #0A0D10 0%, rgba(10,13,16,0) 14%, rgba(10,13,16,0) 86%, #0A0D10 100%)' }}
          />
          {/* Feather top/bottom edges into the #0A0D10 surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(180deg, #0A0D10 0%, rgba(10,13,16,0) 16%, rgba(10,13,16,0) 82%, #0A0D10 100%)' }}
          />
        </motion.div>

        {/* ── Overspeed module ────────────────────────────────────────── */}
        <motion.div
          className="mb-6 flex items-baseline gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.25 }}
        >
          <h3 className="font-display font-black t-feature leading-tight" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)' }}>
            Overspeed Module
          </h3>
        </motion.div>

        {/* Overspeed kit hero — edges feathered into the section bg so it reads as part of the page */}
        <motion.div
          className="relative mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Overspeed trainng kit.jpg"
            alt="Overspeed Training Kit — OS Tether Reel, OS Pulley, OS Weight Anchor and Fast-Release Strap"
            className="w-full h-auto block select-none"
          />
          {/* Feather left/right edges into the #0A0D10 surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(90deg, #0A0D10 0%, rgba(10,13,16,0) 14%, rgba(10,13,16,0) 86%, #0A0D10 100%)' }}
          />
          {/* Feather top/bottom edges into the #0A0D10 surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(180deg, #0A0D10 0%, rgba(10,13,16,0) 16%, rgba(10,13,16,0) 82%, #0A0D10 100%)' }}
          />
        </motion.div>

        {/* Overspeed gating note */}
        <motion.div
          className="relative p-7 md:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,24,1) 0%, rgba(10,13,16,1) 55%, rgba(214,31,38,0.08) 100%)',
            border: '1px solid rgba(214,31,38,0.3)',
            borderLeft: '4px solid #D61F26',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-3" style={{ color: 'rgba(214,31,38,0.9)' }}>
            Please Note
          </div>
          <p className="text-apex-grey font-body leading-relaxed" style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)' }}>
            Without the <span className="text-apex-white font-display font-bold">Overspeed Module</span>, you don&apos;t
            get the five overspeed accessories above — and you don&apos;t unlock the{' '}
            <span className="text-apex-white font-display font-bold">assisted overspeed training mode</span> and its
            related software features. Resisted sprinting, change-of-direction, isotonic and overload
            modes are all included with the core system.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

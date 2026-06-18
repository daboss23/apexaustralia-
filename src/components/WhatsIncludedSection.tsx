'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Base package — included with every T-APEX system (from the guide spec sheet).
const CORE_ELEMENTS = [
  { name: 'T-APEX Unit', sub: 'Portable motorised resistance device', img: '/accessories/tapex-elements.png' },
  { name: 'Tablet + T-APEX Software', sub: 'Android tablet preloaded and ready', img: '/accessories/tablet-software.png' },
]

const CORE_BOX = ['T-APEX Unit', 'Waist Belt', 'Tablet', 'Adaptor for T-APEX', 'Type-C Cable', 'User Manual']

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
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            What&apos;s Included
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
          EVERYTHING IN<br /><span className="t-red">THE BOX.</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body leading-relaxed max-w-2xl mb-16"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          Every T-APEX ships as a complete, ready-to-train system. Add the Overspeed Module to
          unlock assisted overspeed training and its dedicated accessories.
        </motion.p>

        {/* ── Core system ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-6 flex items-baseline justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <h3 className="font-display font-black t-feature leading-tight" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)' }}>
            Core T-APEX System
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-apex-grey-dim">From</span>
            <span className="font-luxia font-black t-silver" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)' }}>A$9,450</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-4 mb-20">
          {/* Hero elements */}
          <div className="grid grid-cols-2 gap-4">
            {CORE_ELEMENTS.map((item, i) => (
              <motion.div
                key={item.name}
                className="group relative bg-apex-panel border border-apex-line p-5 flex flex-col"
                style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
              >
                <div className="aspect-square flex items-center justify-center mb-4 bg-apex-black/40 border border-apex-line/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className="w-[80%] h-[80%] object-contain" />
                </div>
                <h4 className="font-display font-bold text-apex-white text-[14px] leading-tight mb-1">{item.name}</h4>
                <p className="text-apex-grey font-body text-[12px] leading-snug">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* In-the-box checklist */}
          <motion.div
            className="bg-apex-panel/50 border border-apex-line p-7 flex flex-col justify-center"
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="text-[9px] font-mono tracking-[0.26em] uppercase text-apex-grey-dim mb-5">
              In the Box
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
              {CORE_BOX.map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5 border-b border-apex-line/40">
                  <svg className="w-4 h-4 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-apex-grey font-body text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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

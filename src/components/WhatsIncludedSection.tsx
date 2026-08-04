'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function WhatsIncludedSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="whats-included" className="relative bg-apex-black-2 py-16 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.25) 30%, rgba(214,31,38,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[12px] tracking-[0.3em] uppercase font-medium">
            What&apos;s Included
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="h-luxia t-silver leading-[0.9] mb-6 max-w-4xl mx-auto text-center"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          HERE&apos;S WHAT<br /><span className="t-red">YOU&apos;LL RECEIVE.</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body leading-relaxed max-w-2xl mx-auto text-center mb-10 md:mb-16"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          Everything arrives calibrated to work as one system — ready to train on day one,
          with no extra purchases to get started.
        </motion.p>

        {/* Everything-in-the-box hero — full annotated kit, edges feathered into the section bg.
            Full-bleed to the screen edges on mobile so the kit reads large; contained on desktop. */}
        <motion.div
          className="relative mb-12 md:mb-20 overflow-hidden -mx-6 md:mx-0"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/T-apex box.webp"
            alt="Everything in the T-APEX box — T-APEX unit, pull rod, belt, tablet, user guide, power cord, Type-C charger and Allen wrench"
            className="w-full h-auto block select-none"
            loading="lazy"
            decoding="async"
          />
          {/* Feather left/right edges into the #0A0D10 surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(90deg, #0A0D10 0%, rgba(10,13,16,0) 11%, rgba(10,13,16,0) 89%, #0A0D10 100%)' }}
          />
          {/* Feather top/bottom edges into the #0A0D10 surface — smooth, edge-free blend */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'linear-gradient(180deg, #0A0D10 0%, rgba(10,13,16,0) 6%, rgba(10,13,16,0) 84%, #0A0D10 100%)' }}
          />
        </motion.div>

        {/* ── Overspeed module ────────────────────────────────────────── */}
        <motion.div
          className="mb-6 flex items-baseline justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.25 }}
        >
          <h3 className="font-display font-black t-feature leading-tight text-center" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)' }}>
            Overspeed Module
          </h3>
        </motion.div>

        {/* Animated down-cue directly under the Overspeed Module heading — a
            blue rail with a charge running down it and a bouncing chevron
            (see .down-cue* in globals.css). */}
        <div className="-mt-2 mb-8 flex justify-center" aria-hidden="true">
          <div className="down-cue flex flex-col items-center gap-1.5">
            <span className="down-cue-line" />
            <svg className="down-cue-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path
                d="M1 1L8 8L15 1"
                stroke="#00AEEF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,174,239,0.7))' }}
              />
            </svg>
          </div>
        </div>

        {/* Overspeed kit hero — edges feathered into the section bg so it reads as part of the page.
            Full-bleed on mobile to match the box hero. */}
        <motion.div
          className="relative mb-8 overflow-hidden -mx-6 md:mx-0"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Overspeed trainng kit.webp"
            alt="Overspeed Training Kit — OS Tether Reel, OS Pulley, OS Weight Anchor and Fast-Release Strap"
            className="w-full h-auto block select-none"
            loading="lazy"
            decoding="async"
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
          className="note-glow relative p-7 md:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,24,1) 0%, rgba(10,13,16,1) 55%, rgba(0,174,239,0.08) 100%)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {/* Electric trace + frequency particles (decoration only) */}
          <div className="absolute inset-0 overflow-visible pointer-events-none" aria-hidden="true">
            <span className="note-trace" />
            <span className="note-particle" style={{ left: '-2px', '--p-dur': '4.4s', '--p-delay': '0s', '--p-x': '7px', '--p-peak': 0.85 } as React.CSSProperties} />
            <span className="note-particle" style={{ left: '0px', '--p-dur': '5.3s', '--p-delay': '1.4s', '--p-x': '-5px', '--p-peak': 0.7 } as React.CSSProperties} />
            <span className="note-particle" style={{ left: '-3px', '--p-dur': '6.0s', '--p-delay': '2.6s', '--p-x': '10px', '--p-peak': 0.6 } as React.CSSProperties} />
            <span className="note-particle" style={{ left: '1px', '--p-dur': '5.7s', '--p-delay': '3.9s', '--p-x': '-8px', '--p-peak': 0.65 } as React.CSSProperties} />
          </div>
          <div className="text-[13px] font-mono font-bold tracking-[0.3em] uppercase mb-3 text-center" style={{ color: 'rgba(0,174,239,1)' }}>
            Please Note
          </div>
          <p className="text-apex-grey font-body leading-relaxed text-center" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)' }}>
            Without the <span className="text-apex-white font-display font-bold">Overspeed Module</span>, you
            won&apos;t receive the five overspeed accessories above — and won&apos;t unlock the{' '}
            <span className="text-apex-white font-display font-bold">assisted overspeed training mode</span> and its
            related software features.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

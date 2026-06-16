'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Part list lifted directly from the T-APEX device guide.
const PARTS = [
  'Pull Rod',
  'Counterweight Holder',
  'Handle',
  'Control Panel',
  'Emergency Button',
  'Repair Window',
  'Handle',
  'Pull Rod Length Changer',
  'Pull Rod Detacher',
  'Battery Compartment',
  'Accessory Assembly',
  'Dust Container',
  'Charge Port',
]

export default function DeviceStructureSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="device" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
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
          className="text-apex-grey font-body leading-relaxed max-w-2xl mb-16"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          A portable motorised unit built for hard use on demanding training floors —
          a retractable pull rod, on-board control panel, swappable battery module, and a
          rugged, airline-approved chassis that sets up in minutes.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-10 lg:gap-16 items-center">
          {/* Blueprint diagram */}
          <motion.div
            className="relative border border-apex-line/60 bg-apex-panel/30 p-6 md:p-10"
            style={{ borderTop: '2px solid rgba(0,174,239,0.55)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Corner reticles */}
            <div className="absolute top-3 left-3 pointer-events-none" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M0 12V0h12" fill="none" stroke="rgba(0,174,239,0.6)" strokeWidth="1.2" /></svg>
            </div>
            <div className="absolute bottom-3 right-3 pointer-events-none" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M12 0v12H0" fill="none" stroke="rgba(0,174,239,0.6)" strokeWidth="1.2" /></svg>
            </div>

            <div className="flex items-end justify-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/accessories/device-structure-top.png"
                alt="T-APEX device structure — front and rear views with numbered components"
                className="w-full max-w-[460px] object-contain"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/accessories/device-structure-bottom.png"
                alt="T-APEX device structure — base view showing the charge port"
                className="hidden sm:block w-[26%] object-contain pb-2"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-apex-line/40 flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-apex-grey-dim">
                T-APEX // Technical Drawing
              </span>
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-apex-blue">
                13 Components
              </span>
            </div>
          </motion.div>

          {/* Numbered legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-0">
              {PARTS.map((part, i) => (
                <div
                  key={`${part}-${i}`}
                  className="flex items-center gap-4 py-2.5 border-b border-apex-line/40"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-apex-blue/40 bg-apex-blue/5 font-mono text-[10px] font-bold text-apex-blue">
                    {i + 1}
                  </span>
                  <span className="text-apex-grey font-body text-[13px] leading-snug">{part}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

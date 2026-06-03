'use client'

import { useRef, Fragment } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Lead with what everyone does, then the things only T-Apex does — the
// contrast (✓✓ → ✓✗) is what makes the table persuasive.
const ADVANTAGES: { label: string; others: boolean }[] = [
  { label: 'Applies resistance & assistance', others: true },
  { label: 'Portable, gym-floor ready', others: true },
  { label: 'Supports speed & strength work', others: true },
  { label: 'Adapts load in real time, mid-rep', others: false },
  { label: '200Hz force & velocity telemetry', others: false },
  { label: 'Load verified to the Newton', others: false },
  { label: 'Live, in-session feedback', others: false },
  { label: 'Objective, data-driven programming', others: false },
  { label: 'One system across every code', others: false },
]

const Check = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)
const Cross = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function ComparisonSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const tableInView = useInView(tableRef, { once: true, margin: '-5% 0px' })

  const last = ADVANTAGES.length - 1
  const red = 'linear-gradient(180deg, #ff4b46 0%, #E10600 55%, #c41410 100%)'

  return (
    <section id="comparison" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(225,6,0,0.25) 30%, rgba(225,6,0,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            The Difference
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="h-luxia text-apex-white leading-[0.9] mb-4"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          EVERYTHING THEY DO.<br />
          <span className="text-apex-red">PLUS EVERYTHING THEY CAN&apos;T.</span>
        </motion.h2>
        <motion.p
          className="text-apex-grey font-body leading-relaxed max-w-2xl mb-12"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Conventional resistance tools were built before real-time data was possible.
          Here&apos;s how T-Apex compares to the gear most facilities still rely on today.
        </motion.p>

        {/* ── Comparison table ─────────────────────────────────────────────── */}
        <motion.div
          ref={tableRef}
          className="grid grid-cols-[minmax(0,1.6fr)_1fr_1fr] sm:grid-cols-[minmax(0,1.9fr)_1fr_1fr]"
          initial={{ opacity: 0, y: 22 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header: empty | T-Apex (logo) | Conventional */}
          <div aria-hidden="true" />
          <motion.div
            className="flex items-center justify-center px-3 pt-7 pb-5 rounded-t-2xl"
            style={{ background: red, boxShadow: '0 -10px 40px -12px rgba(225,6,0,0.6)' }}
            initial={{ opacity: 0, y: 14 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="rounded-md px-3 py-2" style={{ background: 'rgba(8,6,7,0.55)' }}>
              <Image src="/apexaustralialogo.png" alt="T-APEX" width={200} height={64} className="h-7 sm:h-8 w-auto object-contain" />
            </span>
          </motion.div>
          <div className="flex items-end justify-center px-3 pb-5 text-center">
            <span className="font-display font-bold text-apex-grey leading-tight" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}>
              Conventional<br />Tools
            </span>
          </div>

          {/* Rows */}
          {ADVANTAGES.map((a, i) => {
            const zebra = i % 2 === 1 ? 'rgba(255,255,255,0.025)' : 'transparent'
            return (
              <Fragment key={a.label}>
                {/* Advantage label */}
                <div className="flex items-center px-2 sm:px-4 py-4 min-h-[3.5rem]" style={{ background: zebra }}>
                  <span className="text-apex-white font-body text-[12.5px] sm:text-[14px] leading-snug">{a.label}</span>
                </div>
                {/* T-Apex — always yes */}
                <div
                  className={`flex items-center justify-center px-3 py-4 ${i === last ? 'rounded-b-2xl pb-7' : ''}`}
                  style={{ background: red, boxShadow: i === last ? '0 26px 44px -16px rgba(225,6,0,0.55)' : undefined }}
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <Check className="w-4 h-4 text-white" />
                  </span>
                </div>
                {/* Competitor */}
                <div className="flex items-center justify-center px-3 py-4" style={{ background: zebra }}>
                  {a.others ? (
                    <span className="flex items-center justify-center w-7 h-7 rounded-full border border-apex-line">
                      <Check className="w-4 h-4 text-apex-grey" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-7 h-7 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <Cross className="w-3.5 h-3.5 text-apex-grey-dim" />
                    </span>
                  )}
                </div>
              </Fragment>
            )
          })}
        </motion.div>

        {/* Verdict + CTA */}
        <motion.div
          className="mt-12 p-8 border border-apex-red/25 flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
          style={{ borderRadius: 0, background: 'rgba(225,6,0,0.05)', borderTop: '2px solid #E10600' }}
          initial={{ opacity: 0, y: 14 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="font-display font-black text-apex-white leading-tight flex-1" style={{ fontSize: 'clamp(1.15rem, 2.1vw, 1.7rem)' }}>
            You&apos;re not choosing between products — you&apos;re choosing whether to measure, or keep guessing.
          </h3>
          <button
            className="flex-shrink-0 inline-flex items-center gap-2.5 cta-glow text-white font-display font-bold text-[11px] px-7 py-4 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_12px_40px_-8px_rgba(225,6,0,0.6)] hover:-translate-y-0.5"
            style={{ borderRadius: 0 }}
          >
            Book Your Free Demo
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

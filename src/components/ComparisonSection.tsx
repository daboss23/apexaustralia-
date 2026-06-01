'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ROWS = [
  {
    feature: 'Load Application',
    traditional: 'Fixed weight or fixed resistance. Cannot adjust mid-rep.',
    tapex: 'Electromagnetic — adapts in real time to athlete velocity and force output.',
    tapexWins: true,
  },
  {
    feature: 'Performance Measurement',
    traditional: 'None. Coaches observe, estimate, and record subjectively.',
    tapex: '200Hz multi-axis telemetry — force, velocity, power, acceleration captured simultaneously.',
    tapexWins: true,
  },
  {
    feature: 'Load Verification',
    traditional: 'Impossible. Load applied ≠ load experienced by athlete.',
    tapex: 'Exact. Every Newton of force delivered is recorded and attributed to the session.',
    tapexWins: true,
  },
  {
    feature: 'Programming Precision',
    traditional: 'Based on last session\'s subjective assessment. Guesswork compounding.',
    tapex: 'Built from objective session data. AI engine optimises every next protocol.',
    tapexWins: true,
  },
  {
    feature: 'Coaching Feedback Speed',
    traditional: 'Post-session review, sometimes next day. Decisions lag reality.',
    tapex: 'Real-time. Coaches see data on the display as each rep is performed.',
    tapexWins: true,
  },
  {
    feature: 'Rehabilitation Safety',
    traditional: 'Prescribed loads are estimated. Actual applied load is unknown.',
    tapex: 'Prescribed and measured. The force applied to the athlete is verified to the Newton.',
    tapexWins: true,
  },
  {
    feature: 'Athlete Accountability',
    traditional: 'None. Training quality is invisible until results (or injuries) appear.',
    tapex: 'Complete. Athletes see their own data per rep. Accountability is built into every session.',
    tapexWins: true,
  },
  {
    feature: 'Multi-Sport Applicability',
    traditional: 'Limited. Resistance machines are position- and movement-specific.',
    tapex: 'Universal. Sprint training, strength work, rehab loading — one platform.',
    tapexWins: true,
  },
]

export default function ComparisonSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const tableInView = useInView(tableRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="comparison" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            10 — The Difference
          </span>
        </div>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <motion.h2
            className="font-display font-black text-apex-white leading-[0.88]"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            WHY T-APEX<br />
            <span className="text-apex-red">IS A DIFFERENT</span><br />
            CATEGORY.
          </motion.h2>
          <motion.div
            className="flex flex-col justify-center gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <p className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              This is not a product comparison. This is a category comparison.
              Traditional resistance training equipment was built before real-time data was possible.
              T-Apex was built for the data era.
            </p>
            <p className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              The comparison below is not T-Apex vs its competitors.
              It is T-Apex vs the conventional approach that most facilities still use today.
            </p>
          </motion.div>
        </div>

        {/* Column headers */}
        <motion.div
          className="grid grid-cols-[1fr,1fr,1fr] gap-0 mb-0"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-5 py-4 bg-apex-panel/60 border border-apex-line/50 border-r-0">
            <span className="text-[9px] font-mono text-apex-grey-dim tracking-[0.25em] uppercase">Feature</span>
          </div>
          <div className="px-5 py-4 bg-apex-panel/40 border border-apex-line/30 border-r-0">
            <span className="text-[9px] font-mono text-apex-grey-dim tracking-[0.25em] uppercase">
              Conventional Training
            </span>
          </div>
          <div
            className="px-5 py-4 border"
            style={{
              background: 'rgba(224,35,31,0.08)',
              borderColor: 'rgba(224,35,31,0.3)',
              borderTop: '2px solid #e0231f',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-apex-red" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              <span className="text-[9px] font-mono font-bold text-apex-red tracking-[0.25em] uppercase">T-Apex</span>
            </div>
          </div>
        </motion.div>

        {/* Comparison rows */}
        <div ref={tableRef} className="flex flex-col">
          {ROWS.map((row, i) => (
            <ComparisonRow key={row.feature} row={row} index={i} inView={tableInView} />
          ))}
        </div>

        {/* Verdict */}
        <motion.div
          className="mt-10 p-8 border border-apex-red/25"
          style={{ borderRadius: 0, background: 'rgba(224,35,31,0.05)', borderTop: '2px solid #e0231f' }}
          initial={{ opacity: 0, y: 14 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[9px] font-mono text-apex-red tracking-[0.25em] uppercase mb-3">The Bottom Line</div>
              <h3
                className="font-display font-black text-apex-white leading-tight"
                style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)' }}
              >
                You are not choosing between products. You are choosing whether to measure — or keep guessing.
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-apex-red hover:bg-apex-red-bright text-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(224,35,31,0.55)] hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Book a Demo
                <svg className="inline-block ml-2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="flex-1 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Talk to the Team
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ComparisonRow({
  row,
  index,
  inView,
}: {
  row: typeof ROWS[0]
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      className="grid grid-cols-[1fr,1fr,1fr] gap-0"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Feature */}
      <div className="px-5 py-4 bg-apex-panel/60 border border-t-0 border-apex-line/50 border-r-0 flex items-start">
        <span className="text-apex-white font-display font-semibold text-[12px] tracking-wide leading-snug">
          {row.feature}
        </span>
      </div>

      {/* Traditional */}
      <div className="px-5 py-4 bg-apex-panel/30 border border-t-0 border-apex-line/30 border-r-0 flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-apex-grey-dim" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-apex-grey font-body text-[12px] leading-relaxed">{row.traditional}</p>
      </div>

      {/* T-Apex */}
      <div
        className="px-5 py-4 flex items-start gap-2.5 border border-t-0"
        style={{
          background: 'rgba(224,35,31,0.05)',
          borderColor: 'rgba(224,35,31,0.2)',
        }}
      >
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-apex-red" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p
          className="font-body text-[12px] leading-relaxed"
          style={{ color: 'rgba(244,244,246,0.85)' }}
        >
          {row.tapex}
        </p>
      </div>
    </motion.div>
  )
}

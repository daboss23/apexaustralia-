'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SEGMENTS = [
  {
    id: 'athletes',
    title: 'Elite Athletes',
    description: 'You train to outperform everyone else. T-Apex gives you the feedback loop that makes every session count — and the data to prove you\'re getting faster, stronger, and more powerful.',
    outcomes: ['Objective performance tracking', 'Adaptive resistance stimulus', 'Real-time session feedback'],
    accent: '#E10600',
  },
  {
    id: 'coaches',
    title: 'Coaches & S&C Staff',
    description: 'Your decisions are only as good as your data. T-Apex gives you the measurement layer that transforms intuition into evidence — so you programme with confidence, not estimates.',
    outcomes: ['Session-by-session progress data', 'Load management visibility', 'AI-optimised program outputs'],
    accent: '#E10600',
  },
  {
    id: 'centres',
    title: 'Performance Centres',
    description: 'You run the facility that elite athletes trust. T-Apex positions your centre as a technology-forward destination — attracting committed coaches and justifying premium positioning.',
    outcomes: ['Commercial differentiation', 'Multi-athlete session management', 'Coach and athlete data platforms'],
    accent: '#00AEEF',
  },
  {
    id: 'rehab',
    title: 'Rehab & Return-to-Play',
    description: 'Graduated loading is the most critical part of return-to-play. T-Apex makes every prescribed load measurable and verifiable — eliminating the guesswork that causes re-injury.',
    outcomes: ['Objective load verification', 'Safe, graduated protocols', 'Physio-to-coach data handoff'],
    accent: '#00AEEF',
  },
  {
    id: 'academies',
    title: 'Schools & Academies',
    description: 'Developing the next generation requires a system that tracks and proves long-term athlete development. T-Apex gives academies the data infrastructure that professional clubs use.',
    outcomes: ['Long-term athlete development tracking', 'Group session telemetry', 'Talent identification data'],
    accent: '#E10600',
  },
  {
    id: 'operators',
    title: 'Private Facility Operators',
    description: 'Your commercial edge is your capability. T-Apex adds a category-defining piece of technology that separates your offering from every standard gym and training space in your market.',
    outcomes: ['Premium service offering', 'Technology-forward positioning', 'Revenue-driving capability'],
    accent: '#00AEEF',
  },
]

export default function WhoItsForSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="who" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(225,6,0,0.25) 30%, rgba(225,6,0,0.25) 70%, transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 40% at 50% 80%, rgba(225,6,0,0.06), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            07 — Who It&apos;s For
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="h-luxia text-apex-white leading-[0.88] mb-6 max-w-4xl"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          BUILT FOR PROGRAMS<br />
          <span className="text-apex-red">THAT TAKE PERFORMANCE SERIOUSLY.</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body max-w-2xl mb-16 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          T-Apex is not a consumer product. It is professional-grade technology built for
          coaches and facilities that want measurable outcomes — not just equipment that looks
          impressive. Read on and find where you fit.
        </motion.p>

        {/* Segments grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEGMENTS.map((seg, i) => (
            <SegmentCard key={seg.id} seg={seg} index={i} />
          ))}
        </div>

        {/* Bridge to sports */}
        <motion.div
          className="mt-16 p-8 border border-apex-line/50 bg-apex-panel/40"
          style={{ borderTop: '2px solid rgba(225,6,0,0.6)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[9px] font-mono text-apex-red tracking-[0.25em] uppercase mb-3">
                Not sure if T-Apex fits your set-up?
              </div>
              <h3
                className="font-display font-black text-apex-white leading-tight mb-3"
                style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)' }}
              >
                If you measure athletic performance, T-Apex belongs in your programme.
              </h3>
              <p className="text-apex-grey font-body text-sm leading-relaxed">
                Every high-level program — from national squads to private academies —
                needs a data layer. T-Apex provides that layer in a single, mobile, professional-grade unit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 cta-glow text-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(225,6,0,0.55)] hover:-translate-y-0.5 active:translate-y-0" style={{ borderRadius: 0 }}>
                Book a Demo
                <svg className="inline-block ml-2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button className="flex-1 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style={{ borderRadius: 0 }}>
                Enquire Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SegmentCard({ seg, index }: { seg: typeof SEGMENTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line p-7 overflow-hidden hover:border-apex-red/30 transition-colors duration-300 cursor-default flex flex-col"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: seg.accent }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${seg.accent}07, transparent)` }}
      />

      <h3
        className="font-display font-black text-apex-white mb-3 leading-tight"
        style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)' }}
      >
        {seg.title}
      </h3>

      <p className="text-apex-grey font-body text-[13px] leading-relaxed mb-5 flex-1">
        {seg.description}
      </p>

      <div className="flex flex-col gap-2">
        {seg.outcomes.map((outcome) => (
          <div key={outcome} className="flex items-start gap-2.5">
            <div
              className="flex-shrink-0 w-4 h-4 mt-0.5 border flex items-center justify-center"
              style={{ borderColor: `${seg.accent}50`, background: `${seg.accent}12` }}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke={seg.accent}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span className="text-apex-grey-dim font-body text-[11px] leading-snug">{outcome}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

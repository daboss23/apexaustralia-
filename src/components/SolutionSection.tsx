'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SOLUTION_PILLARS = [
  {
    label: 'Intelligent Resistance',
    body: 'Electromagnetic drive that adapts in real time to every athlete\'s velocity, force output, and intent. Not a fixed load — a responsive system.',
    stat: '450N',
    statLabel: 'Peak Resistance',
  },
  {
    label: 'Real-Time Telemetry',
    body: '200Hz multi-axis sensor array captures force, speed, power, and acceleration simultaneously. Every rep, every sprint — quantified.',
    stat: '200Hz',
    statLabel: 'Data Capture Rate',
  },
  {
    label: 'AI Adaptation Engine',
    body: 'Machine learning trained on elite athlete datasets continuously optimises every session protocol. The system learns as your athletes improve.',
    stat: '<5ms',
    statLabel: 'Response Latency',
  },
]

export default function SolutionSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="solution" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(224,35,31,0.07), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            03 — The Solution
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — copy */}
          <div>
            <motion.h2
              className="font-display font-black text-apex-white leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              MEET THE<br />
              <span className="text-apex-red">SMARTER TOOL.</span>
            </motion.h2>

            <motion.p
              className="text-apex-grey font-body mb-8 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex is an intelligent resistance training device built for serious performance
              environments. It replaces guesswork with precision — delivering real-time biomechanical
              data, adaptive electromagnetic resistance, and AI-driven training optimisation in one
              professional-grade platform.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body mb-10 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              T-Apex does not require a lab. It rolls onto any track, court, or performance floor and
              begins measuring from the first rep. Coaches see the data in real time. Athletes feel
              the difference within sessions. Programs improve because the feedback loop finally closes.
            </motion.p>

            {/* Outcome statement */}
            <motion.div
              className="border-l-4 border-apex-red pl-6 py-2"
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p
                className="font-display font-black text-apex-white leading-tight"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}
              >
                This is not another piece of gym equipment.
                It is the measurement and adaptation engine that makes every other part of your
                training system more intelligent.
              </p>
            </motion.div>
          </div>

          {/* Right — three pillars */}
          <div className="flex flex-col gap-4">
            {SOLUTION_PILLARS.map((pillar, i) => (
              <SolutionPillar key={pillar.label} pillar={pillar} index={i} parentInView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SolutionPillar({
  pillar,
  index,
  parentInView,
}: {
  pillar: typeof SOLUTION_PILLARS[0]
  index: number
  parentInView: boolean
}) {
  return (
    <motion.div
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-red/30 transition-colors duration-300 cursor-default"
      style={{ borderLeft: '2px solid rgba(224,35,31,0.6)', borderRadius: 0 }}
      initial={{ opacity: 0, x: 24 }}
      animate={parentInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(224,35,31,0.06), transparent)' }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display font-black text-apex-white tracking-wide"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
          {pillar.label}
        </h3>
        <div className="text-right flex-shrink-0">
          <div className="font-mono font-bold text-apex-red leading-none"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }}>
            {pillar.stat}
          </div>
          <div className="text-[9px] font-mono text-apex-grey-dim tracking-wide mt-0.5">{pillar.statLabel}</div>
        </div>
      </div>

      <p className="text-apex-grey font-body text-sm leading-relaxed">{pillar.body}</p>
    </motion.div>
  )
}

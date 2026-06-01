'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SOLUTION_PILLARS = [
  {
    label: 'Precision Loading',
    tag: 'Control',
    body: 'Apply resistance and assistance with greater control across acceleration, deceleration, change of direction, and movement-specific performance work.',
  },
  {
    label: 'Adaptive Response',
    tag: 'Intelligence',
    body: 'Resistance designed to respond to athlete movement and intent — a more responsive loading environment than a fixed, preset stimulus.',
  },
  {
    label: 'Multi-Phase Utility',
    tag: 'Versatility',
    body: 'One system across speed development, force production, control work, progressive reconditioning, and controlled return-to-play.',
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
              MEET THE SMARTER<br />
              <span className="text-apex-red">RESISTANCE SYSTEM.</span>
            </motion.h2>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex is an intelligent resistance training device built to challenge movement with
              greater precision, responsiveness, and performance intent.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              It gives coaches and performance operators a more advanced way to load, guide, and
              develop athletes across multiple phases of training — from acceleration and speed
              development through to controlled return-to-play and progressive reconditioning.
            </motion.p>

            <motion.div
              className="border-l-4 border-apex-red pl-6 py-2 mb-8"
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <p
                className="font-display font-black text-apex-white leading-tight"
                style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)' }}
              >
                This is not just another resistance tool. It is a smarter training system for
                environments that demand more.
              </p>
            </motion.div>

            {/* ARI mechanism support line */}
            <motion.div
              className="relative p-6"
              style={{
                background: 'rgba(20,20,24,0.7)',
                border: '1px solid rgba(224,35,31,0.22)',
                borderLeft: '3px solid #e0231f',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-3" style={{ color: 'rgba(224,35,31,0.85)' }}>
                The Core Mechanism
              </div>
              <p className="text-apex-grey font-body leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                At the core of T-Apex is{' '}
                <span className="text-apex-white font-display font-bold">Adaptive Resistance Intelligence</span>{' '}
                — a broader performance approach designed to make resistance training more precise,
                more adaptable, and more useful inside serious coaching environments.
              </p>
            </motion.div>
          </div>

          {/* Right — three pillars */}
          <div className="flex flex-col gap-4 lg:pt-4">
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
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(224,35,31,0.06), transparent)' }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display font-black text-apex-white tracking-wide"
          style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)' }}>
          {pillar.label}
        </h3>
        <span
          className="flex-shrink-0 text-[8px] font-mono font-semibold tracking-[0.18em] uppercase px-2 py-1 border"
          style={{ color: '#e0231f', borderColor: 'rgba(224,35,31,0.35)', background: 'rgba(224,35,31,0.08)' }}
        >
          {pillar.tag}
        </span>
      </div>

      <p className="text-apex-grey font-body text-sm leading-relaxed">{pillar.body}</p>
    </motion.div>
  )
}

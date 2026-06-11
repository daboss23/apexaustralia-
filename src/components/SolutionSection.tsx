'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SOLUTION_PILLARS = [
  {
    label: 'Precision Loading',
    tag: 'Control',
    body: 'Apply resistance and assistance with fine control across acceleration, deceleration, change of direction, and movement-specific work.',
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
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  // Boot trigger — fires as the section itself enters, slightly before the title
  const booted = useInView(sectionRef, { once: true, margin: '-15% 0px' })

  return (
    <section ref={sectionRef} id="solution" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule — draws on as the system comes online */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={booted ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Boot-up scan sweep — a single blue pass down the section */}
      {booted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              height: '24%',
              background:
                'linear-gradient(180deg, transparent, rgba(0,174,239,0.05) 42%, rgba(0,174,239,0.14) 49%, rgba(0,174,239,0.55) 50%, rgba(0,174,239,0.14) 51%, rgba(0,174,239,0.04) 58%, transparent)',
            }}
            initial={{ y: '-110%', opacity: 1 }}
            animate={{ y: '520%', opacity: [1, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: [0.3, 0, 0.25, 1] }}
          />
        </div>
      )}

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(0,174,239,0.07), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — copy */}
          <div>
            <motion.h2
              className="h-luxia t-silver leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              MEET THE SMARTER<br />
              <motion.span
                className="t-blue inline-block"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [0, 1, 0.4, 1] } : {}}
                transition={{ duration: 0.7, delay: 0.5, times: [0, 0.45, 0.65, 1] }}
              >
                RESISTANCE SYSTEM.
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex is an intelligent resistance training device built to challenge movement with
              real control, fast response, and clear intent.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              It gives coaches a smarter way to load, guide, and
              develop athletes across every phase of training — from acceleration and speed
              work through to controlled return-to-play and progressive reconditioning.
            </motion.p>

            <motion.div
              className="border-l-4 border-apex-blue pl-6 py-2 mb-8"
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <p
                className="font-display font-black t-feature leading-tight"
                style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)' }}
              >
                Not just another resistance tool — a smarter training system for
                coaches who demand more.
              </p>
            </motion.div>

            {/* ARI mechanism support line */}
            <motion.div
              className="relative p-6"
              style={{
                background: 'rgba(20,20,24,0.7)',
                border: '1px solid rgba(0,174,239,0.22)',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {/* Left accent draws on like a powering-up indicator */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-apex-blue origin-top"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="text-[9px] font-mono tracking-[0.26em] uppercase" style={{ color: 'rgba(0,174,239,0.85)' }}>
                  The Core Mechanism
                </div>
                <motion.div
                  className="flex items-center gap-1.5"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.15 }}
                >
                  <span className="text-[7px] font-mono text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-apex-grey font-body leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                At the core of T-Apex is{' '}
                <span className="text-apex-white font-display font-bold">Adaptive Resistance Intelligence</span>{' '}
                — an approach designed to make resistance training more accurate,
                more adaptable, and more useful on real training floors.
                <span
                  className="inline-block w-[6px] h-[11px] ml-1.5 bg-apex-blue/80 align-baseline"
                  style={{ animation: 'caret-blink 1.1s steps(1, end) infinite' }}
                  aria-hidden="true"
                />
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
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-blue/30 transition-colors duration-300 cursor-default"
      style={{ borderLeft: '2px solid rgba(0,174,239,0.6)', borderRadius: 0 }}
      initial={{ opacity: 0, x: 24 }}
      animate={parentInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,174,239,0.06), transparent)' }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display font-black t-feature tracking-wide"
          style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)' }}>
          {pillar.label}
        </h3>
        <span
          className="flex-shrink-0 text-[8px] font-mono font-semibold tracking-[0.18em] uppercase px-2 py-1 border"
          style={{ color: '#00AEEF', borderColor: 'rgba(0,174,239,0.35)', background: 'rgba(0,174,239,0.08)' }}
        >
          {pillar.tag}
        </span>
      </div>

      <p className="text-apex-grey font-body text-sm leading-relaxed">{pillar.body}</p>
    </motion.div>
  )
}

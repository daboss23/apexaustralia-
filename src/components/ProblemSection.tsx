'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PROBLEM_POINTS = [
  {
    num: '01',
    text: 'Generic loading does not always reflect real movement demands',
  },
  {
    num: '02',
    text: 'Limited feedback makes progression harder to measure',
  },
  {
    num: '03',
    text: 'Coaches often rely on feel when they need clearer data',
  },
  {
    num: '04',
    text: 'Athletes need more engaging, responsive training environments',
  },
  {
    num: '05',
    text: 'Rehabilitation and return-to-play require more control, not more guesswork',
  },
]

const GAP_LINES = [
  'A gap between effort and transfer.',
  'A gap between what an athlete is doing and what the coach can actually see.',
  'A gap between standard training tools and what high-performance environments now require.',
]

export default function ProblemSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="problem" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Horizontal rule top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: 'linear-gradient(rgba(244,244,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,246,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      {/* Red ambient wash */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(224,35,31,0.07), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            02 — The Problem
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="font-display font-black text-apex-white leading-[0.88] mb-10 max-w-4xl"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          MOST PERFORMANCE ENVIRONMENTS<br />
          <span className="text-apex-red">ARE STILL TRAINING BLIND.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: narrative */}
          <div>
            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              Traditional resistance methods can build strength, but they often leave too much to feel,
              too much to assumption, and too little to measurable feedback.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body mb-8 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              For serious coaches and operators, that creates a major gap.
            </motion.p>

            {/* Gap lines — staggered emphasis */}
            <div className="flex flex-col gap-4 mb-8">
              {GAP_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-6 h-px bg-apex-red/60 mt-2.5 flex-shrink-0" />
                  <p className="font-display font-semibold text-apex-white leading-snug"
                    style={{ fontSize: 'clamp(1rem, 1.7vw, 1.25rem)' }}>
                    {line}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="font-display font-black text-apex-red leading-tight"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)' }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              When precision matters, generic tools are not enough.
            </motion.p>
          </div>

          {/* Right: problem points */}
          <div className="flex flex-col">
            {PROBLEM_POINTS.map((point, i) => (
              <ProblemPoint key={point.num} point={point} index={i} parentInView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemPoint({
  point,
  index,
  parentInView,
}: {
  point: typeof PROBLEM_POINTS[0]
  index: number
  parentInView: boolean
}) {
  return (
    <motion.div
      className="group flex items-start gap-5 py-5 border-b border-apex-line/40 last:border-b-0 hover:border-apex-red/30 transition-colors duration-400 cursor-default"
      initial={{ opacity: 0, x: 18 }}
      animate={parentInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono font-bold text-apex-red text-[11px] tracking-[0.1em] mt-1 flex-shrink-0">
        {point.num}
      </span>
      <p className="text-apex-grey group-hover:text-apex-white font-body leading-relaxed transition-colors duration-300"
        style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)' }}>
        {point.text}
      </p>
    </motion.div>
  )
}

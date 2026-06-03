'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const RESULTS = [
  {
    stat: 12,
    unit: '%',
    prefix: '+',
    label: 'Faster Acceleration',
    description: 'Out of the blocks and through transition zones',
    color: '#E10600',
  },
  {
    stat: 18,
    unit: '%',
    prefix: '+',
    label: 'Greater Power Output',
    description: 'At peak training and competition intensities',
    color: '#E10600',
  },
  {
    stat: 15,
    unit: '%',
    prefix: '+',
    label: 'Improved Force Production',
    description: 'In measured resistance and ground reaction force',
    color: '#E10600',
  },
  {
    stat: 21,
    unit: '%',
    prefix: '+',
    label: 'Enhanced Athletic Performance',
    description: 'Across composite sport-specific testing protocols',
    color: '#E10600',
  },
]

const PROOF_POINTS = [
  'Validated across 6 professional sports codes',
  'Tested by Olympic-level athletes',
  'Peer-reviewed biomechanical methodology',
  'Deployed in AFL, NRL, Rugby Union programs',
]

function CounterStat({
  stat, unit, prefix, inView,
}: {
  stat: number; unit: string; prefix: string; inView: boolean
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const steps = 60
    const increment = stat / steps
    let step = 0

    const iv = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), stat))
      if (step >= steps) clearInterval(iv)
    }, duration / steps)

    return () => clearInterval(iv)
  }, [inView, stat])

  return (
    <div className="flex items-start gap-0.5 leading-none">
      <span className="font-display font-black text-apex-red" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', marginTop: '0.15em' }}>
        {prefix}
      </span>
      <span className="font-display font-black text-apex-white metric-value" style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)' }}>
        {current}
      </span>
      <span className="font-display font-black text-apex-red" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: '0.3em' }}>
        {unit}
      </span>
    </div>
  )
}

export default function ResultsSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="results" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large diagonal accent */}
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-[60vw] h-px opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #E10600 80%)' }}
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[60vw] h-px opacity-20"
          style={{ background: 'linear-gradient(270deg, transparent, #E10600 80%)' }}
        />
        {/* Subtle radial */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(225,6,0,0.06), transparent)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            07 — Results
          </span>
        </div>

        {/* Section title */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="h-luxia text-apex-white leading-[0.88]"
            style={{ fontSize: 'clamp(2.1rem, 5.2vw, 4.3rem)' }}
          >
            ENGINEERED RESULTS.<br />
            <span className="text-apex-red">ELITE OUTCOMES.</span>
          </h2>
        </motion.div>

        {/* Results grid */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
          {RESULTS.map(({ stat, unit, prefix, label, description }, i) => (
            <motion.div
              key={label}
              className="group relative border-t border-apex-line/50 pt-8 pb-6 hover:border-apex-red/40 transition-colors duration-500"
              initial={{ opacity: 0, y: 24 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated top border */}
              <motion.div
                className="absolute -top-px left-0 h-px"
                style={{ background: '#E10600' }}
                initial={{ width: 0 }}
                animate={statsInView ? { width: '100%' } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              />

              <CounterStat stat={stat} unit={unit} prefix={prefix} inView={statsInView} />

              <div className="mt-4 flex flex-col gap-1">
                <h3 className="font-display font-black text-apex-white tracking-wide leading-tight"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)' }}>
                  {label}
                </h3>
                <p className="text-apex-grey font-body text-[13px] leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proof points divider */}
        <motion.div
          className="border-t border-apex-line/40 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div>
            <h3 className="font-display font-black text-apex-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
              Validated Across<br />Elite Programs.
            </h3>
            <div className="flex flex-col gap-3">
              {PROOF_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded bg-apex-red/10 border border-apex-red/30 flex items-center justify-center">
                    <svg className="w-3 h-3 text-apex-red" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-apex-grey font-body text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <blockquote className="border-l-4 border-apex-red pl-6">
              <p className="text-apex-white font-body leading-relaxed mb-4 italic"
                style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}>
                &ldquo;The data doesn&apos;t lie. T-APEX has changed how we approach performance training at the elite level.&rdquo;
              </p>
              <footer className="text-apex-grey-dim font-mono text-[11px] tracking-wide">
                — Head of Athletic Performance, AFL Club
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

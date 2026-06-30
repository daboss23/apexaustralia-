'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const RESULTS = [
  {
    stat: 40,
    unit: '%',
    prefix: '',
    label: 'Injury Risk Reduction',
    description: 'Controlled load progression and objective return-to-sport metrics',
    color: '#D61F26',
  },
  {
    stat: 12,
    unit: '+',
    prefix: '',
    label: 'Athletes Per Session',
    description: 'Full-squad throughput with multi-device deployment',
    color: '#D61F26',
  },
  {
    stat: 95,
    unit: '%',
    prefix: '',
    label: 'Of Elite Performance',
    description: 'Comparable resisted & assisted capability at roughly one-third of the cost',
    color: '#D61F26',
  },
  {
    stat: 3,
    unit: '×',
    prefix: '',
    label: 'Devices Per Budget',
    description: 'Two to three T-APEX units for the price of one premium system',
    color: '#D61F26',
  },
]

const PROOF_POINTS = [
  'Measurable acceleration gains in 6–8 weeks',
  'No mandatory annual software subscription',
  'Athlete data stored on your team tablet — full control, no cloud risk',
  'One device fleet supports multiple teams and squads',
]

// Photo-finish counter: digits blur-spin like a finish-line camera, then
// snap-freeze on the real number with a one-frame strobe flash. Re-arms when
// the stats grid leaves view so it replays on every scroll-in.
function CounterStat({
  stat, unit, prefix, active, delay,
}: {
  stat: number; unit: string; prefix: string; active: boolean; delay: number
}) {
  const [display, setDisplay] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'spin' | 'locked'>('idle')

  useEffect(() => {
    if (!active) {
      setPhase('idle')
      setDisplay(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(stat)
      setPhase('locked')
      return
    }
    let spinIv: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      setPhase('spin')
      spinIv = setInterval(() => {
        setDisplay(Math.floor(Math.random() * 90) + 10)
      }, 45)
    }, delay * 1000)
    const stop = setTimeout(() => {
      if (spinIv) clearInterval(spinIv)
      setDisplay(stat)
      setPhase('locked')
    }, delay * 1000 + 900)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
      if (spinIv) clearInterval(spinIv)
    }
  }, [active, stat, delay])

  return (
    <div className="relative flex items-start gap-0.5 leading-none">
      {/* Camera strobe — fires the moment the number freezes */}
      {phase === 'locked' && (
        <motion.div
          className="absolute -inset-3 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 35% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0.35) 55%, transparent 75%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.45, times: [0, 0.12, 1], ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}

      <span className="font-luxia font-black t-red" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', marginTop: '0.15em' }}>
        {prefix}
      </span>
      <motion.span
        className="font-luxia font-black t-silver metric-value"
        style={{
          fontSize: 'clamp(4rem, 8vw, 7.5rem)',
          filter: phase === 'spin' ? 'blur(2.5px)' : 'none',
          opacity: phase === 'spin' ? 0.8 : 1,
        }}
        animate={phase === 'locked' ? { scale: [1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {display}
      </motion.span>
      <span className="font-luxia font-black t-red" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: '0.3em' }}>
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
  // Non-once trigger for the photo-finish counters so they re-run each pass
  const statsLive = useInView(statsRef, { amount: 0.35 })

  return (
    <section id="results" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large diagonal accent */}
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-[60vw] h-px opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #D61F26 80%)' }}
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[60vw] h-px opacity-20"
          style={{ background: 'linear-gradient(270deg, transparent, #D61F26 80%)' }}
        />
        {/* Subtle radial */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(214,31,38,0.06), transparent)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
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
            className="h-luxia t-silver leading-[0.88]"
            style={{ fontSize: 'clamp(2.1rem, 5.2vw, 4.3rem)' }}
          >
            ENGINEERED RESULTS.<br />
            <span className="t-red">ELITE OUTCOMES.</span>
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
                style={{ background: '#D61F26' }}
                initial={{ width: 0 }}
                animate={statsInView ? { width: '100%' } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              />

              <CounterStat stat={stat} unit={unit} prefix={prefix} active={statsLive} delay={0.35 + i * 0.18} />

              <div className="mt-4 flex flex-col gap-1">
                <h3 className="font-display font-black t-feature tracking-wide leading-tight"
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
            <h3 className="font-display font-black t-feature mb-6 leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
              Why Programs<br />Choose T-APEX.
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
                &ldquo;Elite-level resisted and assisted sprint capability, objective data, and squad scalability — at a fraction of traditional system costs.&rdquo;
              </p>
              <footer className="text-apex-grey-dim font-mono text-[11px] tracking-wide">
                — T-APEX Resisted &amp; Assisted Speed Training System
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

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
    // Skip the digit-spin only under a genuine reduced-motion preference. On
    // phones the spin now runs too: the number sits over an invisible copy of
    // the final figure that reserves its exact width, and the spin uses the
    // same digit count as the target, so nothing reflows (no page shake).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(stat)
      setPhase('locked')
      return
    }
    const digits = String(stat).length
    const lo = digits > 1 ? Math.pow(10, digits - 1) : 0
    const hi = Math.pow(10, digits)
    let spinIv: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      setPhase('spin')
      spinIv = setInterval(() => {
        setDisplay(Math.floor(Math.random() * (hi - lo)) + lo)
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
      {/* Invisible copy of the final figure reserves the number's exact box so
          the spinning digits can never reflow the row (no page shake). */}
      <span className="relative inline-flex">
        <span
          className="font-luxia font-black t-silver metric-value"
          style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)', visibility: 'hidden' }}
          aria-hidden="true"
        >
          {stat}
        </span>
        <motion.span
          className="font-luxia font-black t-silver metric-value"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: 'clamp(4rem, 8vw, 7.5rem)',
            filter: phase === 'spin' ? 'blur(2.5px)' : 'none',
            opacity: phase === 'spin' ? 0.8 : 1,
          }}
          animate={phase === 'locked' ? { scale: [1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {display}
        </motion.span>
      </span>
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
          <div className="kicker-line kicker-line--l bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[12px] tracking-[0.3em] uppercase font-medium">
            Proof
          </span>
          <div className="kicker-line kicker-line--r bg-apex-blue" />
        </div>

        {/* Section title */}
        <motion.div
          className="mb-10 md:mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="h-luxia t-silver leading-[0.88]"
            style={{ fontSize: 'clamp(2.1rem, 5.2vw, 4.3rem)' }}
          >
            THE NUMBERS<br />
            <span className="t-red">MAKE THE CASE.</span>
          </h2>
        </motion.div>

        {/* Results grid */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 md:mb-20">
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

            {/* Verified customer review */}
            <figure
              className="mt-6 border border-apex-line/60 bg-apex-panel/40 p-5"
              style={{ borderTop: '2px solid rgba(214,31,38,0.45)' }}
            >
              <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-apex-red" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.366 2.446c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.05 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
                  </svg>
                ))}
              </div>
              <figcaption className="font-display font-bold text-apex-white text-[14px] leading-snug mb-2">
                Game Changer
              </figcaption>
              <blockquote className="text-apex-grey font-body text-[13px] leading-relaxed mb-4">
                T-APEX will be a game changer for our athletes this coming year and year to
                come. It&apos;s easy to use for all involved and the possibilities are limitless
                when it comes to how to implement it into your training.
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-apex-line/40">
                <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-apex-carbon border border-apex-line/60 font-mono text-[11px] font-bold text-apex-grey">
                  BF
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-apex-white text-[12px] leading-tight truncate">Brad F</div>
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-apex-grey-dim mt-0.5">Verified Buyer</div>
                </div>
              </div>
            </figure>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

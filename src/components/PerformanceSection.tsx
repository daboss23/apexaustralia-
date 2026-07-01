'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// Photo-finish counter — spins through random values, then locks onto the real
// figure with a camera-strobe flash + scale pop (matches the Results counters).
function FlashStat({
  value, active, delay, className, style,
}: {
  value: string; active: boolean; delay: number; className?: string; style?: React.CSSProperties
}) {
  const digits = value.replace(/\D/g, '').length || 1
  const [display, setDisplay] = useState(value)
  const [phase, setPhase] = useState<'idle' | 'spin' | 'locked'>('idle')

  useEffect(() => {
    if (!active) {
      setPhase('idle')
      setDisplay(value)
      return
    }
    // Skip the digit-spin on reduced-motion AND on phones: the changing number
    // width reflows the layout every tick, which reads as the page "shaking".
    if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) {
      setDisplay(value)
      setPhase('locked')
      return
    }
    let spinIv: ReturnType<typeof setInterval> | undefined
    const lo = Math.pow(10, digits - 1)
    const hi = Math.pow(10, digits)
    const start = setTimeout(() => {
      setPhase('spin')
      spinIv = setInterval(() => {
        setDisplay(String(Math.floor(Math.random() * (hi - lo)) + lo))
      }, 45)
    }, delay * 1000)
    const stop = setTimeout(() => {
      if (spinIv) clearInterval(spinIv)
      setDisplay(value)
      setPhase('locked')
    }, delay * 1000 + 900)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
      if (spinIv) clearInterval(spinIv)
    }
  }, [active, value, delay, digits])

  return (
    <span className="relative inline-flex">
      {phase === 'locked' && (
        <motion.span
          className="absolute -inset-2 pointer-events-none z-10"
          style={{ background: 'radial-gradient(ellipse 65% 80% at 40% 50%, rgba(255,255,255,0.85), rgba(255,255,255,0.3) 55%, transparent 75%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.45, times: [0, 0.12, 1], ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
      <motion.span
        className={className}
        style={{ ...style, display: 'inline-block', filter: phase === 'spin' ? 'blur(2.5px)' : 'none', opacity: phase === 'spin' ? 0.8 : 1 }}
        animate={phase === 'locked' ? { scale: [1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {display}
      </motion.span>
    </span>
  )
}

const HEADLINE_METRICS = [
  { value: '14', unit: 'm/s', label: 'Assisted Top Speed', sub: 'With the overspeed module' },
  { value: '1000', unit: 'Hz', label: 'Data Capture', sub: 'Force & velocity, user-selectable' },
  { value: '120', unit: 'm', label: 'Cable Range', sub: 'Full-field training reach' },
  { value: '100', unit: 'm', label: 'Tablet Range', sub: 'Coach from anywhere on the field' },
]

const SPORT_CARDS = [
  {
    sport: 'RESISTANCE',
    stat: '0–40kg',
    metric: 'Adaptive Load',
    detail: 'Continuous resistance, to 90 kgf with accessories',
    bar: 75,
    color: '#00AEEF',
  },
  {
    sport: 'OVERSPEED',
    stat: '14m/s',
    metric: 'Assisted Speed',
    detail: 'Towed overspeed sprinting',
    bar: 90,
    color: '#00AEEF',
  },
  {
    sport: 'TELEMETRY',
    stat: '1000Hz',
    metric: 'Data Capture',
    detail: 'Force & velocity, user-selectable',
    bar: 85,
    color: '#00AEEF',
  },
  {
    sport: 'REACH',
    stat: '120m',
    metric: 'Cable Range',
    detail: 'Full-field training distance',
    bar: 80,
    color: '#00AEEF',
  },
  {
    sport: 'SETUP',
    stat: '~5min',
    metric: 'Squad-Ready',
    detail: 'From case to first sprint',
    bar: 70,
    color: '#00AEEF',
  },
  {
    sport: 'PORTABLE',
    stat: '~20kg',
    metric: 'Airline-Approved',
    detail: 'Move it between sites with ease',
    bar: 60,
    color: '#00AEEF',
  },
]


function SportCard({ card, index }: { card: typeof SPORT_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })
  // Non-once trigger so the photo-finish counter re-runs on each scroll-in,
  // exactly like the headline metrics above.
  const liveRef = useRef<HTMLDivElement>(null)
  const live = useInView(liveRef, { amount: 0.6 })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line p-5 overflow-hidden cursor-default hover:border-apex-blue/30 transition-colors duration-300"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(214,31,38,0.06), transparent)` }}
      />

      {/* Sport label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono font-semibold tracking-[0.25em] text-apex-grey uppercase">
          {card.sport}
        </span>
        <span className="text-[10px] font-mono text-apex-grey-dim">#0{index + 1}</span>
      </div>

      {/* Stat — same photo-finish move + flash as the headline metrics above */}
      <div ref={liveRef} className="flex items-baseline gap-1.5 mb-1">
        <FlashStat
          value={card.stat}
          active={live}
          delay={(index % 3) * 0.08 + 0.2}
          className="font-luxia font-black text-4xl t-blue leading-none"
        />
      </div>
      <div className="text-sm font-display font-bold text-apex-white tracking-wide mb-0.5">{card.metric}</div>
      <div className="text-[11px] font-body text-apex-grey mb-4">{card.detail}</div>

      {/* Progress bar */}
      <div className="relative h-[3px] bg-apex-line rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: card.color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${card.bar}%` } : {}}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function PerformanceSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const metricsRef = useRef<HTMLDivElement>(null)
  // Non-once so the photo-finish counters re-run on each scroll-in pass.
  const metricsLive = useInView(metricsRef, { amount: 0.4 })

  return (
    <section id="performance" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
      {/* Background diagonal accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[15, 35, 55, 75].map((pct) => (
          <div
            key={pct}
            className="absolute h-px w-full"
            style={{
              top: `${pct}%`,
              background: `linear-gradient(90deg, transparent 0%, rgba(38,38,46,0.5) 20%, rgba(38,38,46,0.5) 80%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <motion.div
          ref={titleRef}
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">02 — Performance In Motion</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="h-luxia t-silver mb-4 leading-[0.9]"
          style={{ fontSize: 'clamp(2.1rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          ENGINEERED FOR<br />
          <span className="t-red">EVERY ATHLETE</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body max-w-xl mb-10 md:mb-16 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From Olympic sprinters to professional rugby squads — T-APEX delivers adaptive resistance, assisted overspeed, and real-time data across every movement, every athlete.
        </motion.p>

        {/* Cinematic product film */}
        <motion.div
          className="relative mb-12 md:mb-20 overflow-hidden aspect-video"
          style={{ border: '1px solid rgba(214,31,38,0.22)', borderTop: '2px solid #D61F26' }}
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/athlete-intro.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          {/* Cinematic vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(180deg, rgba(5,5,5,0.4) 0%, transparent 24%, transparent 68%, rgba(5,5,5,0.72) 100%)'
          }} />
          {/* HUD label */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-apex-blue animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-apex-white/90">T-APEX // In Motion</span>
          </div>
          {/* Corner reticles */}
          <svg className="absolute top-3 right-3 pointer-events-none" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M0 0 L9 0 L9 9" fill="none" stroke="#D61F26" strokeWidth="1.2" opacity="0.6" /></svg>
          <svg className="absolute bottom-3 left-3 pointer-events-none" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M0 0 L0 9 L9 9" fill="none" stroke="#D61F26" strokeWidth="1.2" opacity="0.6" /></svg>
        </motion.div>

        {/* Headline metrics — editorial asymmetric layout */}
        <div ref={metricsRef} className="flex flex-col lg:flex-row gap-8 lg:gap-14 mb-12 md:mb-20 pb-12 md:pb-20 border-b border-apex-line/40 items-start lg:items-center">
          {/* Primary stat: oversized editorial anchor */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline leading-none">
              <FlashStat
                value={HEADLINE_METRICS[0].value}
                active={metricsLive}
                delay={0.15}
                className="font-luxia font-bold t-silver metric-value"
                style={{ fontSize: 'clamp(5.5rem, 13vw, 10.5rem)', letterSpacing: '-0.01em' }}
              />
              <span
                className="t-blue font-luxia font-bold ml-1"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
              >
                {HEADLINE_METRICS[0].unit}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-px bg-apex-blue" />
              <span className="font-display font-semibold text-apex-white tracking-[0.14em] uppercase text-sm">
                {HEADLINE_METRICS[0].label}
              </span>
            </div>
            <span className="text-apex-grey-dim font-body text-[11px] mt-1 block">{HEADLINE_METRICS[0].sub}</span>
          </motion.div>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px self-stretch bg-apex-line flex-shrink-0" />

          {/* Three secondary stats — compact stacked */}
          <div className="flex flex-col gap-5 justify-center">
            {HEADLINE_METRICS.slice(1).map(({ value, unit, label, sub }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-5"
                initial={{ opacity: 0, x: 18 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-0.5 min-w-[80px]">
                  <FlashStat
                    value={value}
                    active={metricsLive}
                    delay={0.3 + i * 0.12}
                    className="font-luxia font-bold t-silver leading-none metric-value"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                  />
                  {unit && (
                    <span className="t-blue font-luxia font-bold" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.3rem)' }}>
                      {unit}
                    </span>
                  )}
                </div>
                <div className="border-l border-apex-line pl-4">
                  <div className="text-apex-white font-display font-semibold text-sm tracking-wide">{label}</div>
                  <div className="text-apex-grey-dim font-body text-[10px]">{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sport cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPORT_CARDS.map((card, i) => (
            <SportCard key={card.sport} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

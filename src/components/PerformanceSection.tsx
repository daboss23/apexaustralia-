'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const HEADLINE_METRICS = [
  { value: '23', unit: '%', label: 'Speed Increase', sub: 'Top-end velocity gains' },
  { value: '31', unit: '%', label: 'Force Output', sub: 'Peak force production' },
  { value: '28', unit: '%', label: 'Power Gains', sub: 'Explosive power output' },
  { value: '4×', unit: '', label: 'Training Efficiency', sub: 'vs conventional methods' },
]

const SPORT_CARDS = [
  {
    sport: 'SPRINTING',
    stat: '+23%',
    metric: 'Acceleration',
    detail: 'Out of blocks to top speed',
    bar: 82,
    color: '#E10600',
  },
  {
    sport: 'RUGBY',
    stat: '+19%',
    metric: 'Force Output',
    detail: 'Tackle & contact strength',
    bar: 70,
    color: '#E10600',
  },
  {
    sport: 'AFL',
    stat: '+21%',
    metric: 'Sprint Speed',
    detail: 'Repeat sprint ability',
    bar: 76,
    color: '#E10600',
  },
  {
    sport: 'FOOTBALL',
    stat: '+18%',
    metric: 'Explosiveness',
    detail: 'First step quickness',
    bar: 68,
    color: '#E10600',
  },
  {
    sport: 'BASKETBALL',
    stat: '+25%',
    metric: 'Vertical Power',
    detail: 'Jump height & force',
    bar: 88,
    color: '#E10600',
  },
  {
    sport: 'OLYMPIC',
    stat: '+17%',
    metric: 'Peak Output',
    detail: 'Podium-level performance',
    bar: 64,
    color: '#E10600',
  },
]


function SportCard({ card, index }: { card: typeof SPORT_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line p-5 overflow-hidden cursor-default hover:border-apex-red/30 transition-colors duration-300"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(225,6,0,0.06), transparent)` }}
      />

      {/* Sport label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono font-semibold tracking-[0.25em] text-apex-grey uppercase">
          {card.sport}
        </span>
        <span className="text-[10px] font-mono text-apex-grey-dim">#0{index + 1}</span>
      </div>

      {/* Stat */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="font-display font-black text-4xl text-apex-red leading-none">{card.stat}</span>
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

  return (
    <section id="performance" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
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
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">02 — Performance In Motion</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="h-luxia text-apex-white mb-4 leading-[0.9]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          ENGINEERED FOR<br />
          <span className="text-apex-red">EVERY ATHLETE</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body max-w-xl mb-16 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From Olympic sprinters to professional rugby players — T-APEX adapts to every sport, every movement, every athlete.
        </motion.p>

        {/* Cinematic product film */}
        <motion.div
          className="relative mb-20 overflow-hidden aspect-video"
          style={{ border: '1px solid rgba(225,6,0,0.22)', borderTop: '2px solid #E10600' }}
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
            <div className="w-1.5 h-1.5 rounded-full bg-apex-red animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-apex-white/90">T-APEX // In Motion</span>
          </div>
          {/* Corner reticles */}
          <svg className="absolute top-3 right-3 pointer-events-none" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M0 0 L9 0 L9 9" fill="none" stroke="#E10600" strokeWidth="1.2" opacity="0.6" /></svg>
          <svg className="absolute bottom-3 left-3 pointer-events-none" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M0 0 L0 9 L9 9" fill="none" stroke="#E10600" strokeWidth="1.2" opacity="0.6" /></svg>
        </motion.div>

        {/* Headline metrics — editorial asymmetric layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 mb-20 pb-20 border-b border-apex-line/40 items-start lg:items-center">
          {/* Primary stat: oversized editorial anchor */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline leading-none">
              <span
                className="font-display font-bold text-apex-white metric-value"
                style={{ fontSize: 'clamp(5.5rem, 13vw, 10.5rem)', letterSpacing: '-0.01em' }}
              >
                {HEADLINE_METRICS[0].value}
              </span>
              <span
                className="text-apex-red font-display font-bold ml-1"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
              >
                {HEADLINE_METRICS[0].unit}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-px bg-apex-red" />
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
                  <span
                    className="font-display font-bold text-apex-white leading-none metric-value"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                  >
                    {value}
                  </span>
                  {unit && (
                    <span className="text-apex-red font-display font-bold" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.3rem)' }}>
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

        {/* Bottom CTA */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="group inline-flex items-center gap-2.5 border border-apex-line hover:border-apex-red/60 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-8 py-4 rounded-xl tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
            View All Sports Applications
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

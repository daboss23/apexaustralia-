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
    color: '#e0231f',
  },
  {
    sport: 'RUGBY',
    stat: '+19%',
    metric: 'Force Output',
    detail: 'Tackle & contact strength',
    bar: 70,
    color: '#e0231f',
  },
  {
    sport: 'AFL',
    stat: '+21%',
    metric: 'Sprint Speed',
    detail: 'Repeat sprint ability',
    bar: 76,
    color: '#e0231f',
  },
  {
    sport: 'FOOTBALL',
    stat: '+18%',
    metric: 'Explosiveness',
    detail: 'First step quickness',
    bar: 68,
    color: '#00A3FF',
  },
  {
    sport: 'BASKETBALL',
    stat: '+25%',
    metric: 'Vertical Power',
    detail: 'Jump height & force',
    bar: 88,
    color: '#00A3FF',
  },
  {
    sport: 'OLYMPIC',
    stat: '+17%',
    metric: 'Peak Output',
    detail: 'Podium-level performance',
    bar: 64,
    color: '#00A3FF',
  },
]

function CounterNumber({ value, unit }: { value: string; unit: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className="flex items-start gap-1 leading-none">
      <motion.span
        className="font-display font-black text-apex-white metric-value"
        style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.span>
      {unit && (
        <motion.span
          className="text-apex-red font-display font-black mt-2"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {unit}
        </motion.span>
      )}
    </div>
  )
}

function SportCard({ card, index }: { card: typeof SPORT_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line rounded-xl p-5 overflow-hidden cursor-default hover:border-apex-red/30 transition-colors duration-300"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(224,35,31,0.06), transparent)` }}
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
          className="font-display font-black text-apex-white mb-4 leading-[0.9]"
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

        {/* Headline metric counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 pb-20 border-b border-apex-line/40">
          {HEADLINE_METRICS.map(({ value, unit, label, sub }, i) => (
            <motion.div
              key={label}
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            >
              <CounterNumber value={value} unit={unit} />
              <div className="flex flex-col gap-0.5 border-l-2 border-apex-red pl-3">
                <span className="text-apex-white font-display font-bold text-sm tracking-wide">{label}</span>
                <span className="text-apex-grey-dim font-body text-[11px]">{sub}</span>
              </div>
            </motion.div>
          ))}
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

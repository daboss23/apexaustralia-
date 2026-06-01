'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BENEFITS = [
  {
    num: '01',
    title: 'Precision That Removes Guesswork',
    body: 'Every force application, every velocity rep, every power output — quantified at 200Hz. Coaches program from fact, not intuition. Athletes train to objective targets, not subjective effort.',
    accent: '#e0231f',
    tag: 'DATA PRECISION',
  },
  {
    num: '02',
    title: 'Measurable Progression, Session by Session',
    body: 'T-Apex records every session. Progression is not a feeling — it is a number. Plateaus are visible before they cost you a competition. Load, force, power, and velocity trends are tracked automatically.',
    accent: '#e0231f',
    tag: 'ATHLETE DEVELOPMENT',
  },
  {
    num: '03',
    title: 'Coaching Decisions Built on Real Data',
    body: 'Stop choosing loads based on last week\'s programme. See how the athlete responded to yesterday\'s session. Make today\'s decision with yesterday\'s data. That is how elite programs pull ahead.',
    accent: '#00A3FF',
    tag: 'COACHING INTELLIGENCE',
  },
  {
    num: '04',
    title: 'Athlete Engagement Through Visibility',
    body: 'When athletes can see their own performance data in real time, engagement lifts. Accountability becomes inherent. The athlete is no longer working in the dark — they are competing against their own numbers.',
    accent: '#00A3FF',
    tag: 'ENGAGEMENT',
  },
  {
    num: '05',
    title: 'Performance and Rehab in One System',
    body: 'The same platform that drives elite performance also provides graduated, measurable loading for injured athletes. Physios specify exact force targets. Loads are verified. Guesswork in return-to-play is eliminated.',
    accent: '#e0231f',
    tag: 'VERSATILITY',
  },
  {
    num: '06',
    title: 'Technology That Works Across Every Code',
    body: 'AFL, NRL, Rugby Union, Football, Basketball, Athletics, Olympic programs, S&C. T-Apex is not sport-specific hardware — it is a universal performance measurement and resistance platform.',
    accent: '#7B2FBE',
    tag: 'MULTI-SPORT',
  },
]

export default function BenefitsSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="benefits" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Subtle diagonal pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(224,35,31,1) 0px, rgba(224,35,31,1) 1px, transparent 1px, transparent 60px)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            04 — Why It Matters
          </span>
        </div>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.h2
            className="font-display font-black text-apex-white leading-[0.88]"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            SIX REASONS<br />
            <span className="text-apex-red">IT CHANGES</span><br />
            EVERYTHING.
          </motion.h2>
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <p className="text-apex-grey font-body leading-relaxed mb-6"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              T-Apex does not add more volume to your training programme.
              It adds precision, accountability, and measurability to everything you already do.
            </p>
            <p className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              The result: better athlete outcomes, better coaching decisions, and a facility
              that operates with a clear competitive advantage over those still training without data.
            </p>
          </motion.div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.num} benefit={benefit} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitCard({ benefit, index }: { benefit: typeof BENEFITS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-red/30 transition-colors duration-300 cursor-default flex flex-col"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px]"
        style={{ background: benefit.accent }}
        initial={{ width: 0 }}
        animate={inView ? { width: '100%' } : {}}
        transition={{ duration: 1, delay: 0.3 + index * 0.07 }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${benefit.accent}08, transparent)` }}
      />

      {/* Number + tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono font-bold text-apex-grey-dim text-[10px] tracking-[0.22em]">{benefit.num}</span>
        <span
          className="text-[8px] font-mono font-semibold tracking-[0.18em] uppercase px-2 py-0.5 border"
          style={{ color: benefit.accent, borderColor: `${benefit.accent}35`, background: `${benefit.accent}10` }}
        >
          {benefit.tag}
        </span>
      </div>

      <h3
        className="font-display font-black text-apex-white mb-3 leading-tight"
        style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}
      >
        {benefit.title}
      </h3>

      <p className="text-apex-grey font-body text-sm leading-relaxed flex-1">{benefit.body}</p>
    </motion.div>
  )
}

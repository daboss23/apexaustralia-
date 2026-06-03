'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const COACH_OUTCOMES = [
  'apply load with more intent',
  'progress athletes more intelligently',
  'coach movement beyond straight-line speed',
  'support broader athletic development',
  'create greater transfer across multiple performance demands',
]

const ROWS = [
  {
    dimension: 'Primary performance idea',
    tapex: 'Adaptive Resistance Intelligence across a wide range of training',
    sprint: 'Sprint resistance and overspeed emphasis',
  },
  {
    dimension: 'Training application',
    tapex: 'Speed, force, control, acceleration, deceleration, COD, progress, rehab',
    sprint: 'Stronger straight-line sprint and overspeed association',
  },
  {
    dimension: 'Coaching flexibility',
    tapex: 'Wide-ranging use across many settings and movement demands',
    sprint: 'More sprint-specific in perception and primary use case',
  },
  {
    dimension: 'Environment fit',
    tapex: 'Built for coaches, facilities, rehab, and whole-system use',
    sprint: 'Best known in sprint-focused and speed-development contexts',
  },
  {
    dimension: 'System philosophy',
    tapex: 'A complete adaptive resistance performance system',
    sprint: 'A highly recognised sprint resistance category product',
  },
]

export default function TApexVs1080Section() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const tableRef = useRef<HTMLDivElement>(null)
  const tableInView = useInView(tableRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="vs-1080" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
      />

      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(0,174,239,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(0,174,239,0.06), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Headline */}
        <motion.h2
          ref={titleRef}
          className="h-luxia t-silver leading-[0.9] mb-6 max-w-5xl"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          MORE THAN A<br />
          <span className="t-blue">SPRINT RESISTANCE TOOL.</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.div
          className="max-w-3xl mb-14"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          <p className="text-apex-grey font-body leading-relaxed mb-3"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}>
            If you are only looking for resisted sprint or overspeed work, there are already tools in
            the market built for that lane.
          </p>
          <p className="font-display font-bold t-feature leading-snug"
            style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)' }}>
            T-Apex is built for something broader.
          </p>
        </motion.div>

        {/* Philosophy framing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            <p className="text-apex-grey font-body leading-relaxed mb-4"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              Most buyers in this category are not simply comparing machines. They are comparing
              training philosophies.
            </p>
            <p className="font-display font-black t-feature leading-tight mb-6"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)' }}>
              And that is where T-Apex creates separation.
            </p>
            <p className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              While 1080 Sprint is widely recognised for sprint resistance, overspeed application,
              and straight-line speed work, T-Apex is built around a wider high-performance
              principle:
            </p>

            {/* ARI mechanism callout */}
            <div
              className="mt-6 p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(20,20,24,1) 0%, rgba(10,13,16,1) 55%, rgba(0,174,239,0.08) 100%)',
                border: '1px solid rgba(0,174,239,0.3)',
                borderLeft: '4px solid #00AEEF',
              }}
            >
              <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M40 40V0H0" stroke="#00AEEF" strokeWidth="1" />
                </svg>
              </div>
              <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-2" style={{ color: 'rgba(0,174,239,0.85)' }}>
                The Core Principle
              </div>
              <div className="font-display font-black t-feature leading-none"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
                Adaptive Resistance Intelligence
              </div>
            </div>
          </motion.div>

          {/* Coach outcomes */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            <p className="text-apex-grey font-body leading-relaxed mb-2"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              T-Apex is not just designed to tow, assist, or resist sprinting.
            </p>
            <p className="text-apex-white font-body leading-relaxed mb-6"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              It is designed to create a more responsive resistance environment that helps coaches:
            </p>
            <div className="flex flex-col">
              {COACH_OUTCOMES.map((outcome, i) => (
                <motion.div
                  key={outcome}
                  className="flex items-center gap-4 py-3.5 border-b border-apex-line/40 last:border-b-0"
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }}
                >
                  <span className="font-mono text-[10px] text-apex-blue tracking-[0.1em] flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-apex-grey font-body leading-snug"
                    style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1.02rem)' }}>
                    {outcome}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Comparison intro */}
        <motion.p
          className="font-display font-bold t-feature leading-snug mb-8 max-w-3xl"
          style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          For programs that need more than a narrow sprint tool, the difference becomes clear.
        </motion.p>

        {/* Comparison table */}
        {/* Column headers */}
        <div ref={tableRef}>
          <motion.div
            className="grid grid-cols-[1.1fr,1.4fr,1.4fr] gap-0"
            initial={{ opacity: 0 }}
            animate={tableInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="px-5 py-4 bg-apex-panel/60 border border-apex-line/50 border-r-0">
              <span className="text-[9px] font-mono text-apex-grey-dim tracking-[0.22em] uppercase">Dimension</span>
            </div>
            <div
              className="px-5 py-4 border"
              style={{ background: 'rgba(0,174,239,0.08)', borderColor: 'rgba(0,174,239,0.3)', borderTop: '2px solid #00AEEF', borderRight: 'none' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-apex-blue" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <span className="text-[9px] font-mono font-bold text-apex-blue tracking-[0.22em] uppercase">T-Apex</span>
              </div>
            </div>
            <div className="px-5 py-4 bg-apex-panel/40 border border-apex-line/40">
              <span className="text-[9px] font-mono text-apex-grey-dim tracking-[0.22em] uppercase">1080 Sprint</span>
            </div>
          </motion.div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={row.dimension}
              className="grid grid-cols-[1.1fr,1.4fr,1.4fr] gap-0"
              initial={{ opacity: 0 }}
              animate={tableInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              {/* Dimension */}
              <div className="px-5 py-4 bg-apex-panel/60 border border-t-0 border-apex-line/50 border-r-0 flex items-start">
                <span className="text-apex-white font-display font-semibold text-[12px] tracking-wide leading-snug">
                  {row.dimension}
                </span>
              </div>

              {/* T-Apex (highlighted) */}
              <div
                className="px-5 py-4 flex items-start gap-2.5 border border-t-0"
                style={{ background: 'rgba(0,174,239,0.05)', borderColor: 'rgba(0,174,239,0.22)', borderRight: 'none' }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-apex-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="font-body text-[12px] leading-relaxed" style={{ color: 'rgba(244,244,246,0.9)' }}>
                  {row.tapex}
                </p>
              </div>

              {/* 1080 Sprint */}
              <div className="px-5 py-4 bg-apex-panel/30 border border-t-0 border-apex-line/40 flex items-start">
                <p className="text-apex-grey font-body text-[12px] leading-relaxed">{row.sprint}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing paragraph */}
        <motion.div
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-apex-grey font-body leading-relaxed mb-4"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
            That does not make one tool &ldquo;good&rdquo; and the other &ldquo;bad.&rdquo; It means
            they are not solving the same problem in the same way.
          </p>
          <p className="text-apex-grey font-body leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
            If your priority is a complete performance system that can support demanding coaching
            well beyond one-dimensional sprint work, T-Apex creates a different category of value.
          </p>
        </motion.div>

        {/* Closing line + CTA */}
        <motion.div
          className="mt-10 p-8 md:p-10 border border-apex-blue/25"
          style={{ borderRadius: 0, background: 'rgba(0,174,239,0.05)', borderTop: '2px solid #00AEEF' }}
          initial={{ opacity: 0, y: 14 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-display font-black text-apex-white leading-tight"
                style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)' }}>
                This is not just another sprint tool. It is an{' '}
                <span className="text-apex-blue">Adaptive Resistance Intelligence system</span>{' '}
                for elite performance programs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 cta-glow text-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(225,6,0,0.55)] hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Book a Demo
                <svg className="inline-block ml-2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="flex-1 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Talk to the Team
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

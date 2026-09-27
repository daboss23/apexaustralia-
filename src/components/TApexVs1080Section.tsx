'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const COACH_OUTCOMES = [
  'apply load with more intent',
  'progress athletes more intelligently',
  'coach movement beyond straight-line speed',
  'support broader athletic development',
  'create greater transfer across multiple performance demands',
]

export default function TApexVs1080Section() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const closeRef = useRef<HTMLDivElement>(null)
  const closeInView = useInView(closeRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="vs-1080" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
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
          <span className="t-blue">SPRINT RESISTANCE<br />TOOL.</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.div
          className="max-w-3xl mb-8 md:mb-14"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-12 lg:gap-16 mb-10 md:mb-16">
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
              While 1080 Sprint 2 is widely recognised for sprint resistance, overspeed application,
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

        {/* Closing paragraph (the comparison table that used to sit above it
            now lives in ComparisonSection) */}
        <motion.div
          ref={closeRef}
          className="mt-7 md:mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={closeInView ? { opacity: 1, y: 0 } : {}}
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
          animate={closeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Centred on phones — justify spreads the short lines into ugly word
              gaps at narrow widths; from md up it justifies as before. */}
          <p className="font-display font-black text-apex-white leading-tight max-w-3xl mx-auto text-center md:text-justify"
            style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)', textAlignLast: 'center' }}>
            This is not just another sprint tool. It is an{' '}
            <span className="text-apex-blue">Adaptive Resistance Intelligence system</span>{' '}
            for elite performance programs.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

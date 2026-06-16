'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Pulled directly from the T-APEX "Data-Driven Insights" guide page.
const INSIGHTS = [
  {
    title: 'Peak Velocity & Acceleration',
    body: 'Top-end speed and rate of acceleration captured for every rep and every sprint.',
  },
  {
    title: 'Force Production & Power Output',
    body: 'Objective force and power data for each effort — not feel, not guesswork.',
  },
  {
    title: 'Movement Efficiency Metrics',
    body: 'Quantify how cleanly an athlete moves and where output is being lost.',
  },
  {
    title: 'Longitudinal Development Tracking',
    body: 'Follow each athlete week-on-week to evidence real, measurable progress.',
  },
]

const REPORTS = [
  { label: 'Single Training Report', detail: 'A full report for an individual training session.' },
  { label: 'Comparative Report', detail: 'Compare efforts and athletes across two training sessions.' },
  { label: 'Trending Report', detail: 'Track the trend of this athlete’s profile over time.' },
]

export default function DataInsightsSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="data" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 70% 30%, rgba(0,174,239,0.06), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            Data-Driven Insights
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          <div>
            <motion.h2
              className="h-luxia t-silver leading-[0.9] mb-6"
              style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              EVERY REP,<br /><span className="t-blue">QUANTIFIED.</span>
            </motion.h2>
            <motion.p
              className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              Every T-APEX session generates comprehensive performance data — enabling coaches,
              sports scientists, rehab and medical staff to make evidence-based decisions instead
              of relying on feel.
            </motion.p>

            {/* Data ownership callout — a genuine differentiator from the guide */}
            <motion.div
              className="mt-8 relative p-6"
              style={{
                background: 'rgba(20,20,24,0.7)',
                border: '1px solid rgba(0,174,239,0.22)',
                borderLeft: '3px solid #00AEEF',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-3" style={{ color: 'rgba(0,174,239,0.85)' }}>
                Your Data Stays Yours
              </div>
              <p className="text-apex-grey font-body leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                Athlete data is stored securely on your{' '}
                <span className="text-apex-white font-display font-bold">dedicated team tablet</span>{' '}
                — complete team control, no mandatory cloud subscription, and none of the
                third-party cloud risk. Raw data for any repetition can be exported and moved into
                other software easily.
              </p>
            </motion.div>
          </div>

          {/* Insight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 self-center">
            {INSIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-blue/30 transition-colors duration-300"
                style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,174,239,0.06), transparent)' }}
                />
                <h3 className="font-display font-black t-feature mb-2 leading-tight"
                  style={{ fontSize: 'clamp(0.98rem, 1.5vw, 1.15rem)' }}>
                  {item.title}
                </h3>
                <p className="text-apex-grey font-body text-[12.5px] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Report types */}
        <motion.div
          className="border-t border-apex-line/40 pt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-display font-bold t-feature mb-6" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}>
            Three report types for every athlete and every repetition
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REPORTS.map((r, i) => (
              <motion.div
                key={r.label}
                className="flex items-start gap-4 bg-apex-panel/60 border border-apex-line p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }}
              >
                <span className="font-mono text-[10px] text-apex-blue tracking-[0.1em] mt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="font-display font-bold text-apex-white text-[14px] mb-1">{r.label}</div>
                  <div className="text-apex-grey font-body text-[12px] leading-relaxed">{r.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

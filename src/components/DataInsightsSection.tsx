'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Placeholder slots for real raw-data report imagery (supplied later).
const RAW_DATA = [
  { src: '', label: 'Single Training Report' },
  { src: '', label: 'Comparative Report' },
  { src: '', label: 'Trending Report' },
]

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

        {/* Data report video — full-bleed, edge to edge */}
        <motion.div
          className="relative w-screen ml-[calc(50%-50vw)] mt-12 overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <video
            src="/data-report.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="block w-full h-auto origin-center scale-[1.02]"
          />

          {/* Overall darkening scrim — same tint depth as the top hero banner */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,5,8,0.45)' }} />

          {/* Top & bottom vignette — melts the clip into the black, like the hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #050505 0%, rgba(5,5,5,0.85) 7%, transparent 22%, transparent 64%, rgba(5,5,5,0.85) 88%, #050505 99%)' }}
          />
        </motion.div>

        {/* Raw data showcase — logo header + sample report imagery */}
        <motion.div
          className="border-t border-apex-line/40 pt-12 mt-16"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col items-center text-center mb-10">
            <h2
              className="h-luxia t-silver leading-[1.08] max-w-4xl"
              style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.9rem)' }}
            >
              REAL REPORTS, STRAIGHT FROM A LIVE SESSION —{' '}
              <span className="t-blue">SEE THE RAW DATA EXACTLY AS YOUR COACHES</span> AND SPORTS SCIENTISTS DO.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {RAW_DATA.map((item, i) => (
              <motion.div
                key={item.label}
                className="relative bg-apex-panel border border-apex-line overflow-hidden"
                style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative aspect-[4/3] flex items-center justify-center">
                  {item.src ? (
                    <Image src={item.src} alt={item.label} fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-apex-grey-dim">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="1" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                      </svg>
                      <span className="font-mono text-[9px] tracking-[0.24em] uppercase">
                        Image {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 border-t border-apex-line">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-apex-blue">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

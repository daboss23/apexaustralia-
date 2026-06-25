'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Real raw-data report imagery, framed as engineered telemetry panels.
const RAW_DATA = [
  {
    src: '/apex report 1.jpg',
    label: 'Session Report',
    code: 'RPT-01',
    tag: 'Single Session',
    desc: 'Force–velocity, power and time-to-peak captured live across one training session.',
  },
  {
    src: '/apex report 2.jpg',
    label: 'Comparison Report',
    code: 'RPT-02',
    tag: 'Side By Side',
    desc: 'Athlete against athlete, or session against session — measured side by side.',
  },
  {
    src: '/apex report 3.jpg',
    label: 'Trending Report',
    code: 'RPT-03',
    tag: 'Longitudinal',
    desc: 'Longitudinal output tracked week-on-week to evidence real, measurable progress.',
  },
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
              <span className="t-blue">SEE THE RAW DATA EXACTLY AS YOUR COACHES</span> AND SPORTS SCIENTISTS DO.
            </h2>
          </div>

          <div className="flex flex-col gap-10 md:gap-14 max-w-5xl mx-auto">
            {RAW_DATA.map((item, i) => {
              const [first, ...rest] = item.label.split(' ')
              return (
              <motion.div
                key={item.label}
                className="group relative"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ambient blue glow that lifts on hover */}
                <div
                  className="absolute -inset-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 70% 90% at 50% 0%, rgba(0,174,239,0.10), transparent 70%)' }}
                  aria-hidden="true"
                />

                {/* Engineered telemetry panel */}
                <div
                  className="relative bg-apex-panel border border-apex-line transition-colors duration-300 group-hover:border-apex-blue/40"
                  style={{ borderRadius: 0, borderTop: '2px solid #00AEEF' }}
                >
                  {/* ── Header: big readable report title + status ──────────── */}
                  <div className="flex items-end justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-apex-line/60">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-apex-red animate-pulse" />
                        <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-apex-grey-dim">
                          {item.code} <span className="text-apex-blue">// Live</span>
                        </span>
                      </div>
                      <h3
                        className="font-display font-black text-apex-white uppercase leading-none"
                        style={{ fontSize: 'clamp(1.3rem, 3.4vw, 2.1rem)', letterSpacing: '0.005em' }}
                      >
                        {first} <span className="text-apex-blue">{rest.join(' ')}</span>
                      </h3>
                      <p className="hidden sm:block text-apex-grey font-body text-[12.5px] leading-snug mt-2.5 max-w-md">
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className="shrink-0 font-mono text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border border-apex-blue/40 text-apex-blue"
                      style={{ background: 'rgba(0,174,239,0.08)' }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* ── Viewport: framed report image, no edge feathering ──── */}
                  <div className="relative m-3 sm:m-4">
                    <div className="hud-scanlines relative aspect-[2/1] overflow-hidden border border-apex-line/70 bg-apex-black">
                      <Image src={item.src} alt={item.label} fill className="object-cover" />
                      {/* faint top sheen so the panel reads as a lit screen */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, rgba(0,174,239,0.07), transparent 26%)' }}
                        aria-hidden="true"
                      />
                      {/* corner reticles */}
                      {([
                        ['top-2 left-2', 'M0 8 L0 0 L8 0'],
                        ['top-2 right-2', 'M0 0 L8 0 L8 8'],
                        ['bottom-2 left-2', 'M0 0 L0 8 L8 8'],
                        ['bottom-2 right-2', 'M8 0 L8 8 L0 8'],
                      ] as const).map(([pos, d]) => (
                        <svg key={pos} className={`absolute ${pos} pointer-events-none`} width="9" height="9" viewBox="0 0 8 8" aria-hidden="true">
                          <path d={d} fill="none" stroke="#00AEEF" strokeWidth="1.2" opacity="0.7" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* ── Bottom telemetry strip ─────────────────────────────── */}
                  <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-t border-apex-line/60">
                    <span className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-apex-grey-dim">
                      T-APEX <span className="text-apex-grey">// Performance Telemetry</span>
                    </span>
                    <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-apex-grey tabular-nums">
                      {String(i + 1).padStart(2, '0')} / {String(RAW_DATA.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

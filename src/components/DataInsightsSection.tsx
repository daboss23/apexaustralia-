'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'

// Small inline glyphs for the report tabs.
const ICONS: Record<string, React.ReactNode> = {
  session: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h3l2.5 6 4-13 2.5 7H21" />
    </svg>
  ),
  comparison: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="7" height="16" rx="1" />
      <rect x="14" y="4" width="7" height="16" rx="1" />
    </svg>
  ),
  trend: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M21 7v5h-5" />
    </svg>
  ),
}

// Deterministic frequency-bar heights for the click energy burst (no hydration mismatch).
const FREQ_BARS = [0.35, 0.62, 0.48, 0.85, 0.55, 0.95, 0.42, 0.7, 0.6, 0.9, 0.5, 0.78, 0.4, 0.66, 0.58, 0.88, 0.46, 0.72, 0.52, 0.8, 0.44, 0.68]

// Real raw-data report imagery, presented as a tabbed engineered telemetry viewer.
const RAW_DATA = [
  {
    src: '/apex report 1.jpg',
    short: 'Session',
    icon: 'session',
    label: 'Session Report',
    code: 'RPT-01',
    tag: 'Single Session',
    desc: 'Force–velocity, power and time-to-peak captured live across one training session.',
  },
  {
    src: '/apex report 2.jpg',
    short: 'Comparison',
    icon: 'comparison',
    label: 'Comparison Report',
    code: 'RPT-02',
    tag: 'Side By Side',
    desc: 'Athlete against athlete, or session against session — measured side by side.',
  },
  {
    src: '/apex report 3.jpg',
    short: 'Trend',
    icon: 'trend',
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

  // Tabbed report viewer: active report + a pulse counter that retriggers the
  // red/blue energy burst on every click (even re-clicking the same tab).
  const [active, setActive] = useState(0)
  const [pulse, setPulse] = useState(0)
  const report = RAW_DATA[active]
  const [first, ...rest] = report.label.split(' ')
  const selectReport = (i: number) => {
    setActive(i)
    setPulse((p) => p + 1)
  }

  return (
    <section id="data" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-12 lg:gap-20 mb-10 md:mb-16">
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
          className="relative w-screen ml-[calc(50%-50vw)] mt-7 md:mt-12 overflow-hidden"
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

          {/* Top & bottom vignette — melts the clip into the black, like the hero.
              Percentage stops (not a fixed band) so it blends the same on the
              short mobile clip and the tall desktop one; bottom reaches solid
              #050505 before the clip's edge, so no hard video outline shows. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #050505 0%, rgba(5,5,5,0.85) 7%, transparent 22%, transparent 66%, rgba(5,5,5,0.8) 86%, #050505 96%)' }}
          />
        </motion.div>

        {/* Raw data showcase — logo header + sample report imagery */}
        <motion.div
          className="border-t border-apex-line/40 pt-12 mt-10 md:mt-16"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col items-center text-center mb-10">
            <h2
              className="h-luxia t-silver leading-[0.9] max-w-4xl"
              style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
            >
              <span className="t-blue">REAL PERFORMANCE DATA</span> WITHOUT THE GUESSWORK
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* ── Report tabs ──────────────────────────────────────────── */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-7">
              {RAW_DATA.map((item, i) => {
                const isActive = active === i
                return (
                  <motion.button
                    key={item.short}
                    onClick={() => selectReport(i)}
                    className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 border font-display font-bold text-[12px] sm:text-[13px] tracking-[0.06em] cursor-pointer overflow-hidden ${
                      isActive
                        ? 'text-white border-transparent'
                        : 'text-apex-grey border-apex-line hover:text-apex-white hover:border-apex-blue/50'
                    }`}
                    style={{ borderRadius: 0 }}
                    aria-pressed={isActive}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96, y: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {/* Active fill — slides between tabs and carries a red glow */}
                    {isActive && (
                      <motion.span
                        layoutId="report-tab-active"
                        className="absolute inset-0 z-0"
                        style={{
                          background: 'linear-gradient(135deg, #ff3b30 0%, #D61F26 45%, #9c0f0d 100%)',
                          boxShadow: '0 0 0 1px #D61F26, 0 6px 20px -4px rgba(214,31,38,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                        aria-hidden="true"
                      >
                        {/* sweeping shine across the active pill */}
                        <motion.span
                          className="absolute inset-y-0 w-1/2 -skew-x-12"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                          initial={{ x: '-150%' }}
                          animate={{ x: '250%' }}
                          transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.4 }}
                        />
                      </motion.span>
                    )}

                    {/* Idle hover wash — faint blue energy on inactive tabs */}
                    {!isActive && (
                      <span
                        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg, rgba(0,174,239,0.14), transparent 70%)' }}
                        aria-hidden="true"
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        className="flex"
                        animate={isActive ? { rotate: [0, -12, 8, 0], scale: [1, 1.18, 1] } : {}}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        {ICONS[item.icon]}
                      </motion.span>
                      {item.short}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* ── Engineered telemetry viewer ──────────────────────────── */}
            <div
              className="relative bg-apex-panel border border-apex-line"
              style={{ borderRadius: 0, borderTop: '2px solid #00AEEF' }}
            >
              {/* Header: big readable report title + status */}
              <div className="flex items-end justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-apex-line/60">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-apex-red animate-pulse" />
                    <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-apex-grey-dim">
                      {report.code} <span className="text-apex-blue">// Live</span>
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={report.label}
                      className="font-display font-black text-apex-white uppercase leading-none"
                      style={{ fontSize: 'clamp(1.3rem, 3.4vw, 2.1rem)', letterSpacing: '0.005em' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {first} <span className="text-apex-blue">{rest.join(' ')}</span>
                    </motion.h3>
                  </AnimatePresence>
                  <p className="hidden sm:block text-apex-grey font-body text-[12.5px] leading-snug mt-2.5 max-w-md min-h-[2.4em]">
                    {report.desc}
                  </p>
                </div>
                <span
                  className="shrink-0 font-mono text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border border-apex-blue/40 text-apex-blue"
                  style={{ background: 'rgba(0,174,239,0.08)' }}
                >
                  {report.tag}
                </span>
              </div>

              {/* Viewport: the active report image crossfades; the energy burst
                  fires on every tab click. */}
              <div className="relative m-3 sm:m-4">
                <div className="hud-scanlines relative aspect-[2/1] overflow-hidden border border-apex-line/70 bg-apex-black">
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={report.src}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image src={report.src} alt={report.label} fill className="object-cover" />
                    </motion.div>
                  </AnimatePresence>

                  {/* faint top sheen so the panel reads as a lit screen */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(0,174,239,0.07), transparent 26%)' }}
                    aria-hidden="true"
                  />

                  {/* ── Click energy burst: red + blue frequency / energy ──── */}
                  <AnimatePresence>
                    {pulse > 0 && (
                      <motion.div
                        key={pulse}
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        aria-hidden="true"
                      >
                        {/* red sweep from the left */}
                        <motion.div
                          className="absolute inset-y-0 w-1/3"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.35), transparent)', mixBlendMode: 'screen' }}
                          initial={{ x: '-130%' }}
                          animate={{ x: '330%' }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                        {/* blue sweep from the right */}
                        <motion.div
                          className="absolute inset-y-0 w-1/3"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.4), transparent)', mixBlendMode: 'screen' }}
                          initial={{ x: '330%' }}
                          animate={{ x: '-130%' }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                        {/* expanding center pulse ring */}
                        <motion.div
                          className="absolute left-1/2 top-1/2 rounded-full border"
                          style={{ borderColor: 'rgba(0,174,239,0.5)', x: '-50%', y: '-50%' }}
                          initial={{ width: 0, height: 0, opacity: 0.55 }}
                          animate={{ width: '95%', height: '170%', opacity: 0 }}
                          transition={{ duration: 0.75, ease: 'easeOut' }}
                        />
                        {/* frequency bars sweeping across the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-[34%] flex items-end gap-[2px] px-2" style={{ mixBlendMode: 'screen' }}>
                          {FREQ_BARS.map((h, bi) => (
                            <motion.div
                              key={bi}
                              className="flex-1 origin-bottom rounded-t-[1px]"
                              style={{ background: bi % 2 ? '#00AEEF' : '#D61F26' }}
                              initial={{ scaleY: 0.04, opacity: 0 }}
                              animate={{ scaleY: [0.04, h, 0.08], opacity: [0, 0.85, 0] }}
                              transition={{ duration: 0.72, delay: bi * 0.012, ease: 'easeOut' }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* corner reticles */}
                  {([
                    ['top-2 left-2', 'M0 8 L0 0 L8 0'],
                    ['top-2 right-2', 'M0 0 L8 0 L8 8'],
                    ['bottom-2 left-2', 'M0 0 L0 8 L8 8'],
                    ['bottom-2 right-2', 'M8 0 L8 8 L0 8'],
                  ] as const).map(([pos, d]) => (
                    <svg key={pos} className={`absolute ${pos} pointer-events-none z-10`} width="9" height="9" viewBox="0 0 8 8" aria-hidden="true">
                      <path d={d} fill="none" stroke="#00AEEF" strokeWidth="1.2" opacity="0.7" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Bottom telemetry strip */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-t border-apex-line/60">
                <span className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-apex-grey-dim">
                  T-APEX <span className="text-apex-grey">// Performance Telemetry</span>
                </span>
                <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-apex-grey tabular-nums">
                  {String(active + 1).padStart(2, '0')} / {String(RAW_DATA.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

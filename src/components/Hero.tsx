'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// ─── Telemetry HUD Data ───────────────────────────────────────────────────────

const TELEMETRY = [
  {
    id: 'speed',
    label: 'SPEED',
    unit: 'm/s',
    values: [9.42, 9.51, 9.38, 9.64, 9.47, 9.58, 9.42],
    decimals: 2,
    color: '#e0231f',
    delta: '+0.3',
    tag: 'MAX',
    sparkline: [42, 51, 38, 62, 70, 56, 78, 65, 84],
  },
  {
    id: 'force',
    label: 'FORCE',
    unit: 'kN',
    values: [2.81, 2.84, 2.78, 2.91, 2.86, 2.89, 2.81],
    decimals: 2,
    color: '#7B2FBE',
    delta: '+2.4%',
    tag: 'PEAK',
    sparkline: [52, 60, 46, 70, 64, 74, 60, 80, 72],
  },
  {
    id: 'power',
    label: 'POWER',
    unit: 'kW',
    values: [4.21, 4.35, 4.18, 4.42, 4.31, 4.38, 4.21],
    decimals: 2,
    color: '#00A3FF',
    delta: '+12%',
    tag: 'HIGH',
    sparkline: [38, 52, 46, 60, 56, 68, 62, 76, 70],
  },
  {
    id: 'accel',
    label: 'ACCEL',
    unit: 'm/s²',
    values: [8.72, 8.81, 8.65, 8.94, 8.77, 8.88, 8.72],
    decimals: 2,
    color: '#f59e0b',
    delta: '+0.6',
    tag: 'ACTIVE',
    sparkline: [48, 56, 42, 62, 70, 58, 76, 68, 80],
  },
]

const SYSTEM_RESISTANCE = [287, 312, 298, 325, 308, 341, 319]
const SYSTEM_MODES = ['ADAPTIVE', 'ADAPTIVE', 'SPRINT-A', 'ADAPTIVE', 'ADAPTIVE', 'PEAK', 'ADAPTIVE']

const POSITIONS = [
  { className: 'top-[13%] right-[1.5%]', delay: 1.0 },
  { className: 'top-[31%] right-[1.5%]', delay: 1.15 },
  { className: 'top-[49%] right-[1.5%]', delay: 1.3 },
  { className: 'top-[67%] right-[1.5%]', delay: 1.45 },
]

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const W = 82, H = 20
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`
  ).join(' ')
  const id = `sg${color.replace('#', '')}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  )
}

// ─── Corner Reticle ───────────────────────────────────────────────────────────

function Reticle({ corner, color }: { corner: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const s = 8
  const paths: Record<string, string> = {
    tl: `M0 ${s} L0 0 L${s} 0`,
    tr: `M0 0 L${s} 0 L${s} ${s}`,
    bl: `M0 0 L0 ${s} L${s} ${s}`,
    br: `M${s} 0 L${s} ${s} L0 ${s}`,
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
      <path d={paths[corner]} fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" />
    </svg>
  )
}

// ─── Telemetry HUD Card ───────────────────────────────────────────────────────

function TelemetryCard({
  datum, pos, index,
}: {
  datum: typeof TELEMETRY[0]
  pos: typeof POSITIONS[0]
  index: number
}) {
  const [vIdx, setVIdx] = useState(index % datum.values.length)
  const [val, setVal] = useState(datum.values[index % datum.values.length])

  useEffect(() => {
    const iv = setInterval(() => {
      const next = (vIdx + 1) % datum.values.length
      setVIdx(next)
      setVal(datum.values[next])
    }, 2700 + index * 580)
    return () => clearInterval(iv)
  }, [vIdx, datum.values, index])

  const fmt = datum.decimals > 0 ? val.toFixed(datum.decimals) : String(Math.round(val))

  return (
    <motion.div
      className={`absolute ${pos.className} z-20 hidden xl:block`}
      initial={{ opacity: 0, scale: 0.86, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.72, delay: pos.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative"
        style={{
          background: 'rgba(5,5,8,0.94)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeft: `2px solid ${datum.color}`,
          borderTop: `1px solid ${datum.color}40`,
          boxShadow: `0 4px 36px -10px ${datum.color}28, inset 0 0 0 0.5px rgba(255,255,255,0.03)`,
          minWidth: 150,
        }}
      >
        {/* Corner reticles */}
        <div className="absolute top-1.5 right-1.5 pointer-events-none">
          <Reticle corner="tr" color={datum.color} />
        </div>
        <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
          <Reticle corner="bl" color="rgba(255,255,255,0.14)" />
        </div>

        {/* Scan-line texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          opacity: 1,
        }} />

        <div className="px-3.5 py-2.5 pl-4">
          {/* Label */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5"
                style={{ background: datum.color, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
              <span className="text-[8px] font-mono font-bold tracking-[0.24em] uppercase" style={{ color: datum.color }}>
                {datum.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-mono text-emerald-400 tracking-wider">LIVE</span>
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Value */}
          <AnimatePresence mode="wait">
            <motion.div
              key={fmt}
              className="flex items-baseline gap-1.5 mb-1.5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-mono font-bold text-apex-white leading-none metric-value"
                style={{ fontSize: 26, letterSpacing: '-0.02em' }}
              >
                {fmt}
              </span>
              <span className="text-[9px] font-mono text-apex-grey-dim">{datum.unit}</span>
            </motion.div>
          </AnimatePresence>

          <Sparkline data={datum.sparkline} color={datum.color} />

          {/* Delta + tag */}
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <svg width="5" height="4" viewBox="0 0 5 4" aria-hidden="true">
                <polygon points="2.5,0 5,4 0,4" fill="#4ade80" />
              </svg>
              <span className="text-[8px] font-mono text-emerald-400">{datum.delta}</span>
            </div>
            <span className="text-[7px] font-mono tracking-wider" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {datum.tag}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Machine / System Card ────────────────────────────────────────────────────

function SystemCard() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % SYSTEM_RESISTANCE.length), 3100)
    return () => clearInterval(iv)
  }, [])

  const resistance = SYSTEM_RESISTANCE[idx]
  const mode = SYSTEM_MODES[idx]

  return (
    <motion.div
      className="absolute bottom-[12%] right-[1.5%] z-20 hidden xl:block"
      initial={{ opacity: 0, scale: 0.86, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.72, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative"
        style={{
          background: 'rgba(5,5,8,0.94)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeft: '2px solid rgba(0,163,255,0.85)',
          borderTop: '1px solid rgba(0,163,255,0.22)',
          boxShadow: '0 4px 36px -10px rgba(0,163,255,0.2), inset 0 0 0 0.5px rgba(255,255,255,0.03)',
          minWidth: 196,
        }}
      >
        <div className="absolute top-1.5 right-1.5 pointer-events-none">
          <Reticle corner="tr" color="#00A3FF" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
          <Reticle corner="bl" color="rgba(255,255,255,0.14)" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
        }} />

        <div className="px-3.5 py-2.5 pl-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5" style={{ background: '#00A3FF', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              <span className="text-[8px] font-mono font-bold tracking-[0.24em] uppercase text-[#00A3FF]">T-APEX UNIT</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-mono text-emerald-400 tracking-wider">ENGAGED</span>
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
            <div>
              <div className="text-[7px] font-mono text-apex-grey-dim tracking-wider uppercase mb-0.5">Resistance</div>
              <AnimatePresence mode="wait">
                <motion.div key={resistance}
                  className="flex items-baseline gap-0.5"
                  initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}>
                  <span className="font-mono font-bold text-apex-white leading-none metric-value" style={{ fontSize: 22 }}>{resistance}</span>
                  <span className="text-[8px] font-mono text-apex-grey-dim">N</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <div className="text-[7px] font-mono text-apex-grey-dim tracking-wider uppercase mb-0.5">Frequency</div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-mono font-bold text-apex-white leading-none metric-value" style={{ fontSize: 22 }}>200</span>
                <span className="text-[8px] font-mono text-apex-grey-dim">Hz</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[7px] font-mono text-apex-grey-dim tracking-wider uppercase mb-0.5">Mode</div>
              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#00A3FF]">{mode}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Resistance bar */}
          <div className="mt-2.5">
            <div className="h-[2px] bg-apex-line rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00A3FF, #7B2FBE)' }}
                animate={{ width: `${(resistance / 450) * 100}%` }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[6px] font-mono text-apex-grey-dim">0N</span>
              <span className="text-[6px] font-mono text-apex-grey-dim">450N</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Animated Headline ────────────────────────────────────────────────────────

function Headline() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  }
  const word = {
    hidden: { opacity: 0, y: 80, skewY: 4 },
    show: {
      opacity: 1, y: 0, skewY: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.div
      className="font-display font-bold leading-[0.88] overflow-hidden"
      style={{ fontSize: 'clamp(3.6rem, 9.5vw, 9rem)', letterSpacing: '0.01em' }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="overflow-hidden">
        <motion.span variants={word} className="inline-block text-apex-white">TRAIN&nbsp;</motion.span>
        <motion.span variants={word} className="inline-block text-apex-white">BEYOND</motion.span>
      </div>
      <div className="overflow-hidden">
        <motion.span variants={word} className="inline-block text-apex-red">HUMAN&nbsp;</motion.span>
        <motion.span
          variants={word}
          className="inline-block"
          style={{ color: 'transparent', WebkitTextStroke: '2px #e0231f' }}
        >
          LIMITS
        </motion.span>
      </div>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 700], [0, -55])
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0])
  const videoScale = useTransform(scrollY, [0, 600], [1, 1.06])

  // Slow the video to 65% — cinematic, not rushed
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.playbackRate = 0.65
    const onCanPlay = () => { vid.playbackRate = 0.65 }
    vid.addEventListener('canplay', onCanPlay)
    return () => vid.removeEventListener('canplay', onCanPlay)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* LAYER 1 — Full-bleed video background */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ scale: videoScale, transformOrigin: 'center center', willChange: 'transform' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{ objectPosition: '55% center' }}
          />
        </motion.div>

        {/* Left column: heavy dark ramp — text lives here, fully readable */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.97) 12%, rgba(10,10,12,0.88) 24%, rgba(10,10,12,0.6) 38%, rgba(10,10,12,0.28) 52%, rgba(10,10,12,0.1) 65%, rgba(10,10,12,0.04) 78%, transparent 92%)'
        }} />

        {/* Top vignette — keeps nav area grounded */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(10,10,12,0.72) 0%, transparent 18%, transparent 68%, rgba(10,10,12,0.9) 90%, #0a0a0c 100%)'
        }} />

        {/* Right edge soft vignette — frames video, doesn't crush it */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(270deg, rgba(10,10,12,0.22) 0%, transparent 20%)'
        }} />
      </div>

      {/* Top performance line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #e0231f 18%, #e0231f 82%, transparent 100%)' }}
      />

      {/* Corner HUD brackets */}
      <div className="absolute top-16 left-0 z-10 pointer-events-none opacity-22">
        <svg viewBox="0 0 72 72" width={72} height={72} fill="none">
          <path d="M0 72V0h72" stroke="#e0231f" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-16 right-0 z-10 pointer-events-none opacity-22">
        <svg viewBox="0 0 72 72" width={72} height={72} fill="none">
          <path d="M72 72V0H0" stroke="#e0231f" strokeWidth="1" />
        </svg>
      </div>

      {/* LAYER 2 — Telemetry HUD cards (float over right-side video) */}
      {TELEMETRY.map((d, i) => (
        <TelemetryCard key={d.id} datum={d} pos={POSITIONS[i]} index={i} />
      ))}
      <SystemCard />

      {/* LAYER 3 — Headline + CTAs — anchored LEFT so video action is visible right */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 pt-28 md:pt-32 pb-24"
        style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }}
      >
        {/* Content column — constrained to left ~48% on desktop so video shows right */}
        <div className="w-full lg:max-w-[580px] xl:max-w-[620px]">

          {/* Pre-label — large logo on top, eyebrow below */}
          <motion.div
            className="flex flex-col items-start gap-5 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="T-APEX Australia"
              className="h-24 md:h-28 w-auto object-contain"
              style={{ filter: 'brightness(1.1)' }}
            />
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-apex-red" />
              <span className="text-apex-red font-mono text-[9px] font-medium tracking-[0.32em] uppercase">
                Elite Sports Performance Technology
              </span>
            </div>
          </motion.div>

          <Headline />

          {/* Subheadline */}
          <motion.p
            className="mt-7 text-apex-grey font-body leading-[1.75] max-w-[560px]"
            style={{ fontSize: 'clamp(0.92rem, 1.25vw, 1.08rem)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.05 }}
          >
            Built for serious coaches, athletes, and high-performance environments that demand more speed, more force, more control, and greater transfer than conventional resistance tools were ever designed to deliver.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mt-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.22 }}
          >
            <button className="group inline-flex items-center gap-2.5 bg-apex-red hover:bg-apex-red-bright text-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(224,35,31,0.6)] hover:-translate-y-0.5 active:translate-y-0" style={{ borderRadius: 0 }}>
              Book a Demo
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button className="group inline-flex items-center gap-2.5 bg-transparent border border-apex-line hover:border-apex-grey-dim text-apex-grey hover:text-apex-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style={{ borderRadius: 0 }}>
              See T-Apex In Action
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </motion.div>

        </div>{/* end left column */}

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-6 lg:left-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          aria-hidden="true"
        >
          <motion.div
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, #e0231f, transparent)' }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-apex-grey-dim font-mono text-[8px] tracking-[0.35em] uppercase"
            style={{ writingMode: 'vertical-lr' }}
          >
            Scroll
          </span>
        </motion.div>

      </motion.div>
    </section>
  )
}

'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// ─── Telemetry HUD Data ───────────────────────────────────────────────────────

const TELEMETRY = [
  {
    id: 'velocity',
    label: 'VELOCITY',
    unit: 'm/s',
    values: [11.8, 12.1, 12.4, 11.9, 12.7, 12.2, 12.6],
    decimals: 1,
    color: '#e0231f',
    delta: '+0.3 m/s',
    sparkline: [42, 51, 38, 62, 70, 56, 78, 65, 84],
  },
  {
    id: 'force',
    label: 'FORCE',
    unit: 'N',
    values: [823, 847, 891, 834, 876, 855, 902],
    decimals: 0,
    color: '#00A3FF',
    delta: '+2.4%',
    sparkline: [52, 60, 46, 70, 64, 74, 60, 80, 72],
  },
  {
    id: 'power',
    label: 'POWER',
    unit: 'kW',
    values: [3.8, 4.1, 4.2, 3.9, 4.6, 4.3, 4.7],
    decimals: 1,
    color: '#e0231f',
    delta: '+12%',
    sparkline: [38, 52, 46, 60, 56, 68, 62, 76, 70],
  },
  {
    id: 'accel',
    label: 'ACCEL',
    unit: 'm/s²',
    values: [7.8, 8.1, 8.3, 7.9, 8.7, 8.4, 8.6],
    decimals: 1,
    color: '#00A3FF',
    delta: '+0.6',
    sparkline: [48, 56, 42, 62, 70, 58, 76, 68, 80],
  },
  {
    id: 'resistance',
    label: 'RESIST',
    unit: '%',
    values: [55, 62, 68, 60, 72, 65, 75],
    decimals: 0,
    color: '#e0231f',
    delta: 'ENGAGED',
    sparkline: [58, 62, 54, 70, 66, 74, 60, 76, 68],
  },
]

const POSITIONS = [
  { className: 'top-[21%] left-[1.5%]', delay: 1.1 },
  { className: 'top-[54%] left-[1.5%]', delay: 1.35 },
  { className: 'top-[19%] right-[1.5%]', delay: 1.2 },
  { className: 'top-[51%] right-[1.5%]', delay: 1.45 },
  { className: 'bottom-[13%] right-[27%]', delay: 1.55 },
]

// ─── Canvas Speed Lines Background ───────────────────────────────────────────

function SpeedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)

    interface Streak {
      x: number; y: number; len: number; speed: number
      alpha: number; w: number; isRed: boolean
    }

    const streaks: Streak[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * W * 1.5,
      y: Math.random() * H,
      len: 20 + Math.random() * 160,
      speed: 1.0 + Math.random() * 5,
      alpha: 0.015 + Math.random() * 0.05,
      w: 0.3 + Math.random() * 0.9,
      isRed: Math.random() > 0.9,
    }))

    const render = () => {
      ctx.fillStyle = '#0a0a0c'
      ctx.fillRect(0, 0, W, H)

      // Subtle grid
      ctx.strokeStyle = 'rgba(38,38,46,0.4)'
      ctx.lineWidth = 0.4
      const cols = 22, rows = 13
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo((c / cols) * W, 0); ctx.lineTo((c / cols) * W, H); ctx.stroke()
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, (r / rows) * H); ctx.lineTo(W, (r / rows) * H); ctx.stroke()
      }

      // Speed streaks
      for (const s of streaks) {
        const rgb = s.isRed ? '224,35,31' : '244,244,246'
        const g = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y)
        g.addColorStop(0, `rgba(${rgb},0)`)
        g.addColorStop(1, `rgba(${rgb},${s.alpha})`)
        ctx.beginPath()
        ctx.strokeStyle = g
        ctx.lineWidth = s.w
        ctx.moveTo(s.x - s.len, s.y)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        s.x += s.speed
        if (s.x - s.len > W) {
          s.x = -s.len
          s.y = Math.random() * H
          s.len = 30 + Math.random() * 240
          s.speed = 1.2 + Math.random() * 7.5
          s.alpha = 0.025 + Math.random() * 0.095
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    render()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const W = 80, H = 22
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 3) - 1.5}`
  ).join(' ')
  const id = `sg${color.replace('#', '')}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
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
    }, 2600 + index * 650)
    return () => clearInterval(iv)
  }, [vIdx, datum.values, index])

  const fmt = datum.decimals > 0 ? val.toFixed(datum.decimals) : String(Math.round(val))

  return (
    <motion.div
      className={`absolute ${pos.className} z-20 hidden xl:block`}
      initial={{ opacity: 0, scale: 0.82, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, delay: pos.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          background: 'rgba(10,10,12,0.84)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          minWidth: 148,
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: datum.color }} />

        <div className="px-3 py-2.5 pl-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[9px] font-mono font-semibold tracking-[0.2em] uppercase"
              style={{ color: datum.color }}
            >
              {datum.label}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-mono text-emerald-400 tracking-wider">LIVE</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={fmt}
              className="flex items-baseline gap-1.5 mb-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22 }}
            >
              <span className="text-[27px] font-mono font-semibold text-white leading-none metric-value">
                {fmt}
              </span>
              <span className="text-[10px] font-mono text-apex-grey mb-0.5">{datum.unit}</span>
            </motion.div>
          </AnimatePresence>

          <Sparkline data={datum.sparkline} color={datum.color} />

          <div className="flex items-center gap-1 mt-1.5">
            {datum.id !== 'resistance' && (
              <svg width="7" height="5" viewBox="0 0 7 5" aria-hidden="true">
                <path d="M3.5 0L7 5H0L3.5 0Z" fill="#4ade80" />
              </svg>
            )}
            <span className="text-[9px] font-mono text-emerald-400">{datum.delta}</span>
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
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
  }
  const word = {
    hidden: { opacity: 0, y: 90, skewY: 5 },
    show: {
      opacity: 1, y: 0, skewY: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.div
      className="font-display font-black leading-[0.86] tracking-[-0.01em] overflow-hidden"
      style={{ fontSize: 'clamp(3.8rem, 9.8vw, 9.5rem)' }}
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
          className="inline-block text-apex-red"
          style={{
            WebkitTextStroke: '2px #e0231f',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LIMITS
        </motion.span>
      </div>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 700], [0, -60])
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated speed-lines canvas */}
      <SpeedBackground />

      {/* Hero athlete image – prominent */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <Image
          src="/hero.png"
          alt="T-APEX athlete Ross sprinting with performance technology"
          fill
          priority
          className="object-cover object-right-top"
          style={{ opacity: 0.72 }}
        />
        {/* Dark left overlay — keeps text readable, athlete visible on right */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.88) 28%, rgba(10,10,12,0.55) 48%, rgba(10,10,12,0.15) 68%, transparent 100%)' }} />
        {/* Top + bottom fades */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,12,0.6) 0%, transparent 18%, transparent 72%, #0a0a0c 100%)' }} />
      </div>

      {/* Top red accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #e0231f 25%, #e0231f 75%, transparent 100%)' }}
      />

      {/* Corner accents */}
      <div className="absolute top-16 left-0 w-24 h-24 z-10 pointer-events-none opacity-30">
        <svg viewBox="0 0 96 96" fill="none">
          <path d="M0 96V0h96" stroke="#e0231f" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute top-16 right-0 w-24 h-24 z-10 pointer-events-none opacity-30">
        <svg viewBox="0 0 96 96" fill="none">
          <path d="M96 96V0H0" stroke="#e0231f" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Telemetry HUD Cards */}
      {TELEMETRY.map((d, i) => (
        <TelemetryCard key={d.id} datum={d} pos={POSITIONS[i]} index={i} />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 pt-28 md:pt-32 pb-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Pre-label */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="w-10 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] font-medium tracking-[0.3em] uppercase">
            Elite Sports Performance Technology
          </span>
        </motion.div>

        {/* Headline */}
        <Headline />

        {/* Subheadline */}
        <motion.p
          className="mt-8 max-w-[520px] text-apex-grey font-body leading-[1.7]"
          style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
        >
          Real-time intelligent resistance technology engineered to unlock elite athletic performance.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mt-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <button className="group inline-flex items-center gap-2.5 bg-apex-red hover:bg-apex-red-bright text-white font-display font-bold text-[12px] px-8 py-4 rounded-xl tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_12px_40px_-8px_rgba(224,35,31,0.65)] hover:-translate-y-0.5 active:translate-y-0">
            Book Demo
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button className="group inline-flex items-center gap-2.5 bg-transparent border border-apex-line hover:border-[#9a9aa6] text-apex-grey hover:text-apex-white font-display font-bold text-[12px] px-8 py-4 rounded-xl tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
            Explore Technology
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </motion.div>

        {/* Performance badge row */}
        <motion.div
          className="flex items-center gap-6 mt-16 pt-8 border-t border-apex-line/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          {[
            { v: '200Hz', l: 'Telemetry' },
            { v: '<5ms', l: 'Response Time' },
            { v: '0–450N', l: 'Resistance Range' },
            { v: 'Real-time', l: 'AI Adaptation' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col gap-0.5">
              <span className="text-apex-white font-mono font-semibold text-sm">{v}</span>
              <span className="text-apex-grey-dim font-body text-[11px] tracking-wide">{l}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-6 lg:left-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          aria-hidden="true"
        >
          <motion.div
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, #e0231f, transparent)' }}
            animate={{ scaleY: [1, 0.35, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-apex-grey-dim font-mono text-[9px] tracking-[0.3em] uppercase"
            style={{ writingMode: 'vertical-lr' }}
          >
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

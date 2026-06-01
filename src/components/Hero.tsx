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
    delta: '+0.3',
    tag: 'NOMINAL',
    sparkline: [42, 51, 38, 62, 70, 56, 78, 65, 84],
  },
  {
    id: 'force',
    label: 'GRF',
    unit: 'N',
    values: [823, 847, 891, 834, 876, 855, 902],
    decimals: 0,
    color: '#7B2FBE',
    delta: '+2.4%',
    tag: 'PEAK',
    sparkline: [52, 60, 46, 70, 64, 74, 60, 80, 72],
  },
  {
    id: 'power',
    label: 'POWER',
    unit: 'kW',
    values: [3.8, 4.1, 4.2, 3.9, 4.6, 4.3, 4.7],
    decimals: 1,
    color: '#00A3FF',
    delta: '+12%',
    tag: 'HIGH',
    sparkline: [38, 52, 46, 60, 56, 68, 62, 76, 70],
  },
  {
    id: 'accel',
    label: 'ACCEL',
    unit: 'm/s²',
    values: [7.8, 8.1, 8.3, 7.9, 8.7, 8.4, 8.6],
    decimals: 1,
    color: '#e0231f',
    delta: '+0.6',
    tag: 'ACTIVE',
    sparkline: [48, 56, 42, 62, 70, 58, 76, 68, 80],
  },
]

const SYSTEM_RESISTANCE = [287, 312, 298, 325, 308, 341, 319]
const SYSTEM_MODES = ['ADAPTIVE', 'ADAPTIVE', 'SPRINT-A', 'ADAPTIVE', 'ADAPTIVE', 'PEAK', 'ADAPTIVE']

const POSITIONS = [
  { className: 'top-[20%] left-[1.5%]', delay: 1.05 },
  { className: 'top-[55%] left-[1.5%]', delay: 1.3 },
  { className: 'top-[18%] right-[1.5%]', delay: 1.15 },
  { className: 'top-[52%] right-[1.5%]', delay: 1.4 },
]

// ─── Atmosphere Canvas ────────────────────────────────────────────────────────

function AtmosphereBackground() {
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
      init()
    }
    window.addEventListener('resize', onResize)

    interface Streak {
      x: number; y: number; len: number; speed: number
      alpha: number; w: number; isRed: boolean
    }
    interface Particle {
      x: number; y: number; vx: number; vy: number
      alpha: number; life: number; maxLife: number; r: number; isRed: boolean
    }

    let streaks: Streak[] = []
    let particles: Particle[] = []

    function init() {
      streaks = Array.from({ length: 28 }, () => ({
        x: Math.random() * W * 1.4,
        y: Math.random() * H * 0.88,
        len: 30 + Math.random() * 200,
        speed: 0.9 + Math.random() * 4.5,
        alpha: 0.007 + Math.random() * 0.028,
        w: 0.2 + Math.random() * 0.8,
        isRed: Math.random() > 0.87,
      }))
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0.3 + Math.random() * 1.8,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: 0.03 + Math.random() * 0.1,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 130,
        r: 0.4 + Math.random() * 1.2,
        isRed: Math.random() > 0.82,
      }))
    }

    init()

    function drawGrid(c: CanvasRenderingContext2D) {
      c.strokeStyle = 'rgba(38,38,46,0.28)'
      c.lineWidth = 0.3
      const cols = 24, rows = 14
      for (let col = 0; col <= cols; col++) {
        c.beginPath(); c.moveTo((col / cols) * W, 0); c.lineTo((col / cols) * W, H); c.stroke()
      }
      for (let row = 0; row <= rows; row++) {
        c.beginPath(); c.moveTo(0, (row / rows) * H); c.lineTo(W, (row / rows) * H); c.stroke()
      }
    }

    function drawStadiumAtmosphere(c: CanvasRenderingContext2D) {
      const lights: [number, number][] = [[W * 0.14, 0.036], [W * 0.87, 0.028]]
      for (const [lx, a] of lights) {
        const g = c.createRadialGradient(lx, -H * 0.05, 0, lx, H * 0.5, H * 0.65)
        g.addColorStop(0, `rgba(255,215,130,${a})`)
        g.addColorStop(0.4, `rgba(255,210,120,${a * 0.4})`)
        g.addColorStop(1, 'rgba(255,200,100,0)')
        c.fillStyle = g
        c.fillRect(0, 0, W, H)
      }
      const rg = c.createRadialGradient(W * 0.72, H * 0.42, 0, W * 0.72, H * 0.42, W * 0.5)
      rg.addColorStop(0, 'rgba(224,35,31,0.055)')
      rg.addColorStop(0.5, 'rgba(224,35,31,0.02)')
      rg.addColorStop(1, 'rgba(224,35,31,0)')
      c.fillStyle = rg
      c.fillRect(0, 0, W, H)
    }

    function drawTrack(c: CanvasRenderingContext2D) {
      const trackTop = H * 0.75
      const tw = W * 0.88
      const lTop = (W - tw * 0.48) / 2
      const rTop = (W + tw * 0.48) / 2
      const lBot = (W - tw) / 2
      const rBot = (W + tw) / 2

      const tg = c.createLinearGradient(0, trackTop, 0, H)
      tg.addColorStop(0, 'rgba(55,6,5,0.12)')
      tg.addColorStop(1, 'rgba(80,10,7,0.2)')
      c.fillStyle = tg
      c.beginPath()
      c.moveTo(lTop, trackTop); c.lineTo(rTop, trackTop)
      c.lineTo(rBot, H); c.lineTo(lBot, H)
      c.closePath()
      c.fill()

      c.setLineDash([])
      for (let i = 0; i <= 8; i++) {
        const t = i / 8
        const tx = lTop + (rTop - lTop) * t
        const bx = lBot + (rBot - lBot) * t
        c.beginPath(); c.moveTo(tx, trackTop); c.lineTo(bx, H)
        const edge = i === 0 || i === 8
        c.strokeStyle = edge ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'
        c.lineWidth = edge ? 1 : 0.5
        c.stroke()
      }

      c.setLineDash([3, 9])
      for (let d = 0; d < 3; d++) {
        const t = 0.25 + d * 0.27
        const y = trackTop + (H - trackTop) * t
        const lx = lTop + (lBot - lTop) * t
        const rx = rTop + (rBot - rTop) * t
        c.beginPath(); c.moveTo(lx, y); c.lineTo(rx, y)
        c.strokeStyle = 'rgba(255,255,255,0.025)'
        c.lineWidth = 0.4
        c.stroke()
      }
      c.setLineDash([])
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0a0a0c'
      ctx.fillRect(0, 0, W, H)

      drawGrid(ctx)
      drawStadiumAtmosphere(ctx)
      drawTrack(ctx)

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
          s.y = Math.random() * H * 0.82
          s.len = 35 + Math.random() * 210
          s.speed = 1 + Math.random() * 5.5
          s.alpha = 0.007 + Math.random() * 0.025
        }
      }

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life++
        if (p.x > W || p.y < 0 || p.y > H || p.life > p.maxLife) {
          p.x = 0; p.y = Math.random() * H * 0.9
          p.vx = 0.3 + Math.random() * 1.8
          p.vy = (Math.random() - 0.5) * 0.35
          p.life = 0; p.maxLife = 80 + Math.random() * 130
          p.isRed = Math.random() > 0.82
        }
        const la = Math.sin((p.life / p.maxLife) * Math.PI) * p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.isRed ? `rgba(224,35,31,${la})` : `rgba(244,244,246,${la * 0.55})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    render()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

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
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 700], [0, -55])
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0])
  const athleteScale = useTransform(scrollY, [0, 600], [1, 1.045])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* LAYER 1 — Deep background: atmosphere canvas */}
      <AtmosphereBackground />

      {/* LAYER 2 — Background: Athlete */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <motion.div className="absolute inset-0" style={{ scale: athleteScale, transformOrigin: 'center center' }}>
          <Image
            src="/hero.png"
            alt="T-APEX athlete Ross sprinting with performance technology"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: '68% center', opacity: 0.88 }}
          />
        </motion.div>

        {/* Gradient: hard fade left for readability, open right to show athlete */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.92) 20%, rgba(10,10,12,0.65) 40%, rgba(10,10,12,0.22) 62%, rgba(10,10,12,0.05) 78%, transparent 100%)'
        }} />
        {/* Top and bottom atmosphere */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(10,10,12,0.65) 0%, transparent 14%, transparent 68%, rgba(10,10,12,0.9) 88%, #0a0a0c 100%)'
        }} />
        {/* Right edge blend */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(270deg, rgba(10,10,12,0.32) 0%, transparent 20%)'
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

      {/* LAYER 3 — Foreground: Telemetry HUD cards */}
      {TELEMETRY.map((d, i) => (
        <TelemetryCard key={d.id} datum={d} pos={POSITIONS[i]} index={i} />
      ))}
      <SystemCard />

      {/* LAYER 4 — Midground: Headline + CTAs */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 pt-28 md:pt-32 pb-24"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Pre-label */}
        <motion.div
          className="flex items-center gap-3 mb-7"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[9px] font-medium tracking-[0.32em] uppercase">
            Elite Sports Performance Technology
          </span>
        </motion.div>

        <Headline />

        {/* Subheadline — technology-forward tone */}
        <motion.p
          className="mt-7 max-w-[480px] text-apex-grey font-body leading-[1.75]"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1.02rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.05 }}
        >
          Intelligent resistance technology that reads athlete intent in under 5ms — engineered for the world&apos;s most demanding performance environments.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mt-9"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.28 }}
        >
          <button className="group inline-flex items-center gap-2.5 bg-apex-red hover:bg-apex-red-bright text-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(224,35,31,0.6)] hover:-translate-y-0.5 active:translate-y-0">
            Book Demo
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button className="group inline-flex items-center gap-2.5 bg-transparent border border-apex-line hover:border-apex-grey-dim text-apex-grey hover:text-apex-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
            Explore Technology
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </motion.div>

        {/* Technical specs row */}
        <motion.div
          className="flex flex-wrap items-center gap-5 mt-14 pt-7 border-t border-apex-line/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.65 }}
        >
          {[
            { v: '200', u: 'Hz', l: 'Telemetry Rate' },
            { v: '<5', u: 'ms', l: 'Response Time' },
            { v: '450', u: 'N', l: 'Peak Resistance' },
            { v: 'Real-time', u: '', l: 'AI Adaptation' },
          ].map(({ v, u, l }) => (
            <div key={l} className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-0.5">
                <span className="text-apex-white font-mono font-semibold text-sm leading-none">{v}</span>
                {u && <span className="text-apex-red font-mono text-[10px]">{u}</span>}
              </div>
              <span className="text-apex-grey-dim font-body text-[10px] tracking-wide">{l}</span>
            </div>
          ))}
        </motion.div>

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

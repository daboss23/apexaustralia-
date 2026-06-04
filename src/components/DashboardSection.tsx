'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Live chart data generator ────────────────────────────────────────────────

function genData(base: number, spread: number, points: number): number[] {
  const data: number[] = []
  let v = base
  for (let i = 0; i < points; i++) {
    v = base + (Math.sin(i * 0.4) * spread * 0.6) + ((Math.random() - 0.5) * spread * 0.5)
    data.push(Math.max(0, v))
  }
  return data
}

const CHART_POINTS = 32

const GAUGES = [
  { id: 'speed', label: 'SPEED', unit: 'm/s', value: 12.4, max: 16, color: '#00AEEF', pct: 77 },
  { id: 'power', label: 'POWER', unit: 'kW', value: 4.2, max: 6, color: '#D61F26', pct: 70 },
  { id: 'force', label: 'FORCE', unit: 'N', value: 847, max: 1200, color: '#D61F26', pct: 71 },
  { id: 'accel', label: 'ACCEL', unit: 'm/s²', value: 8.3, max: 12, color: '#00AEEF', pct: 69 },
]

const LIVE_METRICS = [
  { id: 'distance', label: 'DISTANCE', value: 283, unit: 'm', delta: '+12m', color: '#b0b6c1'},
  { id: 'output', label: 'OUTPUT', value: 847, unit: 'W', delta: '+8%', color: '#b0b6c1'},
]

// ─── Circular Gauge ───────────────────────────────────────────────────────────

function CircularGauge({
  label, unit, value, max, color, pct, animate: shouldAnim,
}: {
  label: string; unit: string; value: number; max: number; color: string; pct: number; animate: boolean
}) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)
  const gap = circ - dash

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(38,38,46,0.8)" strokeWidth="6" />
          {/* Progress */}
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={shouldAnim ? { strokeDashoffset: circ - dash } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-semibold text-white leading-none metric-value"
            style={{ fontSize: value > 100 ? '0.9rem' : '1.1rem' }}>
            {value > 100 ? Math.round(value) : value.toFixed(1)}
          </span>
          <span className="font-mono text-apex-grey-dim" style={{ fontSize: '0.55rem' }}>{unit}</span>
        </div>
      </div>
      <span className="text-[9px] font-mono font-semibold tracking-[0.2em] uppercase" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

// ─── Live Line Chart ──────────────────────────────────────────────────────────

function LiveChart({ color, label, inView: active }: { color: string; label: string; inView: boolean }) {
  const [data, setData] = useState(() => genData(65, 25, CHART_POINTS))
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.max(10, Math.min(95,
          prev[prev.length - 1] + (Math.random() - 0.48) * 12
        ))]
        return next
      })
    }, 400)
    return () => clearInterval(iv)
  }, [active])

  const W = 320, H = 80
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - (v / 100) * H
    return `${x},${y}`
  })
  const d = `M ${points.join(' L ')}`
  const area = `M 0,${H} L ${points.join(' L ')} L ${W},${H} Z`

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color }}>{label}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-400">RECORDING</span>
        </div>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`area-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#area-${label})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${color}60)` }} />
        {/* Current value dot */}
        <circle
          cx={(CHART_POINTS - 1) / (CHART_POINTS - 1) * W}
          cy={H - (data[data.length - 1] / 100) * H}
          r="3" fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  )
}

// ─── Live Metric Row ──────────────────────────────────────────────────────────

function LiveMetricCard({ metric, active }: { metric: typeof LIVE_METRICS[0]; active: boolean }) {
  const [val, setVal] = useState(metric.value)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setVal(v => Math.max(0, v + (Math.random() - 0.46) * (metric.value * 0.04)))
    }, 1800)
    return () => clearInterval(iv)
  }, [active, metric.value])

  return (
    <div className="flex-1 flex flex-col gap-1 bg-apex-panel border border-apex-line rounded-xl p-4">
      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-apex-grey-dim">{metric.label}</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={Math.round(val)}
          className="flex items-baseline gap-1"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-3xl font-mono font-semibold text-apex-white metric-value">
            {metric.unit === 'm' ? Math.round(val) : Math.round(val)}
          </span>
          <span className="text-sm font-mono text-apex-grey">{metric.unit}</span>
        </motion.div>
      </AnimatePresence>
      <span className="text-[10px] font-mono text-emerald-400">{metric.delta}</span>
    </div>
  )
}

// ─── Dashboard Section ────────────────────────────────────────────────────────

export default function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section ref={sectionRef} id="dashboard" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(38,38,46,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(38,38,46,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            05b — Live Performance Dashboard
          </span>
        </div>

        <motion.h2
          className="h-luxia t-silver leading-[0.88] mb-4"
          style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.6rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          RACE-GRADE<br /><span className="t-blue">TELEMETRY</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body mb-12 max-w-xl leading-relaxed"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Real-time biomechanical data at 200Hz. Every force, every rep, every sprint — quantified and displayed with Formula 1 precision.
        </motion.p>

        {/* Main dashboard panel */}
        <motion.div
          className="bg-apex-panel border border-apex-line overflow-hidden"
          style={{ borderRadius: 0, borderTop: '2px solid #00AEEF' }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Dashboard header bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-apex-line bg-apex-black/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-apex-blue" />
                <span className="text-[10px] font-mono text-apex-grey tracking-[0.22em] uppercase">
                  T-APEX Performance Monitor
                </span>
              </div>
              <span className="text-[8px] font-mono text-apex-grey-dim border border-apex-line/60 px-1.5 py-0.5 tracking-wider">
                v2.4
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400 tracking-wider">LIVE SESSION</span>
              </div>
              <span className="text-[9px] font-mono text-apex-grey-dim border border-apex-line px-2 py-0.5 tracking-wider">
                ATHLETE_01
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Gauges */}
            <div className="flex flex-col gap-6">
              <div className="text-[9px] font-mono tracking-[0.2em] text-apex-grey-dim uppercase mb-2">
                Peak Metrics
              </div>
              <div className="grid grid-cols-2 gap-6">
                {GAUGES.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  >
                    <CircularGauge {...g} animate={inView} />
                  </motion.div>
                ))}
              </div>

              {/* Secondary metrics */}
              <div className="flex gap-3">
                {LIVE_METRICS.map(m => (
                  <LiveMetricCard key={m.id} metric={m} active={inView} />
                ))}
              </div>
            </div>

            {/* Right column: Charts */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="text-[9px] font-mono tracking-[0.2em] text-apex-grey-dim uppercase">
                Session Telemetry — Last 30s
              </div>

              {/* Speed chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart color="#00AEEF" label="Velocity (m/s)" inView={inView} />
              </div>

              {/* Power chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart color="#D61F26" label="Power Output (kW)" inView={inView} />
              </div>

              {/* Force chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart color="#D61F26" label="Force Production (N)" inView={inView} />
              </div>

              {/* Bottom status row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Session Time', value: '00:24:18' },
                  { label: 'Resistance Mode', value: 'ADAPTIVE' },
                  { label: 'AI Profile', value: 'SPRINT-A' },
                  { label: 'Data Points', value: '291,640' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-apex-black/60 rounded-lg p-3 border border-apex-line/40">
                    <div className="text-[8px] font-mono text-apex-grey-dim uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-[11px] font-mono font-semibold text-apex-white metric-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

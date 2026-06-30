'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Shared rep cycle ─────────────────────────────────────────────────────────
// Every instrument on the dashboard samples the SAME 8-second rep clock —
// SET → DRIVE → PEAK → DECEL → RECOVERY — so gauges, charts, distance and
// the rep counter all move in concert like a real session, not random noise.

const CYCLE_MS = 8000
const TICK_MS = 250
const CHART_POINTS = 32 // 32 × 250ms = one full rep visible per chart window

const smooth = (t: number) => t * t * (3 - 2 * t)
const clampPct = (v: number) => Math.max(2, Math.min(98, v))
const noise = (n: number) => (Math.random() - 0.5) * n

/** Smooth one-rep pulse: floor → peak (at peakAt) → floor, zero outside. */
function pulse(phase: number, start: number, peakAt: number, end: number, floor: number, peak: number) {
  if (phase < start || phase > end) return floor
  if (phase < peakAt) return floor + (peak - floor) * smooth((phase - start) / (peakAt - start))
  return floor + (peak - floor) * smooth(1 - (phase - peakAt) / (end - peakAt))
}

// Each metric peaks at a different point in the rep, like real sprint biomechanics:
// force first (ground contact), then power, then velocity carries longest.
const velocityAt = (p: number) => pulse(p, 0.08, 0.5, 0.82, 12, 88)
const forceAt = (p: number) => pulse(p, 0.06, 0.22, 0.7, 15, 92)
const powerAt = (p: number) => pulse(p, 0.08, 0.36, 0.78, 14, 90)
const accelAt = (p: number) => pulse(p, 0.06, 0.18, 0.62, 10, 85)

const PHASES: { until: number; name: string; color: string }[] = [
  { until: 0.08, name: 'SET', color: '#757b85' },
  { until: 0.42, name: 'DRIVE', color: '#00AEEF' },
  { until: 0.58, name: 'PEAK', color: '#ff3b30' },
  { until: 0.8, name: 'DECEL', color: '#b0b6c1' },
  { until: 1.01, name: 'RECOVERY', color: '#757b85' },
]
const phaseOf = (p: number) => PHASES.find((ph) => p < ph.until) ?? PHASES[PHASES.length - 1]

type Sample = { v: number; p: number; f: number }

type RepState = {
  elapsed: number
  phase: number
  rep: number
  samples: Sample[]
  distance: number
  output: number
  sessionSec: number
  dataPoints: number
}

function initialSamples(): Sample[] {
  return Array.from({ length: CHART_POINTS }, (_, i) => {
    const ph = ((i * TICK_MS) % CYCLE_MS) / CYCLE_MS
    return { v: velocityAt(ph), p: powerAt(ph), f: forceAt(ph) }
  })
}

function useRepClock(active: boolean): RepState {
  const [state, setState] = useState<RepState>(() => ({
    elapsed: 0,
    phase: 0,
    rep: 8,
    samples: initialSamples(),
    distance: 283,
    output: 847,
    sessionSec: 24 * 60 + 18,
    dataPoints: 291640,
  }))

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setState((s) => {
        const elapsed = s.elapsed + TICK_MS
        const phase = (elapsed % CYCLE_MS) / CYCLE_MS
        const v = clampPct(velocityAt(phase) + noise(5))
        const p = clampPct(powerAt(phase) + noise(5))
        const f = clampPct(forceAt(phase) + noise(6))
        return {
          elapsed,
          phase,
          rep: 8 + Math.floor(elapsed / CYCLE_MS),
          samples: [...s.samples.slice(1), { v, p, f }],
          distance: s.distance + (v / 100) * 9.8 * (TICK_MS / 1000),
          output: 400 + (p / 100) * 800,
          sessionSec: s.sessionSec + (elapsed % 1000 === 0 ? 1 : 0),
          dataPoints: s.dataPoints + 50, // 200Hz × 0.25s
        }
      })
    }, TICK_MS)
    return () => clearInterval(iv)
  }, [active])

  return state
}

const fmtTime = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

// ─── Gauges ───────────────────────────────────────────────────────────────────

const GAUGES = [
  { id: 'speed', label: 'SPEED', unit: 'm/s', max: 14, color: '#00AEEF' },
  { id: 'power', label: 'POWER', unit: 'kW', max: 6, color: '#D61F26' },
  { id: 'force', label: 'FORCE', unit: 'N', max: 1200, color: '#D61F26' },
  { id: 'accel', label: 'ACCEL', unit: 'm/s²', max: 12, color: '#00AEEF' },
] as const

function CircularGauge({
  label, unit, value, color, pct,
}: {
  label: string; unit: string; value: number; color: string; pct: number
}) {
  const r = 42
  const circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(38,38,46,0.8)" strokeWidth="6" />
          {/* Progress — tracks the live rep value */}
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - circ * (pct / 100) }}
            transition={{ duration: TICK_MS / 1000 + 0.05, ease: 'linear' }}
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

function LiveChart({
  color, label, data, alert,
}: {
  color: string; label: string; data: number[]; alert: string | null
}) {
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
        <div className="flex items-center gap-3">
          {/* Rep-event tag — pops at the matching moment of the shared cycle */}
          <AnimatePresence>
            {alert && (
              <motion.span
                className="text-[8px] font-mono font-bold tracking-[0.16em] px-1.5 py-0.5"
                style={{ color: '#ff3b30', border: '1px solid rgba(255,59,48,0.45)', background: 'rgba(214,31,38,0.08)' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
              >
                {alert}
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-400">RECORDING</span>
          </div>
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
          cx={W}
          cy={H - (data[data.length - 1] / 100) * H}
          r="3" fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  )
}

// ─── Live Metric Row ──────────────────────────────────────────────────────────

const LIVE_METRICS = [
  { id: 'distance', label: 'DISTANCE', unit: 'm', delta: '+12m' },
  { id: 'output', label: 'OUTPUT', unit: 'W', delta: '+8%' },
] as const

function LiveMetricCard({
  label, unit, delta, value,
}: {
  label: string; unit: string; delta: string; value: number
}) {
  return (
    <div className="flex-1 flex flex-col gap-1 bg-apex-panel border border-apex-line rounded-xl p-4">
      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-apex-grey-dim">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-mono font-semibold text-apex-white metric-value">
          {Math.round(value)}
        </span>
        <span className="text-sm font-mono text-apex-grey">{unit}</span>
      </div>
      <span className="text-[10px] font-mono text-emerald-400">{delta}</span>
    </div>
  )
}

// ─── Dashboard Section ────────────────────────────────────────────────────────

export default function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  const clock = useRepClock(inView)
  const phaseInfo = phaseOf(clock.phase)

  // Gauge needles read the live waveforms directly (lightly damped — no noise)
  const gaugeValues: Record<(typeof GAUGES)[number]['id'], number> = {
    speed: velocityAt(clock.phase),
    power: powerAt(clock.phase),
    force: forceAt(clock.phase),
    accel: accelAt(clock.phase),
  }

  return (
    <section ref={sectionRef} id="dashboard" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
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
          className="text-apex-grey font-body mb-7 md:mb-12 max-w-xl leading-relaxed"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Real-time biomechanical data at up to 1000Hz, user-selectable. Every force, every rep, every sprint — quantified and displayed with Formula 1 precision.
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
              <span className="text-[9px] font-mono text-apex-blue border border-apex-line px-2 py-0.5 tracking-wider metric-value">
                REP {String(clock.rep).padStart(2, '0')}
              </span>
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
                    <CircularGauge
                      label={g.label}
                      unit={g.unit}
                      color={g.color}
                      pct={gaugeValues[g.id]}
                      value={(gaugeValues[g.id] / 100) * g.max}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Secondary metrics */}
              <div className="flex gap-3">
                <LiveMetricCard {...LIVE_METRICS[0]} value={clock.distance} />
                <LiveMetricCard {...LIVE_METRICS[1]} value={clock.output} />
              </div>
            </div>

            {/* Right column: Charts */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="text-[9px] font-mono tracking-[0.2em] text-apex-grey-dim uppercase">
                  Session Telemetry — Last 30s
                </div>
                {/* Current rep phase — driven by the shared cycle */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5"
                    style={{
                      background: phaseInfo.color,
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phaseInfo.name}
                      className="text-[9px] font-mono font-bold tracking-[0.2em]"
                      style={{ color: phaseInfo.color }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      {phaseInfo.name}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Speed chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart
                  color="#00AEEF"
                  label="Velocity (m/s)"
                  data={clock.samples.map((s) => s.v)}
                  alert={phaseInfo.name === 'PEAK' ? 'MAX VELOCITY' : null}
                />
              </div>

              {/* Power chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart
                  color="#D61F26"
                  label="Power Output (kW)"
                  data={clock.samples.map((s) => s.p)}
                  alert={null}
                />
              </div>

              {/* Force chart */}
              <div className="bg-apex-black/60 rounded-xl p-4 border border-apex-line/50">
                <LiveChart
                  color="#D61F26"
                  label="Force Production (N)"
                  data={clock.samples.map((s) => s.f)}
                  alert={clock.phase > 0.16 && clock.phase < 0.34 ? 'PEAK FORCE' : null}
                />
              </div>

              {/* Bottom status row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Session Time', value: fmtTime(clock.sessionSec) },
                  { label: 'Resistance Mode', value: 'ADAPTIVE' },
                  { label: 'AI Profile', value: 'SPRINT-A' },
                  { label: 'Data Points', value: clock.dataPoints.toLocaleString('en-US') },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-apex-black/60 rounded-lg p-3 border border-apex-line/40">
                    <div className="text-[8px] font-mono text-apex-grey-dim uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-[11px] font-mono font-semibold text-apex-white metric-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer — brand mark, bottom-left of the performance monitor */}
          <div className="flex items-center px-6 py-4 border-t border-apex-line bg-apex-black/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tapexlogo.webp"
              alt="T-APEX"
              className="h-14 sm:h-16 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

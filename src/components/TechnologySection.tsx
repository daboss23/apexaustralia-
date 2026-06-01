'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const COMPONENTS = [
  {
    id: 'motor',
    num: '01',
    name: 'Motor System',
    description: 'Electromagnetic drive delivering precise, programmable resistance across the full spectrum of human movement.',
    spec: '0 – 450N Continuous',
    cx: 50, cy: 50,
    explodedX: 0, explodedY: -38,
    angle: -90,
    labelSide: 'top',
  },
  {
    id: 'resistance',
    num: '02',
    name: 'Intelligent Resistance Engine',
    description: 'Adaptive resistance algorithms respond to athlete velocity, force output, and intent in under 5 milliseconds.',
    spec: '< 5ms Response',
    cx: 75, cy: 30,
    explodedX: 34, explodedY: -20,
    angle: -18,
    labelSide: 'right',
  },
  {
    id: 'sensor',
    num: '03',
    name: 'Sensor Array',
    description: 'Multi-axis IMU, force transducers, and velocity encoders delivering 200Hz biomechanical data streams.',
    spec: '200Hz Sampling',
    cx: 75, cy: 70,
    explodedX: 34, explodedY: 22,
    angle: 54,
    labelSide: 'right',
  },
  {
    id: 'telemetry',
    num: '04',
    name: 'Telemetry System',
    description: 'Real-time wireless data transmission to coaching dashboards and athlete devices with sub-10ms latency.',
    spec: '< 10ms Latency',
    cx: 25, cy: 70,
    explodedX: -34, explodedY: 22,
    angle: 126,
    labelSide: 'left',
  },
  {
    id: 'ai',
    num: '05',
    name: 'AI Performance Software',
    description: 'Machine learning models trained on elite athlete datasets, continuously optimising every training protocol.',
    spec: 'Adaptive AI Engine',
    cx: 25, cy: 30,
    explodedX: -34, explodedY: -20,
    angle: 198,
    labelSide: 'left',
  },
]

function TechDiagram({ progress }: { progress: number }) {
  const r = 130 // orbit radius
  const cx = 240, cy = 240

  return (
    <svg viewBox="0 0 480 480" className="w-full max-w-[480px] mx-auto" aria-label="T-APEX system diagram">
      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0231f" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e0231f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#26262e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1a1a20" stopOpacity="1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="clip">
          <circle cx={cx} cy={cy} r="235" />
        </clipPath>
      </defs>

      {/* Outer orbit ring */}
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="rgba(38,38,46,0.6)" strokeWidth="1"
        strokeDasharray="4 6" />

      {/* Inner orbit ring */}
      <circle cx={cx} cy={cy} r={r - 30} fill="none" stroke="rgba(38,38,46,0.35)" strokeWidth="0.5" />

      {/* Connector lines from each component to center */}
      {COMPONENTS.map((comp) => {
        const rad = (comp.angle * Math.PI) / 180
        const startX = cx + Math.cos(rad) * 28
        const startY = cy + Math.sin(rad) * 28
        const endX = cx + Math.cos(rad) * (r * progress + 28 * (1 - progress))
        const endY = cy + Math.sin(rad) * (r * progress + 28 * (1 - progress))
        return (
          <line
            key={comp.id}
            x1={startX} y1={startY}
            x2={endX} y2={endY}
            stroke="rgba(224,35,31,0.3)"
            strokeWidth="0.75"
            opacity={progress}
          />
        )
      })}

      {/* Central glow */}
      <circle cx={cx} cy={cy} r="50" fill="url(#coreGrad)" />

      {/* Central device body */}
      <circle cx={cx} cy={cy} r="36" fill="url(#ringGrad)" stroke="rgba(224,35,31,0.4)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="22" fill="#0a0a0c" stroke="rgba(224,35,31,0.6)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="8" fill="#e0231f" opacity="0.9" />

      {/* T-APEX wordmark in center */}
      <text x={cx} y={cy + 52} textAnchor="middle" fill="rgba(244,244,246,0.5)"
        fontSize="7" fontFamily="monospace" letterSpacing="3">T-APEX</text>

      {/* Component nodes */}
      {COMPONENTS.map((comp) => {
        const rad = (comp.angle * Math.PI) / 180
        const nx = cx + Math.cos(rad) * r * progress
        const ny = cy + Math.sin(rad) * r * progress
        return (
          <g key={comp.id} opacity={progress}>
            <circle cx={nx} cy={ny} r="14" fill="#141418" stroke="rgba(224,35,31,0.5)" strokeWidth="1.5"
              filter="url(#glow)" />
            <circle cx={nx} cy={ny} r="5" fill="#e0231f" opacity="0.9" />
            <text x={nx} y={ny - 20} textAnchor="middle" fill="rgba(244,244,246,0.7)"
              fontSize="6" fontFamily="monospace" letterSpacing="1">
              {comp.num}
            </text>
          </g>
        )
      })}

      {/* Scanning animation arc */}
      <circle
        cx={cx} cy={cy} r={r - 10}
        fill="none"
        stroke="rgba(224,35,31,0.12)"
        strokeWidth="20"
        strokeDasharray={`${(r - 10) * 2 * Math.PI * 0.15} ${(r - 10) * 2 * Math.PI * 0.85}`}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: 'spin 6s linear infinite',
        }}
      />
    </svg>
  )
}

function ComponentPanel({ comp, index, progress }: {
  comp: typeof COMPONENTS[0]
  index: number
  progress: number
}) {
  const threshold = index / COMPONENTS.length
  const localProgress = Math.max(0, Math.min(1, (progress - threshold) / (1 / COMPONENTS.length)))

  return (
    <motion.div
      className="flex gap-4 p-5 rounded-xl border border-apex-line/50 bg-apex-panel/50 backdrop-blur-sm"
      initial={{ opacity: 0, x: -20 }}
      style={{
        opacity: localProgress,
        transform: `translateX(${(1 - localProgress) * -16}px)`,
      }}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-apex-black border border-apex-line flex items-center justify-center">
          <span className="text-apex-red font-mono text-[11px] font-semibold">{comp.num}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-apex-white font-display font-bold text-[15px] tracking-wide leading-tight">
            {comp.name}
          </span>
        </div>
        <p className="text-apex-grey font-body text-[12px] leading-relaxed mb-2">
          {comp.description}
        </p>
        <span
          className="inline-block text-[10px] font-mono font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded border"
          style={{ color: '#e0231f', borderColor: 'rgba(224,35,31,0.3)', background: 'rgba(224,35,31,0.08)' }}
        >
          {comp.spec}
        </span>
      </div>
    </motion.div>
  )
}

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const explodeProgress = useTransform<number, number>(scrollYProgress, [0.1, 0.6], [0, 1])
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-15% 0px' })

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative bg-apex-black-2"
      style={{ minHeight: '280vh' }}
    >
      {/* Top section divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.3) 30%, rgba(224,35,31,0.3) 70%, transparent)'
      }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Sticky content */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-apex-black-2">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 60% 50%, rgba(224,35,31,0.08) 0%, transparent 60%)`
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Text content */}
            <div>
              {/* Label */}
              <div ref={titleRef} className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-apex-red" />
                <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
                  05 — How It Works
                </span>
              </div>

              <motion.h2
                className="font-display font-black text-apex-white leading-[0.88] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                FIVE SYSTEMS.<br />
                <span className="text-apex-red">ONE PURPOSE.</span>
              </motion.h2>

              <motion.p
                className="text-apex-grey font-body mb-10 leading-relaxed"
                style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                T-APEX integrates five precision-engineered systems into a single unified platform — delivering intelligent resistance, real-time telemetry, and AI-optimised training protocols.
              </motion.p>

              {/* Component list */}
              <div className="flex flex-col gap-3">
                {COMPONENTS.map((comp, i) => (
                  <ComponentPanel
                    key={comp.id}
                    comp={comp}
                    index={i}
                    progress={explodeProgress.get()}
                  />
                ))}
              </div>
            </div>

            {/* Right: Animated diagram */}
            <div className="flex flex-col items-center justify-center">
              <motion.div
                className="w-full max-w-[440px]"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProgressiveDiagram progress={explodeProgress as ReturnType<typeof useTransform<number, number>>} inView={inView} />
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

// Wrapper to read the motion value and pass it as a plain number to SVG
function ProgressiveDiagram({
  progress,
  inView,
}: {
  progress: ReturnType<typeof useTransform<number, number>>
  inView: boolean
}) {
  const [p, setP] = useState(0)

  useEffect(() => {
    const unsub = progress.on('change', (v: number) => setP(v))
    return unsub
  }, [progress])

  if (!inView) return null
  return <TechDiagram progress={p} />
}


'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'

/**
 * Scroll telemetry rail — a fixed vertical "session line" on the left edge
 * (xl+ only). The red fill tracks scroll progress like a live run; tick marks
 * are sector gates measured from the real page sections, and the readout at
 * the bottom shows the current sector. At the end of the page the tracker
 * pulses — the finish line into the final CTA.
 */
export default function TelemetryLine() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const headTop = useTransform(progress, (v) => `${v * 100}%`)

  const markersRef = useRef<number[]>([])
  const [markers, setMarkers] = useState<number[]>([])
  const [sector, setSector] = useState(0)
  const [finished, setFinished] = useState(false)

  // Measure each section's start as a fraction of the scrollable height.
  // Re-measure when the document resizes (videos/images loading, viewport changes).
  useEffect(() => {
    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'))
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0 || sections.length === 0) return
      const fractions = sections.map((s) =>
        Math.min(1, Math.max(0, (s.offsetTop - window.innerHeight * 0.45) / scrollable))
      )
      markersRef.current = fractions
      setMarkers(fractions)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let idx = 0
    const m = markersRef.current
    for (let i = 0; i < m.length; i++) if (v >= m[i]) idx = i
    setSector(idx)
    setFinished(v >= 0.985)
  })

  return (
    <motion.div
      className="fixed left-5 top-28 bottom-10 z-30 hidden xl:flex flex-col items-center gap-3 pointer-events-none"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.9 }}
    >
      <span
        className="font-mono text-[7px] font-medium tracking-[0.32em] uppercase text-apex-grey-dim"
        style={{ writingMode: 'vertical-lr' }}
      >
        Session
      </span>

      <div className="relative flex-1 w-px bg-apex-line/50">
        {/* Progress fill */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top"
          style={{
            scaleY: progress,
            background: 'linear-gradient(180deg, rgba(214,31,38,0.25), rgba(214,31,38,0.9))',
          }}
        />

        {/* Sector gates */}
        {markers.map((m, i) => {
          const passed = i <= sector
          return (
            <div
              key={i}
              className="absolute -left-[3px] h-px transition-all duration-500"
              style={{
                top: `${m * 100}%`,
                width: passed ? 7 : 5,
                background: passed ? '#D61F26' : 'rgba(110,119,131,0.45)',
                boxShadow: passed ? '0 0 6px rgba(214,31,38,0.5)' : 'none',
              }}
            />
          )
        })}

        {/* Tracker head */}
        <motion.div className="absolute left-1/2 -translate-x-1/2 -mt-1" style={{ top: headTop }}>
          <div
            className={`w-[7px] h-[7px] ${finished ? 'animate-pulse-slow' : ''}`}
            style={{
              background: finished ? '#ff3b30' : '#D61F26',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              boxShadow: finished
                ? '0 0 14px rgba(255,59,48,0.9)'
                : '0 0 8px rgba(214,31,38,0.7)',
            }}
          />
        </motion.div>
      </div>

      {/* Sector readout */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-mono text-[8px] font-bold tracking-[0.18em] text-apex-red metric-value">
          {finished ? 'FIN' : `S${String(sector + 1).padStart(2, '0')}`}
        </span>
        <span className="font-mono text-[7px] tracking-[0.18em] text-apex-grey-dim metric-value">
          /{String(Math.max(markers.length, 1)).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// ─── Electric aura ────────────────────────────────────────────────────────────
// A constant, living field of energy around a headline: drifting glow sparks
// that wander in and out of the letters, micro lightning bolts that flash at
// random, and two frequency traces marching around the words. Generated
// client-side only (random values would break SSR hydration) and skipped
// entirely under prefers-reduced-motion.

type AuraSpark = {
  left: number; top: number
  px: number[]; py: number[]
  dur: number; delay: number; size: number; color: string
}

type AuraBolt = {
  left: number; top: number; scale: number
  dur: number; delay: number; color: string; flip: boolean
}

export default function ElectricAura({
  colors = ['#00AEEF', '#7fd8ff', '#ff3b30'],
  appearDelay = 0,
}: {
  colors?: string[]
  appearDelay?: number
}) {
  const [items, setItems] = useState<{ sparks: AuraSpark[]; bolts: AuraBolt[] } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = (a: number, b: number) => a + Math.random() * (b - a)
    const pick = () => colors[Math.floor(Math.random() * colors.length)]
    setItems({
      sparks: Array.from({ length: 14 }, () => ({
        left: r(-2, 100),
        top: r(-12, 108),
        px: [0, r(-26, 26), r(-26, 26), 0],
        py: [0, r(-18, 18), r(-18, 18), 0],
        dur: r(4, 8),
        delay: r(0, 4),
        size: r(1.5, 3.5),
        color: pick(),
      })),
      bolts: Array.from({ length: 5 }, () => ({
        left: r(2, 90),
        top: r(-8, 100),
        scale: r(0.7, 1.4),
        dur: r(2.6, 5),
        delay: r(0, 5),
        color: pick(),
        flip: Math.random() > 0.5,
      })),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!items) return null

  return (
    <motion.div
      className="absolute -inset-x-8 -inset-y-6 pointer-events-none"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: appearDelay }}
    >
      {/* Wandering glow sparks — drift in and out of the letterforms */}
      {items.sparks.map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
          }}
          animate={{ x: s.px, y: s.py, opacity: [0, 0.9, 0.5, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Micro lightning bolts — brief random flashes */}
      {items.bolts.map((b, i) => (
        <motion.svg
          key={`b${i}`}
          className="absolute"
          viewBox="0 0 24 14"
          width={24 * b.scale}
          height={14 * b.scale}
          fill="none"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            transform: b.flip ? 'scaleX(-1)' : undefined,
            filter: `drop-shadow(0 0 3px ${b.color})`,
          }}
          animate={{ opacity: [0, 0, 1, 0.2, 0.8, 0] }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            times: [0, 0.62, 0.66, 0.7, 0.74, 0.8],
            ease: 'linear',
          }}
        >
          <polyline points="0,7 6,5 9,9 14,3 17,8 24,6" stroke={b.color} strokeWidth="1" />
        </motion.svg>
      ))}

      {/* Frequency traces hugging the words */}
      <svg
        className="absolute inset-x-0 top-[10%] h-[10px] w-full opacity-30"
        viewBox="0 0 400 10"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 5 H60 L66 1 L72 9 L78 5 H160 L166 2 L171 8 L176 5 H260 L266 1 L272 9 L278 5 H400"
          stroke={colors[0]}
          strokeWidth="0.8"
          strokeDasharray="4 7"
          style={{ animation: 'freq-march 5s linear infinite' }}
        />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-[6%] h-[10px] w-full opacity-25"
        viewBox="0 0 400 10"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 5 H80 L86 1 L92 9 L98 5 H200 L206 2 L211 8 L216 5 H320 L326 1 L332 9 L338 5 H400"
          stroke={colors[colors.length - 1]}
          strokeWidth="0.8"
          strokeDasharray="4 7"
          style={{ animation: 'freq-march 6s linear infinite reverse' }}
        />
      </svg>
    </motion.div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────────
   TYPEWRITER HEADLINE — a one-shot, cinematic headline reveal.

   When the line scrolls into view it TYPES itself out one character at a time,
   a HUD caret blinking at the cursor and taking the tone of whatever clause it
   is on. Once the last character lands it holds a beat, then the whole line
   RISES and FADES up the page. It re-arms every time the line leaves and
   re-enters view (same convention as the Solution boot-up sequence), and
   collapses to a plain static headline under prefers-reduced-motion.

   The headline is passed in as ordered, coloured SEGMENTS, so each character
   keeps its gradient-clipped metallic finish (t-silver / t-red / …) as it
   reveals — the typewriter just walks one flat character stream across them.
   A full-width invisible copy reserves the line's box, so the characters land
   into a stable layout instead of nudging the centre on every keystroke, and
   the full text stays in the DOM (+ aria-label) for crawlers and screen readers.
   ──────────────────────────────────────────────────────────────────────────── */

export interface HeadlineSegment {
  text: string
  /** finish class for this clause, e.g. 't-silver' | 't-red' | 't-blue' */
  className?: string
}

/** Caret fill + glow, matched to the clause the cursor is currently inside. */
function caretTone(className = ''): { color: string; glow: string } {
  if (className.includes('red')) return { color: '#ff3b30', glow: 'rgba(255,59,48,0.55)' }
  if (className.includes('blue')) return { color: '#00AEEF', glow: 'rgba(0,174,239,0.50)' }
  return { color: 'rgba(228,232,238,0.92)', glow: 'rgba(228,232,238,0.35)' } // silver
}

export function TypewriterHeadline({
  segments,
  className = '',
  style,
  speed = 55,
  hold = 1000,
  rise = 84,
}: {
  segments: HeadlineSegment[]
  /** classes for the <h2> — pass the site type system here (h-luxia …). */
  className?: string
  style?: React.CSSProperties
  /** ms per character */
  speed?: number
  /** ms to hold the finished line before it rises away */
  hold?: number
  /** px the line travels up as it fades out */
  rise?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  // Live (not `once`): the reveal replays every time the line re-enters view,
  // matching the site's other scroll-in sequences (see SolutionSection boot-up).
  const inView = useInView(ref, { margin: '0px 0px -30% 0px' })

  const total = segments.reduce((n, s) => n + s.text.length, 0)
  const plain = segments.map((s) => s.text).join('')

  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'leaving'>('idle')

  // Enter → type from empty; leave → reset so it re-arms for next time.
  useEffect(() => {
    if (reduce) return
    if (inView) {
      setCount(0)
      setPhase('typing')
    } else {
      setPhase('idle')
      setCount(0)
    }
  }, [inView, reduce])

  // Drive the typing, then hold, then hand off to the rise-and-fade.
  useEffect(() => {
    if (phase !== 'typing') return
    if (count >= total) {
      const t = setTimeout(() => setPhase('leaving'), hold)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(t)
  }, [phase, count, total, speed, hold])

  // Reduced-motion / SSR-safe fallback: the finished headline, no motion.
  if (reduce) {
    return (
      <h2 className={className} style={style}>
        {segments.map((seg, i) => (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        ))}
      </h2>
    )
  }

  // Which clause is the cursor sitting in right now (for the caret's tone)?
  let activeClass = segments[0]?.className
  let walked = 0
  for (const seg of segments) {
    if (count <= walked + seg.text.length) {
      activeClass = seg.className
      break
    }
    walked += seg.text.length
  }
  const tone = caretTone(activeClass)

  return (
    <motion.h2
      ref={ref}
      aria-label={plain}
      className={`relative inline-block ${className}`}
      style={style}
      initial={false}
      animate={
        phase === 'leaving'
          ? { y: -rise, opacity: 0 }
          : phase === 'idle'
            ? { y: 0, opacity: 0 }
            : { y: 0, opacity: 1 }
      }
      transition={phase === 'leaving' ? { duration: 1.6, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
    >
      {/* Reserves the full line box so nothing reflows as characters land. */}
      <span aria-hidden className="invisible">
        {segments.map((seg, i) => (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        ))}
      </span>

      {/* The typed line, laid over the reservation, revealing left → right. */}
      <span aria-hidden className="absolute inset-0 whitespace-nowrap text-left">
        {(() => {
          let acc = 0
          return segments.map((seg, i) => {
            const start = acc
            acc += seg.text.length
            const shown = Math.min(seg.text.length, Math.max(0, count - start))
            return (
              <span key={i} className={seg.className}>
                {seg.text.slice(0, shown)}
              </span>
            )
          })
        })()}
        {phase === 'typing' && (
          <span
            className="inline-block"
            style={{
              width: '0.06em',
              height: '0.82em',
              marginLeft: '0.04em',
              transform: 'translateY(0.08em)',
              background: tone.color,
              boxShadow: `0 0 10px ${tone.glow}`,
              animation: 'caret-blink 1.1s steps(1, end) infinite',
            }}
          />
        )}
      </span>
    </motion.h2>
  )
}

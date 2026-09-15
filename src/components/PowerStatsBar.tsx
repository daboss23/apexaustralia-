'use client'

import { Fragment, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion'

/* ── "POWER REDEFINED" spec bar ─────────────────────────────────────────────
   Real T-APEX headline specs, in a machined glass bar.

   It used to live inside the film section as an overlay on the sticky stage,
   arriving before the video and dissolving once the plate had grown past it.
   It now sits directly UNDER the film instead — the first thing in the section
   below, flush to the bottom of the open video — so the figures land on a black
   plate of their own instead of over moving footage, and the film gets the
   screen to itself.

   Self-contained on purpose: it measures its own arrival and drives its own
   entrance, so it can be dropped anywhere in the page flow without the host
   section having to choreograph it. */

const POWER_STATS = [
  { to: 120, unit: 'm', label: 'Cable Length' },
  { to: 40, unit: 'kgf', label: 'Continuous Resistance' },
  { to: 300, unit: 'kgf', label: 'Load Capacity' },
  { to: 20, unit: 'kg', label: 'Machine Weight' },
] as const

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** A figure driven by scroll: as `progress` moves 0→1 the value climbs 0→`to`,
    so the numbers visibly move under the reader's scroll (and scrub back down
    if they scroll up). The static / reduced-motion branch passes a constant 1,
    so the final figure shows immediately. */
function ScrollCount({ to, progress }: { to: number; progress: MotionValue<number> }) {
  const [val, setVal] = useState(() => Math.round(to * clamp01(progress.get())))
  useMotionValueEvent(progress, 'change', (v) => setVal(Math.round(to * clamp01(v))))
  return <>{val}</>
}

/* Bright-to-deep red gradient clipped to the figures — gives the numerals a
   lit, machined-metal depth instead of a flat fill. */
const NUM_STYLE: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #ff6a62 0%, #ea2731 50%, #c1141a 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
}

function UpTick({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-2.5 h-8 flex-shrink-0 text-white/25 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V4m0 0-4.5 4.5M12 4l4.5 4.5" />
    </svg>
  )
}

/* One machined panel — the "double bezel": an outer shell (hairline ring +
   faint fill) cradling an inner core with its own top-edge highlight and a
   mathematically smaller radius, so the curves stay concentric. */
function Bezel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[1.4rem] p-1.5 border border-white/10 bg-white/[0.045] ${className}`}
      style={{ boxShadow: '0 24px 70px -34px rgba(0,0,0,0.85)' }}
    >
      <div
        className="h-full rounded-[1.05rem] bg-gradient-to-b from-white/[0.06] to-white/[0.01]"
        style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.13), inset 0 0 0 1px rgba(255,255,255,0.02)' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function PowerStatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // The bar's own arrival: 0 as its top edge enters from below, 1 once it is
  // comfortably inside the screen. Everything it does keys off this, so it is a
  // pure function of scroll and reads the same in both directions.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 55%'],
  })

  const still = useMotionValue(1)
  const rise = useTransform(scrollYProgress, [0, 0.75], [38, 0])
  const fade = useTransform(scrollYProgress, [0, 0.55], [0, 1])
  // The figures climb with the rise and land just after the bar settles, so the
  // numbers move under the reader's scroll instead of running on a timer.
  const count = useTransform(scrollYProgress, [0.1, 0.95], [0, 1])

  const progress = reduce ? still : count

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { opacity: fade, y: rise }}
      className="relative w-full max-w-[1500px] mx-auto"
    >
      {/* Soft ambient wash so the bar reads as lit glass, not a flat plate */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-8 -inset-y-6 -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(65% 130% at 50% 0%, rgba(214,31,38,0.10), transparent 72%)' }}
      />

      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
        {/* Side label — desktop only. Uses the site's headline system (Marcellus
            h-luxia) with the metallic silver / electric-blue finish. On phones the
            headline moves inside the stats bar (below), centred on top of the
            figures. */}
        <Bezel className="hidden sm:block sm:flex-shrink-0">
          <div className="h-full px-7 py-4 flex flex-col items-start justify-center">
            <span className="h-luxia t-silver leading-[0.98] text-2xl xl:text-[2rem]" style={{ letterSpacing: '0.04em' }}>POWER</span>
            <span className="h-luxia t-blue leading-[0.98] text-2xl xl:text-[2rem]" style={{ letterSpacing: '0.04em' }}>REDEFINED</span>
          </div>
        </Bezel>

        {/* Stats bar — one cohesive panel. On phones it carries the Power
            Redefined headline centred on top, then the figures below it. */}
        <Bezel className="flex-1">
          <div className="h-full px-4 sm:px-8 py-4 sm:py-5">
            {/* Mobile-only headline, centred on top of the figures — the site's
                headline system (Marcellus h-luxia): silver POWER, electric-blue
                REDEFINED. */}
            <div className="sm:hidden text-center mb-4">
              <span className="h-luxia leading-none" style={{ fontSize: 'clamp(1.7rem, 7vw, 2.2rem)', letterSpacing: '0.04em' }}>
                <span className="t-silver">POWER </span>
                <span className="t-blue">REDEFINED</span>
              </span>
            </div>

            {/* Figures — a centred 2×2 grid on phones, a single divided row on
                desktop. */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-x-3 gap-y-4">
              {POWER_STATS.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 && <UpTick className="hidden sm:block" />}
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="font-display font-black leading-none tracking-tight text-[1.9rem] sm:text-5xl xl:text-6xl metric-value" style={NUM_STYLE}>
                      <ScrollCount to={s.to} progress={progress} />
                      <span className="text-base sm:text-2xl xl:text-3xl">{s.unit}</span>
                    </span>
                    <span className="font-mono text-[8px] sm:text-[9px] leading-[1.25] uppercase tracking-[0.08em] text-apex-red/60 text-left max-w-[54px] sm:max-w-[82px]">
                      {s.label}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </Bezel>
      </div>
    </motion.div>
  )
}

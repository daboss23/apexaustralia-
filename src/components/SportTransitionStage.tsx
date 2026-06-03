'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type Sport = {
  id: string
  name: string
  tagline: string
  description: string
  color: string
  focuses: string[]
  applications: string[]
}

/**
 * Multi-Sport Transition Stage — "One System. Every Code."
 *
 * A cinematic, engineered frame that visualises T-Apex translating across
 * sporting codes. Built to host a premium AI athlete-morph video as the hero
 * media; until that asset lands it degrades gracefully to a designed standby:
 *   1. /sports-transition.mp4   — looping athlete morph sequence (optional)
 *   2. /sports/{id}.jpg         — per-code athlete still, crossfades on change (optional)
 *   3. animated telemetry fallback — always present, never an empty box
 *
 * The active code is driven by the section's sport selector, so the stage and
 * the tabs stay in lockstep (and auto-cycle until the user takes over).
 */
export default function SportTransitionStage({
  sports,
  sport,
  activeId,
}: {
  sports: Sport[]
  sport: Sport
  activeId: string
}) {
  const accent = sport.color
  const index = Math.max(0, sports.findIndex((s) => s.id === activeId))
  const total = sports.length

  // Show the morph video only once it actually has frames — a missing asset
  // stays invisible and the designed fallback shows through instead.
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onData = () => v.readyState >= 2 && setVideoReady(true)
    v.addEventListener('loadeddata', onData)
    return () => v.removeEventListener('loadeddata', onData)
  }, [])

  // Deterministic motion streaks (no Math.random → no hydration mismatch).
  const streaks = [12, 28, 44, 58, 71, 84]

  return (
    <div
      className="relative w-full overflow-hidden aspect-[4/3] sm:aspect-[16/9] xl:aspect-[21/9]"
      style={{ borderRadius: 0, border: `1px solid ${accent}33`, borderTop: `2px solid ${accent}` }}
    >
      {/* ── Layer 0: base engineered gradient (always present) ───────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: `linear-gradient(118deg, #050505 0%, #0A0D10 42%, #121216 64%, ${accent}1f 100%)` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* ── Layer 1: motion streak field ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {streaks.map((top, i) => (
          <motion.div
            key={top}
            className="absolute h-px"
            style={{
              top: `${top}%`,
              left: 0,
              right: 0,
              background: `linear-gradient(90deg, transparent, ${accent}${i % 2 ? '30' : '18'} 45%, transparent)`,
            }}
            animate={{ x: ['-12%', '12%'] }}
            transition={{ duration: 7 + i, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Layer 2: per-code athlete still (drop /sports/{id}.jpg later) ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`img-${activeId}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/sports/${activeId}.jpg)` }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      {/* ── Layer 3: premium athlete-morph video (drop /sports-transition.mp4) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.6s ease' }}
        src="/sports-transition.mp4"
        poster="/sports-transition-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* ── Layer 4: legibility vignette ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.6) 34%, rgba(8,8,10,0.12) 60%, transparent 100%), linear-gradient(0deg, rgba(8,8,10,0.85) 0%, transparent 40%)',
        }}
      />

      {/* ── Layer 5: scan-sweep on every code change ─────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={`scan-${activeId}`}
          className="absolute top-0 bottom-0 w-[18%] pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}26 50%, transparent)` }}
          initial={{ left: '-20%', opacity: 0 }}
          animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      {/* ── HUD chrome: corner reticles ──────────────────────────────────── */}
      {([
        ['top-3 left-3', 'M0 8 L0 0 L8 0'],
        ['top-3 right-3', 'M0 0 L8 0 L8 8'],
        ['bottom-3 left-3', 'M0 0 L0 8 L8 8'],
        ['bottom-3 right-3', 'M8 0 L8 8 L0 8'],
      ] as const).map(([pos, d]) => (
        <svg key={pos} className={`absolute ${pos} pointer-events-none`} width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
          <path d={d} fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6" />
        </svg>
      ))}

      {/* ── HUD: top status bar ──────────────────────────────────────────── */}
      <div className="absolute top-3.5 left-5 right-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.28em] uppercase text-apex-grey">
            Multi-Sport Transition
          </span>
          <span className="hidden sm:inline text-[8px] font-mono tracking-[0.22em] uppercase" style={{ color: accent }}>
            // Live
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] text-apex-grey-dim tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* ── Foreground content ───────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 lg:px-12">
        {/* Ghosted crossfading code wordmark */}
        <div className="relative h-[1.05em] mb-1 overflow-hidden" style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`mark-${activeId}`}
              className="absolute inset-0 font-display font-black leading-none whitespace-nowrap"
              style={{ color: 'transparent', WebkitTextStroke: `1.5px ${accent}59` }}
              initial={{ y: '60%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-60%', opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {sport.name.toUpperCase()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.32em] uppercase text-apex-white mb-4">
          One System. <span style={{ color: accent }}>Every Code.</span>
        </div>

        {/* Active code tagline */}
        <div className="max-w-md min-h-[2.4em] mb-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={`tag-${activeId}`}
              className="font-display font-bold text-apex-white leading-snug"
              style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.35rem)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {sport.tagline}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Application chips — HUD style, crossfade per code */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`chips-${activeId}`}
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {sport.applications.map((app, i) => (
              <motion.span
                key={app}
                className="text-[8px] sm:text-[9px] font-mono tracking-[0.16em] uppercase px-2.5 py-1 border backdrop-blur-sm"
                style={{ color: accent, borderColor: `${accent}40`, background: 'rgba(5,5,8,0.5)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + i * 0.05 }}
              >
                {app}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom: code progress ticker ─────────────────────────────────── */}
      <div className="absolute bottom-3.5 left-5 right-5 flex items-center gap-1.5 pointer-events-none">
        {sports.map((s) => (
          <div key={s.id} className="h-[2px] flex-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full"
              animate={{
                width: s.id === activeId ? '100%' : '0%',
                background: s.id === activeId ? accent : 'transparent',
              }}
              transition={{ duration: s.id === activeId ? 0.6 : 0.2, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

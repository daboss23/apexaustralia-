'use client'

import { Fragment, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useIsMobile } from './useIsMobile'

/* ────────────────────────────────────────────────────────────────────────────
   SCROLL-EXPAND VIDEO — the film opens out of the hero.

   THE CHOREOGRAPHY (one sticky stage, four beats, all scroll-linked):

     1. HOLD      the quote lands dead-centre of an otherwise empty black
                  screen and sits there alone.
     2. LIFT      it travels up the page and fades out.
     3. RISE      as the quote starts to go, the video plate climbs in from
                  below the fold and settles centred.
     4. EXPAND    the plate grows from a small card to near-full-bleed, then
                  the page carries on.

   The POWER REDEFINED spec bar used to share this stage; it now lives in its
   own band directly beneath the section, because beat 1 requires the quote to
   be the only thing on screen.

   IMPORTANT — why this is not the usual "scroll expansion hero" implementation:
   the widely-copied version of this effect listens on `window` for wheel and
   touch, calls preventDefault on every notch, and forces `window.scrollTo(0,0)`
   until its animation completes. This page runs Lenis *and* a GSAP
   ScrollTrigger pin (see ScrollCinemaHero + lib/scroll.ts), and both write the
   scroll position every frame. A third writer fighting them locks the page.

   So the sequence is scroll-*linked* instead of scroll-*jacked*: a tall
   section, a sticky viewport-height stage inside it, and Framer's `useScroll`
   reading the section's own progress. Nothing is intercepted, nothing is
   pinned, and Lenis stays the only thing moving the page.

   On the "three second" hold: a scroll-linked stage has no clock, and a real
   timer here would mean the screen stops responding to the wheel — the exact
   failure the note above avoids. The hold is bought with scroll budget
   instead: HOLD_END of a ~200svh travel ≈ 60svh of scrolling where nothing
   moves, which reads as roughly three seconds at a normal reading pace and
   degrades gracefully when someone flicks past it.

   The clip is a 100-second narrated explainer, so it deliberately does NOT
   autoplay: it holds on a poster until the viewer presses play, with native
   controls for sound. Autoplaying it muted on a loop would talk over itself and
   pull ~17 MB on first paint, high on the page, on mobile data.
   ──────────────────────────────────────────────────────────────────────────── */

const SRC = '/checkout/tapex-features.mp4'
const POSTER = '/checkout/tapex-features-poster.jpg'

/* Beat boundaries as fractions of the sticky stage's travel. Kept here as one
   readable map so the timing can be retuned without hunting through transforms.
   The overlaps are intentional: the plate starts rising while the quote is
   still fading, so the two movements hand over instead of queueing. */
const HOLD_END = 0.3 // quote alone, centred, nothing moving
const LIFT_END = 0.55 // quote has travelled up and gone
const RISE_START = 0.36 // plate enters from below the fold
const RISE_END = 0.66 // plate settled, centred, small
const EXPAND_END = 0.94 // plate near-full-bleed

/* ── "POWER REDEFINED" spec bar ─────────────────────────────────────────────
   Real T-APEX headline specs. Sits in its own band under the film; the figures
   count up as the band scrolls into view. */
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

function PowerStatsBar({ countProgress }: { countProgress?: MotionValue<number> }) {
  // A constant fallback so the static / reduced-motion branch shows the final
  // figures immediately (progress pinned at 1).
  const fallback = useMotionValue(1)
  const progress = countProgress ?? fallback
  return (
    <div className="relative w-full max-w-[1500px] mx-auto">
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
    </div>
  )
}

/** The spec band that follows the film. Scroll-linked figures, nothing pinned. */
function PowerStatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  const fade = useTransform(scrollYProgress, [0.15, 0.6], [0, 1])
  const liftN = useTransform(scrollYProgress, [0.15, 0.7], [28, 0])
  const lift = useTransform(liftN, (v) => `${v}px`)
  const count = useTransform(scrollYProgress, [0.25, 0.85], [0, 1])

  if (reduce) {
    return (
      <div className="relative bg-apex-black px-4 sm:px-6 py-14 md:py-20">
        <PowerStatsBar />
      </div>
    )
  }

  return (
    <div ref={ref} className="relative bg-apex-black px-4 sm:px-6 py-14 md:py-20">
      <motion.div style={{ opacity: fade, y: lift }}>
        <PowerStatsBar countProgress={count} />
      </motion.div>
    </div>
  )
}

export default function ScrollExpandVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  // The sticky stage's travel: 0 the moment the stage locks to the top of the
  // viewport (quote centred), 1 as the section releases it.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // The section's *approach* — 0 when it is still a viewport below, 1 when the
  // stage locks. The quote keys its fade-in to this, so it is already fully lit
  // and centred by the time the hold begins.
  const { scrollYProgress: approach } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })

  // ── Beat 1–2 · the quote: holds dead-centre, then lifts and fades ─────────
  const titleIn = useTransform(approach, [0.35, 0.85], [0, 1])
  const titleOut = useTransform(scrollYProgress, [HOLD_END, LIFT_END], [1, 0])
  const titleOpacity = useTransform([titleIn, titleOut], (v: number[]) => v[0] * v[1])
  const titleYn = useTransform(scrollYProgress, [HOLD_END, LIFT_END], [0, isMobile ? -20 : -26])
  const titleY = useTransform(titleYn, (v) => `${v}svh`)

  // ── Beat 3 · the plate rises from the bottom edge and settles centred ─────
  const riseYn = useTransform(scrollYProgress, [RISE_START, RISE_END], [62, 0])
  const riseY = useTransform(riseYn, (v) => `${v}svh`)
  const plateOpacity = useTransform(scrollYProgress, [RISE_START, RISE_START + 0.12], [0, 1])

  // ── Beat 4 · it grows out to take the screen ─────────────────────────────
  const width = useTransform(scrollYProgress, [RISE_END, EXPAND_END], isMobile ? ['78vw', '100vw'] : ['34vw', '92vw'])
  const radius = useTransform(scrollYProgress, [RISE_END, EXPAND_END], ['2px', '0px'])
  const veil = useTransform(scrollYProgress, [RISE_END, EXPAND_END - 0.08], [0.45, 0])

  // The cue belongs to the hold — it is the one thing telling the reader the
  // quote is a beat and not a dead end. It leaves as soon as the quote moves.
  const cueOpacity = useTransform(scrollYProgress, [HOLD_END - 0.08, HOLD_END + 0.02], [1, 0])

  function play() {
    setPlaying(true)
    // The element only gets a src once the viewer asks for it.
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}))
  }

  /* Reduced motion / no-JS-friendly fallback: a plain, static presentation of
     the same clip. No sticky stage, no scroll-linked geometry. */
  if (reduce) {
    return (
      <>
        <section id="film" className="relative bg-apex-black py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <SectionTitle />
            <div className="relative mt-8 border border-apex-line/60 bg-apex-black-2">
              <VideoPlate videoRef={videoRef} playing={playing} onPlay={play} veilOpacity={0} />
            </div>
          </div>
        </section>
        <PowerStatsBand />
      </>
    )
  }

  return (
    <>
      <section
        id="film"
        ref={sectionRef}
        className="relative bg-apex-black"
        /* Stage height + scroll budget. The budget (height − 100svh) is what the
           four beats are spent from: ~200svh on desktop, ~170svh on a phone,
           where a gesture covers more ground per second. */
        style={{ height: isMobile ? '270svh' : '300svh' }}
      >
        <div className="sticky top-0 w-full h-[100svh] overflow-hidden">
          {/* Beat 1–2 — the quote. Dead-centre of an empty screen, alone, then
              up and out. ONE line, same max size as the scroll-cinema titles. */}
          <motion.div
            className="absolute inset-0 z-20 px-4 flex items-center justify-center pointer-events-none"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="h-luxia leading-none text-center whitespace-nowrap" style={{ fontSize: 'clamp(15px, 4.8vw, 66px)', letterSpacing: '0.04em' }}>
              <span className="t-silver">&ldquo;PERFORMANCE BECOMES </span>
              <span className="t-red">INEVITABLE.&rdquo;</span>
            </h2>
          </motion.div>

          {/* Beat 3–4 — the plate. The wrapper carries the rise (so the plate
              climbs in from below the stage's clipped bottom edge and lands
              centred); the plate itself carries the growth. */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ y: riseY, opacity: plateOpacity }}
          >
            <motion.div
              className="relative border border-apex-line/60 bg-apex-black-2 overflow-hidden"
              style={{
                width,
                aspectRatio: '16 / 9',
                maxHeight: '82svh',
                borderRadius: radius,
                boxShadow: '0 30px 90px -20px rgba(0,0,0,0.8)',
              }}
            >
              <VideoPlate videoRef={videoRef} playing={playing} onPlay={play} veil={veil} />
            </motion.div>
          </motion.div>

          {/* Scroll cue — lives with the hold, leaves when the quote does */}
          <motion.div
            className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            style={{ opacity: cueOpacity }}
            aria-hidden="true"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-apex-grey-dim">
              Scroll
            </span>
          </motion.div>
        </div>
      </section>

      {/* POWER REDEFINED — its own band, after the film has taken the screen */}
      <PowerStatsBand />
    </>
  )
}

function SectionTitle() {
  return (
    <div className="text-center">
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="kicker-line kicker-line--l bg-apex-red" />
        <span className="text-apex-red font-mono text-[12px] tracking-[0.3em] uppercase">The Full Walkthrough</span>
        <div className="kicker-line kicker-line--r bg-apex-red" />
      </div>
      <h2 className="h-luxia leading-[0.92]" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
        <span className="t-silver">&ldquo;PERFORMANCE BECOMES</span> <span className="t-red">INEVITABLE.&rdquo;</span>
      </h2>
    </div>
  )
}

/** The poster-until-pressed video surface, shared by both branches. */
function VideoPlate({
  videoRef,
  playing,
  onPlay,
  veil,
  veilOpacity,
}: {
  videoRef: React.RefObject<HTMLVideoElement>
  playing: boolean
  onPlay: () => void
  veil?: MotionValue<number>
  veilOpacity?: number
}) {
  return (
    <>
      <video
        ref={videoRef}
        /* No src until play is pressed — this is a ~17 MB file sitting high on
           the page. preload="none" alone still lets some browsers reach out. */
        src={playing ? SRC : undefined}
        poster={POSTER}
        preload="none"
        playsInline
        controls={playing}
        className="absolute inset-0 w-full h-full object-cover bg-apex-black"
      />

      {/* Darkening veil that lifts as the plate opens (decoration only) */}
      {veil ? (
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: veil }}
          aria-hidden="true"
        />
      ) : veilOpacity ? (
        <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: veilOpacity }} aria-hidden="true" />
      ) : null}

      {!playing && (
        <button
          onClick={onPlay}
          aria-label="Play the T-APEX feature walkthrough"
          className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
        >
          {/* Neon play button — glossy dark disc, a glowing multicolour ring
              and a neon-outlined triangle (see .neon-play* in globals.css). */}
          <span className="neon-play relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="neon-play-ring" aria-hidden="true" />
            <span className="neon-play-disc" aria-hidden="true" />
            <svg className="neon-play-tri relative w-6 h-6 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 5.5 L18.5 12 L8 18.5 Z" stroke="#d6a8ff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}
    </>
  )
}

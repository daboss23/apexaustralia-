'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
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
            <div className="relative mt-8 aspect-video border border-apex-line/60 bg-apex-black-2">
              <VideoPlate videoRef={videoRef} playing={playing} onPlay={play} veilOpacity={0} />
            </div>
          </div>
        </section>
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

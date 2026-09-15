'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useIsMobile } from './useIsMobile'

/* ────────────────────────────────────────────────────────────────────────────
   SCROLL-EXPAND VIDEO — the film opens out of the hero.

   Placed directly after ScrollCinemaHero: as the last frame of the scroll
   cinema lands, this section takes over and a small video plate grows to
   near-full-bleed while the title halves slide apart around it.

   IMPORTANT — why this is not the usual "scroll expansion hero" implementation:
   the widely-copied version of this effect listens on `window` for wheel and
   touch, calls preventDefault on every notch, and forces `window.scrollTo(0,0)`
   until its animation completes. This page runs Lenis *and* a GSAP
   ScrollTrigger pin (see ScrollCinemaHero + lib/scroll.ts), and both write the
   scroll position every frame. A third writer fighting them locks the page.

   So the expansion is scroll-*linked* instead of scroll-*jacking*: a tall
   section, a sticky viewport-height stage inside it, and Framer's `useScroll`
   reading the section's own progress. Nothing is intercepted, nothing is
   pinned, and Lenis stays the only thing moving the page.

   The clip is a 100-second narrated explainer, so it deliberately does NOT
   autoplay: it holds on a poster until the viewer presses play, with native
   controls for sound. Autoplaying it muted on a loop would talk over itself and
   pull ~17 MB on first paint, high on the page, on mobile data.
   ──────────────────────────────────────────────────────────────────────────── */

const SRC = '/checkout/tapex-features.mp4'
const POSTER = '/checkout/tapex-features-poster.jpg'

export default function ScrollExpandVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  /* ── The choreography ──────────────────────────────────────────────────────
     Four phases, all driven off ONE scroll reading, in order:

       1 ENTRANCE  0.00–0.17  the headline rises in, then the video plate.
       2 HOLD      0.17–0.30  nothing moves. The composed frame — headline over
                              film — sits still and is read.
       3 EXPAND    0.30–0.65  the plate grows from a card to full-bleed, behind
                              the headline.
       4 DISSOLVE  0.40–0.58  the headline fades off the opening film, leaving
                              the last third of the section to the film alone.

     The POWER REDEFINED spec bar used to be the first beat of this entrance and
     an overlay on this stage. It now lives directly below, at the top of
     <PerformanceSection/>, flush under the bottom edge of the open video — so
     the figures land on their own black plate instead of over moving footage.

     Two things here have each been got wrong once, and the reasons are worth
     keeping.

     It is not a clock. The entrance was briefly a paused GSAP timeline played
     on enter — a real four-second sequence. Scroll speed and a clock disagree:
     arriving fast showed a half-built frame, arriving slow showed a finished one
     that then sat waiting, and scrubbing back up replayed nothing. Everything
     below is a pure function of scroll position, so every state is reachable in
     both directions and nothing can race.

     It is also not keyed to the section's *approach*. The obvious place to stage
     an entrance is the viewport of scroll before a section pins, and for this
     section that window does not exist: the hero above is a 6,500px GSAP pin and
     `[data-cinema]` in globals.css pulls this section up over the hero's
     trailing height, so #film's document position is reached while the hero
     still owns every pixel of the screen. An approach-keyed entrance therefore
     played out in full behind the hero, and the section arrived already
     finished. Progress 0 here is the first moment this section is visible at
     all, which is why the entrance starts there. */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0 the instant the hero releases and this section takes the screen; 1 just
    // before it leaves, so the open film gets a clean beat of its own.
    offset: ['start start', 'end 85%'],
  })

  // ── 1. ENTRANCE — the headline, then the plate ────────────────────────────
  // The plate starts before the headline has quite finished, which is what makes
  // it read as one move rather than two cues.
  const titleIn = useTransform(scrollYProgress, [0, 0.085], [0, 1])
  const titleRise = useTransform(scrollYProgress, [0, 0.085], [34, 0])
  const plateIn = useTransform(scrollYProgress, [0.075, 0.17], [0, 1])
  const cueIn = useTransform(scrollYProgress, [0.16, 0.22], [0, 1])

  // ── 2. HOLD (0.17 → 0.30), then 3. EXPAND ─────────────────────────────────
  // Nothing geometric happens in the gap, and that gap is the point: the plate
  // used to start growing on the section's very first pixel, so the frame was
  // never once composed and still.
  const GROW: [number, number] = [0.3, 0.65]
  const width = useTransform(scrollYProgress, GROW, isMobile ? ['74vw', '100vw'] : ['46vw', '100vw'])
  const radius = useTransform(scrollYProgress, [GROW[0], 0.58], ['2px', '0px'])
  const veil = useTransform(scrollYProgress, [GROW[0], 0.6], [0.5, 0])
  // The plate rides low while the headline is above it, then settles to centre
  // as it opens out.
  const plateShiftN = useTransform(scrollYProgress, [GROW[0], 0.5], isMobile ? [8, 0] : [5, 0])
  const plateShift = useTransform(plateShiftN, (v) => `${v}svh`)
  // "Scroll to expand" is an instruction; it is spent on the notch that acts on
  // it, so it clears just before the growth rather than riding over it.
  const cueOut = useTransform(scrollYProgress, [0.25, 0.31], [1, 0])

  // ── 4. DISSOLVE ───────────────────────────────────────────────────────────
  // Begins only once the plate is visibly taking the screen. The plate grows
  // BEHIND the headline (z-10 against z-20), so the words ride the opening film
  // for a beat and then dissolve off it — that is the read, not an accident.
  //
  // Phones keep the headline. There it is in normal flow ABOVE the plate rather
  // than over it, so it reads as a title on the film, and fading it would leave
  // the video floating in black.
  const titleOut = useTransform(scrollYProgress, [0.4, 0.58], isMobile ? [1, 1] : [1, 0])

  const titleOpacity = useTransform([titleIn, titleOut], (v: number[]) => v[0] * v[1])
  const plateOpacity = plateIn
  const cueOpacity = useTransform([cueIn, cueOut], (v: number[]) => v[0] * v[1])

  function play() {
    setPlaying(true)
    // The element only gets a src once the viewer asks for it.
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}))
  }

  /* Reduced motion / no-JS-friendly fallback: a plain, static presentation of
     the same clip. No sticky stage, no scroll-linked geometry. */
  if (reduce) {
    return (
      <section id="film" className="relative bg-apex-black py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionTitle />
          <div className="relative mt-8 border border-apex-line/60 bg-apex-black-2">
            <VideoPlate
              videoRef={videoRef}
              playing={playing}
              onPlay={play}
              veilOpacity={0}
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="film"
      ref={sectionRef}
      className="relative bg-apex-black"
      /* The scroll budget for the whole four-phase sequence: the stage inside is
         sticky, so (height − stage height) is how far the composed frame stays
         still on screen while the phases play out.
           desktop 250svh − 100svh stage = 1.5 viewports of pinned choreography
           phone   190svh − 100svh stage = 0.9 viewports
         Both were raised when the hold was added — at the old 230/150 the plate
         finished growing with barely a screen left, so the open film never got
         a clean beat of its own before the section handed over. Shorter on a
         phone throughout: a thumb covers ground far faster than a wheel. */
      style={{ height: isMobile ? '190svh' : '250svh' }}
    >
      {/* The stage is the full viewport on both. It was 66svh on phones, back
          when the spec bar, the headline and the plate all had to share it and a
          100svh stage left dead black above AND below the group. The bar has
          moved out to the section below, so what is left is a headline over a
          16:9 plate — and a 16:9 plate on a portrait phone cannot fill the
          height whatever you do. A full-height stage centres that pair and puts
          equal black above and below it, which reads as letterboxing. At 66svh
          the same content sat in the top two thirds with one long empty band
          under it, which reads as a gap. */}
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center gap-[2.5svh]"
      >
        {/* Title — ONE line, same max size as the scroll-cinema titles. On
            phones it sits in flow directly above the video; on desktop it's an
            overlay in the stage's upper third. It arrives first, holds over the
            composed frame, then dissolves as the film takes the screen. */}
        <motion.div
          className={
            isMobile
              ? 'relative w-full px-4 z-20 flex justify-center pointer-events-none'
              : 'absolute inset-x-0 top-[21%] z-20 px-4 flex justify-center pointer-events-none'
          }
          style={{ opacity: titleOpacity, y: titleRise }}
        >
          <h2 className="h-luxia leading-none text-center whitespace-nowrap" style={{ fontSize: 'clamp(15px, 4.8vw, 66px)', letterSpacing: '0.04em' }}>
            <span className="t-silver">&ldquo;PERFORMANCE BECOMES </span>
            <span className="t-red">INEVITABLE.&rdquo;</span>
          </h2>
        </motion.div>

        {/* The growing video plate. Desktop: centred, rides plateShift out to
            near-full-bleed. Phones: sits in flow directly under the spec bar and
            grows downward, stopping just below the bar at full size. */}
        <motion.div
          className="relative z-10 border border-apex-line/60 bg-apex-black-2 overflow-hidden"
          style={{
            width,
            aspectRatio: '16 / 9',
            maxHeight: '90svh',
            borderRadius: radius,
            opacity: plateOpacity,
            ...(isMobile ? {} : { y: plateShift }),
            boxShadow: '0 30px 90px -20px rgba(0,0,0,0.8)',
          }}
        >
          <VideoPlate
            videoRef={videoRef}
            playing={playing}
            onPlay={play}
            veil={veil}
          />
        </motion.div>

        {/* Scroll cue — arrives last, and is spent on the first notch of the
            expansion. */}
        <motion.div
          className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ opacity: cueOpacity }}
          aria-hidden="true"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-apex-grey-dim">
            Scroll to expand
          </span>
        </motion.div>
      </div>
    </section>
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
  veil?: ReturnType<typeof useTransform<number, number>>
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

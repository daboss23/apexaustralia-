'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView, animate, type MotionValue } from 'framer-motion'
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

/* ── "POWER REDEFINED" spec bar ─────────────────────────────────────────────
   Real T-APEX headline specs. Sits in the black gap as the film section opens;
   the figures count up when the bar scrolls into view, then the whole bar fades
   out as the video plate grows. */
const POWER_STATS = [
  { to: 120, unit: 'm', label: 'Cable Length' },
  { to: 40, unit: 'kgf', label: 'Continuous Resistance' },
  { to: 300, unit: 'kgf', label: 'Load Capacity' },
  { to: 20, unit: 'kg', label: 'Machine Weight' },
] as const

/** A figure that eases from 0 to `to` once `start` flips true; honours
    reduced-motion by rendering the final value immediately. */
function CountUp({ to, start, duration = 1.6 }: { to: number; start: boolean; duration?: number }) {
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce || !start) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [start, to, duration, reduce])
  return <>{Math.round(val)}</>
}

function UpTick() {
  return (
    <svg className="w-3 h-7 flex-shrink-0 text-apex-grey-dim/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V4m0 0-4.5 5M12 4l4.5 5" />
    </svg>
  )
}

function PowerStatsBar({ style }: { style?: { opacity?: MotionValue<number> } }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <motion.div ref={ref} style={style} className="w-full max-w-5xl mx-auto">
      <div className="flex items-stretch gap-2.5 sm:gap-3">
        {/* Side label */}
        <div className="flex-shrink-0 flex flex-col justify-center px-3.5 sm:px-5 py-3 border border-apex-line/60 bg-apex-black/55 backdrop-blur-sm">
          <span className="font-display font-black text-apex-white leading-tight text-base sm:text-xl xl:text-2xl">Power</span>
          <span className="font-display font-black text-apex-red leading-tight text-base sm:text-xl xl:text-2xl">Redefined</span>
        </div>
        {/* Stats */}
        <div className="flex-1 flex items-center justify-around gap-1.5 sm:gap-3 px-3 sm:px-6 py-3 border border-apex-line/60 bg-apex-black/40 backdrop-blur-sm overflow-hidden">
          {POWER_STATS.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && <UpTick />}
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="font-display font-black text-apex-red-bright leading-none text-2xl sm:text-4xl xl:text-5xl metric-value">
                  <CountUp to={s.to} start={inView} />
                  <span className="text-xs sm:text-base ml-0.5">{s.unit}</span>
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] leading-tight uppercase tracking-wide text-apex-red/70 max-w-[54px] sm:max-w-[74px]">
                  {s.label}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ScrollExpandVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Start expanding as the stage arrives, finish before the section leaves,
    // so the plate sits fully open for the last stretch instead of popping.
    offset: ['start start', 'end 85%'],
  })

  // The plate grows from a small centred card to near-full-bleed.
  const width = useTransform(scrollYProgress, [0, 0.75], isMobile ? ['74vw', '95vw'] : ['32vw', '92vw'])
  const radius = useTransform(scrollYProgress, [0, 0.75], ['2px', '0px'])
  const veil = useTransform(scrollYProgress, [0, 0.7], [0.55, 0])
  // Title halves part around the growing plate.
  //
  // These distances are a function of how wide the words are: the parting ends
  // with the left half's edge at the edge of the screen, so a longer first half
  // needs a shorter travel or it slides straight off. They were tuned for
  // "EVERY FEATURE" (13 characters) and this half is now 19, hence 18/8vw
  // rather than 32/24vw — measured to leave clearance from 390px to 1920px.
  const shiftL = useTransform(scrollYProgress, [0, 0.75], ['0vw', isMobile ? '-8vw' : '-18vw'])
  const shiftR = useTransform(scrollYProgress, [0, 0.75], ['0vw', isMobile ? '8vw' : '18vw'])
  // …and fade out as they go, so the quote hands the screen over to the film
  // instead of sitting on top of it. Gone by the time the plate is two-thirds
  // open; the parting continues underneath and is never seen finishing.
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.45], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  // The spec bar holds in the gap while the numbers count, then fades as the
  // plate starts to grow.
  const statsOpacity = useTransform(scrollYProgress, [0, 0.1, 0.34], [1, 1, 0])

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
          <div className="mt-8">
            <PowerStatsBar />
          </div>
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
      /* Tall enough to give the expansion room to read; the stage inside is
         sticky, so this height is the "scroll budget" for the growth.
         Shorter on a phone: the budget is spent at the same rate but there is
         less of it left doing nothing once the plate is open. */
      style={{ height: isMobile ? '150svh' : '230svh' }}
    >
      {/* The stage is only as tall as it needs to be on a phone. At a full
          100svh the 16:9 plate (95vw ≈ 53svh) left ~23svh of dead black above
          AND below it, and the lower band read as a long break between this
          section and the next — the plate is centred, so the emptiness is
          symmetrical and unavoidable at that height. Tightened to 56svh so the
          plate sits higher in the pinned view (less dead black above it) and
          the section is shorter overall — both cut scroll time on a phone. */}
      <div
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ height: isMobile ? '56svh' : '100svh' }}
      >
        {/* POWER REDEFINED spec bar — sits in the gap at the top of the stage,
            counts up on view, then fades out as the plate grows. */}
        <motion.div
          className="absolute top-[6%] sm:top-[9%] inset-x-0 z-30 px-4 flex justify-center pointer-events-none"
          style={{ opacity: statsOpacity }}
        >
          <PowerStatsBar />
        </motion.div>

        {/* Title halves — they part, and fade, as the plate opens */}
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 px-4"
          style={{ opacity: titleOpacity }}
        >
          <motion.h2
            className="h-luxia leading-[0.92] text-center"
            style={{ x: shiftL, fontSize: 'clamp(1.45rem, 4.4vw, 3.6rem)' }}
          >
            <span className="t-silver">&ldquo;PERFORMANCE BECOMES</span>
          </motion.h2>
          <motion.h2
            className="h-luxia leading-[0.92] text-center"
            style={{ x: shiftR, fontSize: 'clamp(1.45rem, 4.4vw, 3.6rem)' }}
          >
            <span className="t-red">INEVITABLE.&rdquo;</span>
          </motion.h2>
        </motion.div>

        {/* The growing video plate */}
        <motion.div
          className="relative z-10 border border-apex-line/60 bg-apex-black-2 overflow-hidden"
          style={{
            width,
            aspectRatio: '16 / 9',
            maxHeight: '82svh',
            borderRadius: radius,
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

        {/* Scroll cue — fades out as soon as the expansion starts */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
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
          <span className="neon-play relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="neon-play-ring" aria-hidden="true" />
            <span className="neon-play-disc" aria-hidden="true" />
            <svg className="neon-play-tri relative w-7 h-7 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 5.5 L18.5 12 L8 18.5 Z" stroke="#d6a8ff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}
    </>
  )
}

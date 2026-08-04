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
        <div className="w-8 h-px bg-apex-red" />
        <span className="text-apex-red font-mono text-[12px] tracking-[0.3em] uppercase">The Full Walkthrough</span>
        <div className="w-8 h-px bg-apex-red" />
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
          <span className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-white/40 group-hover:border-apex-red transition-colors duration-300">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-apex-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </>
  )
}

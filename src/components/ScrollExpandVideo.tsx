'use client'

import { Fragment, useCallback, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
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

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SRC = '/checkout/tapex-features.mp4'
const POSTER = '/checkout/tapex-features-poster.jpg'

/* ── "POWER REDEFINED" spec bar ─────────────────────────────────────────────
   Real T-APEX headline specs. Sits in the black gap as the film section opens;
   the figures count up during its timed entrance, then the whole bar fades
   out as the video plate grows. */
const POWER_STATS = [
  { to: 120, unit: 'm', label: 'Cable Length' },
  { to: 40, unit: 'kgf', label: 'Continuous Resistance' },
  { to: 300, unit: 'kgf', label: 'Load Capacity' },
  { to: 20, unit: 'kg', label: 'Machine Weight' },
] as const

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** How much of the section's scroll the spec bar and the headline take to
    clear once their entrance has finished. See COPY EXIT below. */
const COPY_FADE_SPAN = 0.14

/** How much of the section's scroll the plate takes to grow from its opening
    size to near-full-bleed, and the point in the section the growth must be
    finished by. 0.75 — the shipped figure — not 1.0: the sticky stage begins
    sliding off at 0.90 of the section's own progress, and the full-bleed frame
    is the payoff, so it has to land with room to be looked at. At 0.75 it holds
    for ~190px of pinned scroll; at 0.85 that fell to ~60px and the film reached
    full size just as it started to leave. MIN_ROOM is the least scroll the
    growth will accept: past that there is not enough section left, and the
    entrance finishes the move on the clock instead. See STAGE ANCHOR below. */
const EXPAND_SPAN = 0.75
const EXPAND_DONE_BY = 0.75
const MIN_ROOM = 0.25

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

function PowerStatsBar({
  style,
  countProgress,
}: {
  style?: { opacity?: MotionValue<number> }
  countProgress?: MotionValue<number>
}) {
  // A constant fallback so the static / reduced-motion branch shows the final
  // figures immediately (progress pinned at 1).
  const fallback = useMotionValue(1)
  const progress = countProgress ?? fallback
  return (
    <motion.div style={style} className="relative w-full max-w-[1500px] mx-auto">
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
    // On phones the growth begins as the section reaches the MIDDLE of the screen
    // (not the top), so the film no longer feels like it kicks in way too late.
    offset: isMobile ? ['start 50%', 'end 85%'] : ['start start', 'end 85%'],
  })

  const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const countProgress = useMotionValue(0)

  /* ── STAGE ANCHOR — the entrance owns where the scroll-linked stage begins ──
     Everything here used to hang off raw section progress on fixed windows:
     the plate grew over 0→0.75, the spec bar faded over 0.28→0.42, the
     headline over 0.2→0.4. The ENTRANCE, though, runs on a real clock — the
     headline does not start moving until two seconds in, the film until three —
     and scroll does not wait for it. Arrive quickly and the section was already
     past every one of those windows before its own cues fired: the headline
     faded out before it was due to fade in and never appeared at all, and the
     film rose into a plate that had already grown to full-bleed underneath it,
     stranding the copy on top of the picture.

     So the stage is anchored to the entrance instead of to the section:

       • `expand` — the plate's growth — starts from wherever the reader is when
         the film rises in, and finishes by EXPAND_DONE_BY, never faster than
         the original EXPAND_SPAN. Arrive slowly and the anchor is near zero,
         which is the shipped curve unchanged; arrive fast and the film still
         opens small under the headline and grows as you keep going. Arrive so
         fast that less than MIN_ROOM of the section is left, and the entrance
         plays the rest of the move on the clock rather than stranding the film
         at its opening size — the full-bleed frame always lands.
       • `copyOpacity` — the bar and the headline — starts clearing from
         wherever the reader is when the entrance FINISHES, over the next
         COPY_FADE_SPAN.

     However fast you scroll, the beats always land in order and in full, and
     the copy always clears the picture rather than sitting on it. Speed moves
     where each exit begins, never whether it happens. Phones never fade this
     copy at all — there the plate sits below it in flow rather than growing
     over it. */
  const expand = useMotionValue(0)
  const copyOpacity = useMotionValue(1)
  const stageAnchor = useRef(-1)
  const fadeAnchor = useRef(-1)
  // The clock's share of the move, used only when scroll has run out (see above).
  // It never fights scroll: whichever is further through the move wins.
  const clock = useRef(0)

  const syncStage = useCallback((p: number) => {
    const a = stageAnchor.current
    let e = 0
    if (a >= 0) {
      // The film has risen in, so the growth reads from its anchor. Before that
      // it is held at its opening size — and it is invisible, so there is
      // nothing to snap when the anchor lands.
      const span = Math.min(EXPAND_SPAN, Math.max(MIN_ROOM, EXPAND_DONE_BY - a))
      e = clamp01((p - a) / span)
    }
    expand.set(Math.max(e, clock.current))

    const f = fadeAnchor.current
    const scrolled = f < 0 || isMobile ? 1 : 1 - clamp01((p - f) / COPY_FADE_SPAN)
    // The copy leads the film out: it is gone by the time the plate is 45 %
    // grown, so the picture is never worn as a background for the headline.
    copyOpacity.set(isMobile ? 1 : Math.min(scrolled, 1 - clamp01(clock.current / 0.45)))
  }, [expand, copyOpacity, isMobile])

  useMotionValueEvent(scrollYProgress, 'change', syncStage)

  // The plate grows from a small centred card to near-full-bleed.
  const width = useTransform(expand, [0, 1], isMobile ? ['74vw', '92vw'] : ['32vw', '92vw'])
  const radius = useTransform(expand, [0, 1], ['2px', '0px'])
  const veil = useTransform(expand, [0, 0.93], [0.55, 0])
  // Video + its title ride lower in the stage early on — clearing the spec bar so
  // it no longer squashes onto the plate on phones — then settle to centre as the
  // plate expands toward full-bleed.
  const plateShiftN = useTransform(expand, [0, 0.67], isMobile ? [16, 0] : [10, 0])
  const plateShift = useTransform(plateShiftN, (v) => `${v}svh`)

  // A real clock owns the entrance: wheel speed cannot shorten the two-second
  // interval, and nothing is pinned or intercepted to buy that time. Scroll
  // still owns the expansion and the exits — it is only WHERE they start that
  // the entrance now dictates (see STAGE ANCHOR).
  useGSAP(() => {
    if (reduce || !sectionRef.current) return
    const count = { value: 0 }
    const tick = { v: 0 }
    // Both anchors are taken at the reader's current position — see STAGE ANCHOR.
    const armExpand = () => {
      const p = scrollYProgress.get()
      stageAnchor.current = p
      // Outran the section? Nothing is left to grow into, so hand the rest of
      // the move to the clock. gsap.killTweensOf keeps a re-entry from stacking.
      gsap.killTweensOf(tick)
      tick.v = clock.current = 0
      if (p > EXPAND_DONE_BY - MIN_ROOM) {
        gsap.to(tick, {
          v: 1, duration: 1.6, ease: 'power2.inOut',
          onUpdate: () => { clock.current = tick.v; syncStage(scrollYProgress.get()) },
        })
      }
      syncStage(p)
    }
    const armExit = () => { fadeAnchor.current = scrollYProgress.get(); syncStage(fadeAnchor.current) }
    // `opened` = the film is already open behind the reader (they are coming
    // back up from below), so BOTH anchors go to zero and the whole stage reads
    // straight off section progress again — the original shipped behaviour,
    // which scrubs back down with them. The clock is always cleared: leaving it
    // latched at 1 would pin the plate full-bleed and it could never shrink.
    const reset = (opened: boolean) => {
      gsap.killTweensOf(tick)
      tick.v = clock.current = 0
      stageAnchor.current = opened ? 0 : -1
      fadeAnchor.current = opened ? 0 : -1
      syncStage(scrollYProgress.get())
    }

    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: armExit })
      .fromTo('.film-stats', { autoAlpha: 0, y: () => window.innerHeight * 0.7 },
        { autoAlpha: 1, y: 0, duration: 1.2 }, 0)
      .to(count, { value: 1, duration: 1.2, onUpdate: () => countProgress.set(count.value) }, 0)
      .fromTo('.film-title', { autoAlpha: 0, y: 90 },
        { autoAlpha: 1, y: 0, duration: 1.2 }, 2)
      // The film comes in LAST, and it rises rather than simply appearing: the
      // entrance reads as three stacked beats — the figures, the headline, then
      // the picture climbing into place under it.
      .fromTo('.film-plate-wrap', { autoAlpha: 0, y: () => (window.innerWidth < 768 ? 80 : 140) },
        { autoAlpha: 1, y: 0, duration: 1.3, onStart: armExpand }, 3.2)
      .fromTo('.film-cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 3.6)

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      onEnter: () => { reset(false); intro.play(0) },
      // Coming back up from below: the film is already open, so the stage reads
      // straight off section progress and scrubs back down with the reader.
      onEnterBack: () => { intro.progress(1); reset(true) },
      onLeaveBack: () => { intro.pause(0); countProgress.set(0); reset(false) },
    })
  }, { scope: sectionRef, dependencies: [reduce, isMobile], revertOnUpdate: true })

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
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center gap-[2svh]"
        style={{ height: isMobile ? '66svh' : '100svh' }}
      >
        {/* POWER REDEFINED spec bar. Desktop: an overlay near the top of the
            stage. Phones: sits in normal flow so the video stacks flush directly
            beneath it — bar above, video below, never overlapping — on every
            screen size (the bar's height varies, so flow keeps the gap honest). */}
        <motion.div
          className={
            isMobile
              ? 'relative w-full px-4 z-30 flex justify-center pointer-events-none'
              : 'absolute top-[9%] inset-x-0 z-30 px-4 flex justify-center pointer-events-none'
          }
          style={{ opacity: copyOpacity }}
        >
          <div className="film-stats w-full" style={{ opacity: 0, visibility: 'hidden' }}>
            <PowerStatsBar countProgress={countProgress} />
          </div>
        </motion.div>

        {/* Title — ONE line, same max size as the scroll-cinema titles. On phones
            it sits in flow between the bar and the video; on desktop it's an
            overlay just under the bar. Its timed entrance starts two seconds
            after the bar, then both yield to the expanding film on desktop. */}
        <motion.div
          className={
            isMobile
              ? 'relative w-full px-4 z-20 flex justify-center pointer-events-none'
              : 'absolute inset-x-0 top-[24%] z-20 px-4 flex justify-center pointer-events-none'
          }
          style={{ opacity: copyOpacity }}
        >
          <h2 className="film-title h-luxia leading-none text-center whitespace-nowrap" style={{ opacity: 0, visibility: 'hidden', fontSize: 'clamp(15px, 4.8vw, 66px)', letterSpacing: '0.04em' }}>
            <span className="t-silver">&ldquo;PERFORMANCE BECOMES </span>
            <span className="t-red">INEVITABLE.&rdquo;</span>
          </h2>
        </motion.div>

        {/* The growing video plate. Desktop: centred, rides plateShift out to
            near-full-bleed. Phones: sits in flow directly under the spec bar and
            grows downward, stopping just below the bar at full size. */}
        {/* Two libraries, one element each. GSAP owns the OUTER wrapper (the
            entrance rise); Framer owns the plate inside it (the scroll-linked
            width / radius / shift). Both writing `transform` on the same node
            is a fight, and the loser is whichever wrote first that frame. */}
        <div className="film-plate-wrap relative z-10" style={{ opacity: 0, visibility: 'hidden' }}>
          <motion.div
            className="relative overflow-hidden"
            style={{
              width,
              aspectRatio: '16 / 9',
              maxHeight: '82svh',
              borderRadius: radius,
              ...(isMobile ? {} : { y: plateShift }),
            }}
          >
            <div
              className="absolute inset-0 border border-apex-line/60 bg-apex-black-2"
              style={{ boxShadow: '0 30px 90px -20px rgba(0,0,0,0.8)' }}
            >
              <VideoPlate
                videoRef={videoRef}
                playing={playing}
                onPlay={play}
                veil={veil}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue — fades out as soon as the expansion starts */}
        <motion.div
          className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ opacity: cueOpacity }}
          aria-hidden="true"
        >
          <span className="film-cue font-mono text-[9px] tracking-[0.3em] uppercase text-apex-grey-dim" style={{ opacity: 0, visibility: 'hidden' }}>
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

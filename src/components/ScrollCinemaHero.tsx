'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'
import Lightning from './ui/Lightning'
import { DEMO_HREF } from '@/lib/site'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── Scroll-cinema hero ───────────────────────────────────────────────────────
// A pinned, scroll-scrubbed cinematic banner staged in four acts:
//
//   ACT 0  HOLD    black frame, the headline alone, a bolt of electricity
//                  running behind it — no film yet.
//   ACT 1  SPLIT   the headline parts (TRAIN BEYOND ↑ / HUMAN LIMITS ↓) and the
//                  film opens out of the seam between them (clip-path aperture
//                  + fade), so the video is literally revealed BY the split.
//   ACT 2  TRAVEL  the frame sequence scrubs to scroll while the camera pushes
//                  in; the split halves stay top/bottom framing the film, then
//                  clear so the panels-open reveal owns the screen.
//   ACT 3  RESOLVE the device settles hero-lit; closing line + CTAs land.
//
// Frames are a pre-extracted WebP sequence (buttery, no <video> stutter). Swap
// the footage by dropping a new numbered sequence into /public/hero-frames and
// updating the desktop `frameCount` below (see docs/motion-scroll-brief.md).
//
// ── Phones get the same film ─────────────────────────────────────────────────
// The cut used to be desktop-only, and phones fell back to <Hero/> over a 13 MB
// looping banner video — the single heaviest thing on the mobile site, loaded
// through two stacked <video> elements. The scroll-cinema now runs there too,
// off a separate sequence (/hero-frames-mobile) that is half the frames at
// 640×360 — 2.8 MB all in, and only the first dozen frames gate the start.
// So mobile gained the motion AND got several times lighter.
//
// The one thing that could NOT come across is the framing. The footage is 16:9
// and a phone is roughly 9:19.5, so cover-fitting it would show a ~26 % wide
// slice of every shot — the fly-through and the sprint would both be cropped to
// nothing. Mobile therefore fits the film to the *width* (see FIT below) and
// plays it as a band across the middle of a black screen, which is where the
// headline splits apart anyway: the type parts, the band opens in the seam. Same
// four acts, same beats, framed for the device instead of cropped for it.
//
// Still falls back to the classic <Hero /> under `prefers-reduced-motion` or
// Data Saver — a 300-frame preload is exactly what those settings ask you not
// to do.

type CinemaConfig = {
  frameCount: number
  framePath: (i: number) => string
  /** Frames that must decode before scrubbing may begin. Act 0 is black + type,
   *  so it doubles as the loader. */
  readyFrames: number
  /** How far (in px of scroll) the hero stays pinned. */
  pinDistance: string
  /** 'cover' crops the film to fill the screen; 'width' fits it across the
   *  screen as a band, letterboxed into black. */
  fit: 'cover' | 'width'
  /** Multiplier on the fitted size before the camera push is applied. Lets the
   *  phone's band read bigger than a strict fit-width without cropping the
   *  subject out of frame. */
  baseScale: number
  /** How far the two headline halves travel apart, as a fraction of viewport
   *  height. Resolved at refresh so it survives rotation. */
  splitTravel: number
  /** Cap on the canvas backing-store DPR. */
  maxDpr: number
  /**
   * ScrollTrigger scrub — seconds the film takes to catch up with the scroll.
   * Higher is smoother but trails your finger, so it is set per device rather
   * than shared: Lenis smooths the wheel on desktop but deliberately leaves
   * touch to the platform, so the phone has no interpolation upstream and wants
   * more of it here.
   */
  scrub: number
  /**
   * How far the opening copy sits above true centre, as a fraction of viewport
   * height. Must match `--cine-copy-shift` in globals.css: the CSS moves the
   * headline, this moves the film's aperture with it so the shot still opens
   * out of the seam between the two halves rather than from the middle of a
   * screen the headline has left.
   */
  copyShift: number
}

/** The closed aperture — a zero-height slit sitting on the headline's seam. */
function apertureSlit(copyShift: number) {
  const top = 50 - copyShift * 100
  return `inset(${top}% 0% ${100 - top}% 0%)`
}

const DESKTOP: CinemaConfig = {
  frameCount: 318,
  framePath: (i) => `/hero-frames/frame-${String(i).padStart(3, '0')}.webp`,
  // The gate is deliberately low. A frame that hasn't decoded holds the previous
  // one rather than flashing black, so arming early costs nothing visually — and
  // the alternative is a hero that ignores your scroll while 2.7 MB lands.
  readyFrames: 18,
  // ~15px of scroll per frame on average, but that budget is spent unevenly —
  // see ACT SCRUB below.
  pinDistance: '+=4800',
  fit: 'cover',
  baseScale: 1,
  splitTravel: 0.34,
  // Capped at 1.5 rather than 2. Frames are 1600×900, so on a standard 1080p
  // desktop (DPR 1) the canvas is already pixel-for-pixel with the source. Above
  // that we're upscaling regardless — and a 2× backing store on a large retina
  // display pushes 4× the pixels to show detail the frame doesn't have. That
  // fill rate is better spent on framerate, which is smoothness.
  maxDpr: 1.5,
  // Tight, because <SmoothScroll/> (Lenis) already interpolates the wheel. A big
  // scrub on top of that stacks two lags and the film trails the page.
  scrub: 0.35,
  // Desktop has the width to carry an honestly-centred block.
  copyShift: 0,
}

const MOBILE: CinemaConfig = {
  // Every second frame of the desktop cut. Over a 3200px pin that is ~20px of
  // scroll per frame against the desktop's ~15 — and a phone's viewport is small
  // enough that the per-frame movement still reads as continuous.
  frameCount: 159,
  framePath: (i) => `/hero-frames-mobile/frame-${String(i).padStart(3, '0')}.webp`,
  // ~200 KB before the film can start moving, and the first six of those are
  // already in flight from the HTML preloads (see layout.tsx).
  readyFrames: 12,
  // Shorter than desktop: a thumb covers ground far faster than a wheel, and a
  // 4800px pin on a phone feels like the page has stopped responding.
  pinDistance: '+=3200',
  fit: 'width',
  // 1.35× fit-width — the band fills a good third of the screen and the machine
  // stays whole. Above ~1.5 the sprint shot starts losing the athlete.
  baseScale: 1.35,
  // Enough to clear the film band (≈296px tall at rest) without throwing the
  // type off the top of a short phone.
  splitTravel: 0.21,
  // The source is 640 wide and the band draws at ~526 CSS px, so 1.25 is already
  // a mild upscale; going higher only burns fill rate on a phone GPU for detail
  // the source does not have. (A 960-wide sequence would earn a cap of 2 — that
  // pairing lives on claude/tapex-motion-scroll-fix-izg5x9; both halves have to
  // land together or the canvas upscales twice.)
  maxDpr: 1.25,
  // Higher than desktop on purpose. Lenis leaves touch alone — momentum
  // scrolling fights any JS smoothing layered on top of it — so nothing
  // upstream is interpolating a finger drag, and the scrub is the only place
  // that can soften the platform's own scroll cadence. 0.5 is about as far as
  // it goes before the film visibly trails your thumb.
  scrub: 0.5,
  // Keep in step with `--cine-copy-shift` in globals.css.
  copyShift: 0.1,
}

// Camera push. The film opens on the machine sitting a long way back down the
// lens — the plate behind it is pure black, so drawing the frame under 1.0 puts
// black around it and reads as distance, not as a shrunken video. It flies in to
// full frame as the panels open, then keeps a whisper of drift across the travel.
const ZOOM_START = 0.34
const ZOOM_OPEN = 1.0
const ZOOM_END = 1.1
// Carried on through the closing act — see the tail note in the timeline.
const ZOOM_TAIL = 1.17

// ── ACT SCRUB — where the scroll budget is spent ─────────────────────────────
// Fractions of the sequence, and the share of the pinned scroll each act gets.
// The opening is deliberately the slowest: it's the hero shot, and at a flat
// rate it flashed past in a fifth of the scroll. Now it takes a third, so the
// machine has room to travel in, turn, and open.
//
//   act        frames     scroll     px/frame
//   opening      0– 19%     34%        ~24   ← the hero shot, given room
//   internals   19– 58%     26%        ~10
//   tunnel      58– 71%     10%        ~11
//   sprint      71–end      30%        ~13
//
// Expressed as ratios so the mobile sequence — half the frames, same cut — lands
// its act boundaries on exactly the same moments of the film.
// How long Act 0 holds before anything moves, as a fraction of the pinned
// scroll. ~215px on desktop's 4800px pin: the second wheel notch. See the map
// below — this number has been tuned from both directions.
const HOLD = 0.045

// Progress past which the bolt's shader is switched off. It is fully faded by
// ~0.16; the margin is so a small scroll back up does not strobe it.
const BOLT_OFF = 0.2

const ACT_OPEN_END = 59 / 318
const ACT_INNER_END = 185 / 318
const ACT_TUNNEL_END = 227 / 318

// ── Where the cut's content sits, as scroll progress ─────────────────────────
// The film scrubs 0.10 → 0.97, act by act (see ACT SCRUB above):
//
//   0–HOLD     ACT 0 holds: black, the brand mark, the headline whole, the bolt
//              running behind it. Nothing else moves.
//
//              HOLD is the one number that decides whether the opening reads as
//              composed or as broken, and it has been wrong in both directions.
//              At 0.10 (480px, five wheel notches) the page felt dead on
//              arrival; cut to 0.03 the split was already underway before you
//              had seen the headline. It is now 0.045 — about 215px, so the
//              type parts on the SECOND notch — and the reason that can be this
//              short without feeling abrupt is that Act 0 is no longer still:
//              the bolt is alive from the first pixel, so the hold reads as a
//              charge rather than as a stall.
//   HOLD–0.40  the machine on pure black — deep down the lens, travelling in and
//              turning, then ✦ THE PANELS OPEN and the internals light. This is
//              the hero shot and it owns a third of the scroll; the headline
//              halves clear at 0.26 so nothing sits on top of the opening.
//   0.40–0.63  fly-through: cable spool, motor, gears, circuit macro, chip
//   0.63–0.72  the red grid tunnel, which opens onto the track
//   0.72–0.97  the sprint — the promise lands centre-frame at 0.74 and clears at
//              0.87 so the machine alone closes the shot, CTAs at 0.92
//
// The read we're protecting is ONE continuous shot: you watch the box, then that
// box opens, then you fly through the thing you just watched open.
//
// The opening is near-black; everything after it is bright, so `.cine-dim` is
// scheduled like a lighting cue — it lifts under every copy beat and drops away
// between them, letting the film play at full strength exactly when nothing is
// written over it.
//
// The sprint footage is the generation as delivered — do NOT try to "fix" the
// machine's apparent drag with a whole-frame stabilise. It cannot work, and it
// makes things much worse; the measurement is in docs/motion-scroll-brief.md.

const STATS = [
  { k: 'Force', v: '412', u: 'N' },
  { k: 'Velocity', v: '9.6', u: 'm/s' },
  { k: 'Response', v: '<2', u: 'ms' },
  { k: 'Control', v: '100', u: '%' },
]

function Stat({
  k,
  v,
  u,
  align,
}: {
  k: string
  v: string
  u: string
  align: 'left' | 'right' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'text-center' : undefined}>
      <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-apex-grey-dim mb-2">
        {k}
      </div>
      <div className="font-display font-black text-apex-white leading-none text-3xl sm:text-4xl xl:text-5xl">
        {v}
        <span className="text-apex-blue text-sm xl:text-lg ml-1 align-top">{u}</span>
      </div>
      <div
        className={`mt-3 h-px w-12 ${
          align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
        }`}
        style={{
          background:
            align === 'left'
              ? 'linear-gradient(270deg,transparent,rgba(0,174,239,0.7))'
              : 'linear-gradient(90deg,transparent,rgba(0,174,239,0.7))',
        }}
      />
    </div>
  )
}

/**
 * The size of Act 0's two small labels — the eyebrow above the headline and the
 * scroll cue at the foot of the screen. One constant because they are a matched
 * pair and must never drift apart; see the note at the eyebrow for why it is a
 * clamp rather than a breakpoint pair.
 */
const CINE_LABEL_SIZE = 'clamp(9.5px, 3vw, 14px)'

/**
 * ACT 0 — black plate, eyebrow, split headline, scroll cue.
 *
 * Shared by the live cinema and by the pre-hydration still below, so the two are
 * the same markup and the handover is invisible. Do not let them drift.
 */
function ActZero() {
  return (
    <>
      <div
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{ transform: 'translateY(calc(-1 * var(--cine-copy-shift, 0px)))' }}
      >
        <div className="w-full max-w-[1000px] flex flex-col items-center">
          {/* Brand mark. Sits in the exported HTML (see OpeningStill), so the
              preload scanner finds it without waiting for JavaScript. Clears
              with the eyebrow the moment the split starts.

              Its own asset, not the navbar's: that file is 2528x1696 of which
              the logo occupies a 2093x555 band in the middle, so sizing it by
              height gave a box four times taller than the ink and the mark read
              as tiny. This one is cropped to the ink (900x239, and 26 KB rather
              than 69 KB), so a width is a width. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tapex-logo-hero.webp"
            alt="T-APEX Australia"
            width={900}
            height={239}
            className="cine-logo mb-6 sm:mb-7 w-[136px] sm:w-[158px] lg:w-[196px] h-auto"
            style={{ filter: 'brightness(1.08)' }}
            decoding="async"
          />

          <div className="cine-eyebrow mb-5 sm:mb-6 flex items-center justify-center gap-1 sm:gap-3">
            {/* Wider than the old w-5 so the scanning pulse has room to read */}
            <div className="cine-tele-line w-3 sm:w-10 h-px" />
            {/* CINE_LABEL_SIZE — shared with the scroll cue below so the hero's
                two small labels always read at exactly the same size. It is a
                clamp rather than a breakpoint pair because the eyebrow is 35
                characters of tracked mono between two rules: on a 320px screen
                anything above ~10px wraps. vw-bound, it fills the line at every
                width and tops out at 14px. */}
            <span
              className="text-apex-blue font-mono font-medium tracking-[0.08em] sm:tracking-[0.34em] uppercase whitespace-nowrap"
              style={{ fontSize: CINE_LABEL_SIZE }}
            >
              Elite Sports Performance Technology
            </span>
            <div className="cine-tele-line w-3 sm:w-10 h-px" />
          </div>

          {/* Sized from the viewport, and deliberately NOT from rem.

              The bounds used to be rem (2.4rem / 5.4rem) and that shipped
              broken: `rem` tracks the reader's default text size — iOS Larger
              Text, Safari's per-site page zoom — while the box around it is a
              px-padded viewport that does not move. At a 24px root the floor
              became 57.6px, the line needed 440px and the box was 318px, and
              because the words are &nbsp;-joined for the split they cannot
              wrap, only overflow. The headline ran clean off the side of the
              screen. px bounds make the size a pure function of viewport width,
              which is the only thing the container depends on too.

              (Pinch and browser zoom still scale it — those change the layout
              viewport, so vw moves with them. It is only the default-font-size
              preference that no longer applies, which is the right call for
              display type at this scale.)

              10vw, not more: Marcellus is `display: swap`, and measured on a
              375px screen the serif fallback runs 3px WIDER than the box at
              11vw, so every cold load would clip until the webfont landed. At
              10vw the fallback keeps ~20px of slack. */}
          <h1
            className="relative w-full h-luxia leading-[0.94]"
            style={{ fontSize: 'clamp(38px, 10vw, 86px)', letterSpacing: '0.045em' }}
          >
            <div className="split-top will-change-transform">
              <span className="t-silver">TRAIN&nbsp;BEYOND</span>
            </div>

            {/* The seam the film opens out of, pinned to the split line */}
            <div
              className="cine-seam absolute left-1/2 top-1/2 h-px w-[72vw] sm:w-[46vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                opacity: 0,
                background:
                  'linear-gradient(90deg,transparent,rgba(0,174,239,0.75),rgba(214,31,38,0.55),transparent)',
              }}
              aria-hidden="true"
            />

            <div className="split-bot will-change-transform">
              <span className="t-red">HUMAN&nbsp;LIMITS</span>
            </div>
          </h1>
        </div>
      </div>
    </>
  )
}

/**
 * The scroll cue that sits under Act 0. Shared for the same reason.
 *
 * It sat 24px off the bottom at 8px type and was hard to read and, worse, hard
 * to place: the hero is `100svh`, the *small* viewport height, so the moment
 * mobile Safari collapses its toolbar the visible area grows past the section
 * and the next one starts showing underneath. A cue pinned near the section's
 * bottom edge then reads as though it belongs to whatever is below it.
 *
 * `svh` is the right unit for a pinned section — `dvh` would resize the pin
 * mid-scroll and fight ScrollTrigger — so the fix is clearance instead: bigger
 * type, and far enough up that it stays unambiguously part of the hero however
 * much browser chrome is showing.
 */
function ScrollCue() {
  return (
    <div
      className="cine-cue absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 72px)' }}
    >
      <span
        className="text-apex-grey-dim font-mono tracking-[0.36em] uppercase"
        style={{ fontSize: CINE_LABEL_SIZE }}
      >
        Scroll to enter
      </span>

      {/* The pointer: a blue rail with a chevron tip, and a bright charge that
          runs down it and out through the tip. Two elements rather than one so
          the rail can hold a steady gradient while only the charge travels —
          a 1px bar being transformed (what this used to be) reads as nothing at
          all at this size. */}
      <div className="cine-cue-arrow relative w-3 h-11" aria-hidden="true">
        {/* Rail */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-8"
          style={{ background: 'linear-gradient(to bottom, rgba(0,174,239,0), rgba(0,174,239,0.75))' }}
        />
        {/* Travelling charge */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-8 overflow-hidden">
          <div
            className="cine-cue-pulse absolute inset-x-0 h-3"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,174,239,0), #7fe4ff)',
              boxShadow: '0 0 6px rgba(0,174,239,0.9)',
            }}
          />
        </div>
        {/* Chevron tip */}
        <svg
          className="cine-cue-tip absolute left-1/2 bottom-0 -translate-x-1/2"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M1 1L6 6.5L11 1"
            stroke="#00AEEF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0,174,239,0.7))' }}
          />
        </svg>
      </div>
    </div>
  )
}

/**
 * What the static export ships, and therefore what every visitor paints before
 * any JavaScript has run.
 *
 * It used to ship the classic <Hero/> — an entirely different hero, built around
 * a full-bleed photograph of a sprinter. On a phone that painted as a giant
 * crop of the athlete's arm, held for as long as hydration took, and was then
 * replaced by a black screen with a headline. A completely unrelated image
 * flashing up and vanishing reads as a broken page, and the photo was 144 KB
 * fetched purely to be thrown away.
 *
 * This is Act 0 instead: the same black plate, eyebrow and headline the cinema
 * opens on. The handover is now invisible — black to black, headline to
 * headline, in the same position — and nothing is downloaded for it. The <h1>
 * is still in the exported HTML, so the page reads the same to a crawler or a
 * JS-less browser.
 */
function OpeningStill() {
  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-apex-black">
      <div className="absolute inset-0 z-20">
        <ActZero />
      </div>
      <ScrollCue />
    </section>
  )
}

function CinemaImpl({ cfg, phone }: { cfg: CinemaConfig; phone: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [ready, setReady] = useState(false)
  // The bolt only exists in Act 0. Past the split it is fully faded out, and a
  // full-screen ten-octave noise shader nobody can see is pure heat — so the
  // render loop stops rather than being drawn under an opacity of 0.
  const [boltLive, setBoltLive] = useState(true)
  const boltLiveRef = useRef(true)

  // Mutable render state the scroll timeline drives; the draw loop reads it.
  const render = useRef({ frame: 0, scale: ZOOM_START }).current

  // ── Preload the sequence so scrubbing never waits on I/O ────────────────────
  //
  // Two details that decide how a cold load *feels*:
  //
  // 1. The opening frames are fetched at high priority and everything after
  //    them at low. All 318 used to go out as one undifferentiated burst, so
  //    frame 4 queued behind frame 200 — which nobody sees for another four
  //    thousand pixels of scroll. The tail still streams in during Act 0's
  //    black hold; it just stops competing with the frames that gate the start.
  //
  // 2. The ready gate counts the *first* N frames, not any N. Counting
  //    completions meant a scattered set of late frames could satisfy it while
  //    the opening was still in flight.
  useEffect(() => {
    let cancelled = false
    const pending = new Set<number>()
    for (let i = 1; i <= cfg.readyFrames; i++) pending.add(i)

    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= cfg.frameCount; i++) {
      const img = new Image()
      if ('fetchPriority' in img) {
        ;(img as HTMLImageElement & { fetchPriority: string }).fetchPriority =
          i <= cfg.readyFrames ? 'high' : 'low'
      }
      img.onload = img.onerror = () => {
        pending.delete(i)
        if (!cancelled && pending.size === 0) setReady(true)
      }
      img.src = cfg.framePath(i)
      imgs.push(img)
    }
    imagesRef.current = imgs
    return () => {
      cancelled = true
    }
  }, [cfg])

  /** Nearest decoded frame at or before `i`, so a gap never blanks the canvas. */
  const decoded = (i: number) => {
    const imgs = imagesRef.current
    if (i < 0 || i >= imgs.length) return null
    const img = imgs[i]
    return img && img.complete && img.naturalWidth ? img : null
  }

  /**
   * Keep the backing store matched to the element's own box.
   *
   * A canvas has TWO sizes: the pixel buffer (`width`/`height`) and the CSS box
   * it is painted into. If they disagree, the browser stretches the buffer to
   * fit — non-uniformly. That is what put a 16:9 frame on screen as a tall thin
   * smear: the buffer was still the 300x150 default while the box was a full
   * portrait viewport, so every frame was drawn correctly and then scaled 4x
   * harder vertically than horizontally. Blurry for the same reason.
   *
   * This used to be a `sizeCanvas()` called from a passive effect and a
   * `resize` listener — which meant it depended on effect ordering (useGSAP is
   * a *layout* effect, so its ticker could start drawing first) and on guessing
   * which window events change the element. It also deliberately ignored
   * height-only resizes on phones, which is exactly the class of change mobile
   * Safari produces. A ResizeObserver on the element removes all of that
   * guesswork: the buffer cannot be out of step at the moment it matters.
   *
   * The measurement is taken IN the observer (and once up front), not on every
   * draw. Reading `clientWidth` is a forced layout, and doing that from the
   * ticker while ScrollTrigger is writing pin styles on the same frame is a
   * read-after-write every frame of the scrub — measurably the jerkiest thing
   * in the loop. The observer already fires for every box change there is, so
   * the cached box cannot go stale; nothing is lost by trusting it.
   *
   * Returns false when the element has no layout yet — nothing safe to draw.
   */
  const boxRef = useRef({ w: 0, h: 0 })

  /** Re-measure the element's CSS box. Only call outside the draw loop. */
  const measureCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    boxRef.current = { w: canvas.clientWidth, h: canvas.clientHeight }
  }

  const syncCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return false
    if (!boxRef.current.w || !boxRef.current.h) measureCanvas()
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr)
    const w = Math.round(boxRef.current.w * dpr)
    const h = Math.round(boxRef.current.h * dpr)
    if (!w || !h) return false
    // Assigning width/height clears the canvas, so only touch it on a real change.
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    return true
  }

  // ── Canvas draw — fit the active frame, scaled for the push-in ──────────────
  const draw = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (!syncCanvasSize()) return

    // ── One frame, nearest ────────────────────────────────────────────────────
    // NOT a cross-dissolve between the two adjacent frames. That was tried, on
    // the theory that blending by the scrub's fractional position reads as motion
    // blur. It does not — it reads as the film being out of focus. The frame
    // value is fractional almost all of the time (Lenis interpolates the wheel,
    // so it is rarely sitting exactly on an integer), which means the picture is
    // a ~50/50 double-exposure of two different moments for most of the scrub:
    // every hard edge doubles, and 22 MB of sharp frames arrive on screen soft.
    // The same trap is documented for video in docs/motion-scroll-brief.md —
    // frame blending to smooth motion always ghosts. Draw the nearest real frame.
    const f = Math.min(Math.max(render.frame, 0), cfg.frameCount - 1)
    const ref = decoded(Math.round(f)) ?? decoded(Math.floor(f))
    // Nothing decoded yet — hold whatever is on the canvas rather than flashing.
    if (!ref) return

    // The frames are upscaled, so resampling quality is doing real work here —
    // the cheap default sampler is a visible part of the softness.
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const cw = canvas.width
    const ch = canvas.height
    const ir = ref.naturalWidth / ref.naturalHeight
    const cr = cw / ch
    let dw: number
    let dh: number
    if (cfg.fit === 'width' || ir <= cr) {
      // Fit across the canvas width. On a portrait phone this is what keeps the
      // whole composition on screen instead of showing a narrow centre slice.
      dw = cw
      dh = cw / ir
    } else {
      dh = ch
      dw = ch * ir
    }
    const s = render.scale * cfg.baseScale
    dw *= s
    dh *= s
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(ref, dx, dy, dw, dh)

    // Melt the band's horizontal edges into the page.
    //
    // Desktop fills the screen so it has no edges to worry about. The phone
    // plays the film as a band with black above and below, and a hard cut at
    // each edge reads as a video rectangle pasted onto the page — the one thing
    // that gave the mobile cut away. Fading in the canvas (rather than with an
    // overlay element) means the fade tracks the band as the camera pushes in,
    // which no fixed CSS gradient could do.
    if (dh < ch - 1) {
      const fade = Math.max(18, dh * 0.09)
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'

      const top = ctx.createLinearGradient(0, dy, 0, dy + fade)
      top.addColorStop(0, 'rgba(0,0,0,1)')
      top.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = top
      ctx.fillRect(0, dy, cw, fade)

      const bot = ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh)
      bot.addColorStop(0, 'rgba(0,0,0,0)')
      bot.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = bot
      ctx.fillRect(0, dy + dh - fade, cw, fade)

      ctx.restore()
    }
  }

  // ── Repaint whenever the canvas's own box changes ────────────────────────────
  // A ResizeObserver on the element rather than a `resize` listener on the
  // window: the box can change without the window doing anything (ScrollTrigger
  // pinning it, a rotation, the URL bar reflowing the section) and the window
  // can change without the box moving. `draw()` re-syncs the buffer itself, so
  // this only has to say "something moved, repaint".
  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    measureCanvas()
    draw()
    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => {
        measureCanvas()
        draw()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
    const ro = new ResizeObserver(() => {
      measureCanvas()
      draw()
    })
    ro.observe(canvas)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // ── The scroll-driven timeline ───────────────────────────────────────────────
  useGSAP(
    () => {
      if (!ready) return

      const travel = () => window.innerHeight * cfg.splitTravel
      const last = cfg.frameCount - 1
      const f = (ratio: number) => Math.round(ratio * last)

      // ── Render on the ticker, not on scroll events ───────────────────────────
      // `scrub` animates render.frame on GSAP's ticker, but draw() was only
      // called from ScrollTrigger's onUpdate, which fires on *scroll events*. So
      // the moment you lifted your finger the value carried on easing while the
      // canvas stopped redrawing — the film froze and then jumped on the next
      // event. Drawing from the ticker puts the canvas on the same clock as the
      // value driving it (and as Lenis — see SmoothScroll.tsx), so the easing
      // tail plays out at display refresh rate instead of being skipped.
      //
      // Guarded so an idle hero isn't repainting sixty times a second.
      let lastFrame = -1
      let lastScale = -1
      const tick = () => {
        if (render.frame === lastFrame && render.scale === lastScale) return
        lastFrame = render.frame
        lastScale = render.scale
        draw()
      }
      gsap.ticker.add(tick)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: cfg.pinDistance,
          pin: true,
          scrub: cfg.scrub,
          invalidateOnRefresh: true,
          // Stop the bolt's shader once it is off screen, and start it again on
          // the way back up. Flipped through a ref so this only calls setState
          // on the crossing, not on every scroll frame.
          onUpdate: (self) => {
            const live = self.progress < BOLT_OFF
            if (live !== boltLiveRef.current) {
              boltLiveRef.current = live
              setBoltLive(live)
            }
          },
        },
      })

      // ── The bed — frame scrub + camera push run under everything ─────────────
      // Scrubbed act by act rather than at one flat rate, so the opening hero
      // shot gets a third of the scroll instead of a fifth. Each leg is still
      // linear (ease 'none' from defaults) — the rate changes only at the act
      // boundaries, which fall on cuts, so no leg visibly speeds up mid-shot.
      tl.to(render, { frame: f(ACT_OPEN_END), duration: 0.3 + (0.1 - HOLD) }, HOLD)
      tl.to(render, { frame: f(ACT_INNER_END), duration: 0.23 }, 0.4)
      tl.to(render, { frame: f(ACT_TUNNEL_END), duration: 0.09 }, 0.63)
      // Runs to 1.0, not to 0.97. The footage ends with the athlete still
      // half in frame (it was trimmed there), so parking the last frame three
      // per cent early left a visible freeze at the bottom of the pin — the
      // sprint stopping dead under the CTAs. Scrubbing to the very end means
      // the film is still moving as you reach the release, and the still frame
      // only exists once the hero unpins and leaves. The real fix is footage
      // that lets him run out of frame; see docs/motion-scroll-brief.md §2.
      tl.to(render, { frame: last, duration: 0.28 }, 0.72)

      // The machine flies in from deep in the lens and lands at full frame just
      // as the panels open; the rest is the slow push across the travel.
      // 'in', not 'out' — the machine must HOLD its distance while the headline
      // is still on screen and only close the gap at the end of the act. An
      // 'out' ease front-loads the travel and it arrives on top of the type.
      tl.to(render, { scale: ZOOM_OPEN, ease: 'power2.in', duration: 0.3 + (0.1 - HOLD) }, HOLD)
      tl.to(render, { scale: ZOOM_END, duration: 0.57 }, 0.4)
      // A last whisper of push across the close, so the resolve keeps breathing
      // even on the frames where the footage itself has almost stopped moving.
      tl.to(render, { scale: ZOOM_TAIL, duration: 0.28 }, 0.72)

      // ── ACT 0 — the charge ───────────────────────────────────────────────────
      // The bolt is at full strength for the hold, then travels UP and out as
      // the headline parts — the charge leaving with the type rather than
      // simply switching off. It clears well before the film's aperture is
      // open, so the two never overlap on screen.
      // Fades UP on arrival rather than being switched on: the static export
      // paints a black plate with no bolt in it (see OpeningStill), so without
      // this the charge would pop into existence the moment the frames finish
      // decoding. `immediateRender: false` on the scrub tween below is what
      // lets this one own the opacity until the split actually starts.
      gsap.fromTo(
        '.cine-bolt',
        { opacity: 0 },
        { opacity: 0.55, duration: 1.1, ease: 'power1.out' },
      )
      tl.fromTo(
        '.cine-bolt',
        { opacity: 0.55, y: 0 },
        {
          opacity: 0,
          y: () => -window.innerHeight * 0.3,
          ease: 'power1.in',
          duration: 0.11,
          immediateRender: false,
        },
        HOLD,
      )

      // ── ACT 1 — the split ────────────────────────────────────────────────────
      // Logo and eyebrow clear first so the words are alone as they part.
      tl.to('.cine-logo, .cine-eyebrow', { opacity: 0, y: -18, duration: 0.05 }, HOLD - 0.02)

      // The two halves travel apart, tracking wider as they go — the type reads
      // as being pulled open rather than simply moved.
      //
      // 'out', not 'inOut': an inOut ease leaves the split at near-zero velocity
      // for its first several percent, so even starting at 0.03 the words still
      // crept and the page read as unresponsive. An out-ease breaks them apart on
      // contact and settles into the travel.
      tl.to(
        '.split-top',
        { y: () => -travel(), letterSpacing: '0.13em', ease: 'power2.out', duration: 0.26 },
        HOLD,
      )
      tl.to(
        '.split-bot',
        { y: () => travel(), letterSpacing: '0.13em', ease: 'power2.out', duration: 0.26 },
        HOLD,
      )

      // The seam: a blue hairline that opens across the gap, then dims away.
      tl.fromTo(
        '.cine-seam',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: 'power2.out', duration: 0.15 },
        HOLD,
      )
      tl.to('.cine-seam', { opacity: 0, duration: 0.11 }, 0.24)

      // The film opens out of the seam — aperture unclips vertically as it fades
      // up, so the video is revealed *by* the headline splitting.
      tl.fromTo(
        '.cine-aperture',
        { clipPath: apertureSlit(cfg.copyShift), opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          ease: 'power2.out',
          duration: 0.26,
        },
        HOLD,
      )

      // Scroll cue clears as the split begins.
      tl.to('.cine-cue', { opacity: 0, duration: 0.05 }, HOLD - 0.015)

      // ── ACT 2 — travel ───────────────────────────────────────────────────────
      // Tunnel vignette breathes in over the fly-through, then eases back for the
      // resolve so the closing hero shot isn't crushed at the edges.
      tl.fromTo('.cine-tunnel', { opacity: 0 }, { opacity: 0.8, duration: 0.22 }, 0.4)
      tl.to('.cine-tunnel', { opacity: 0.4, duration: 0.1 }, 0.72)

      // The split halves clear BEFORE the panels-open reveal — that shot is the
      // centrepiece and nothing sits on top of it.
      tl.to('.split-top', { opacity: 0, y: () => -travel() - 60, duration: 0.08 }, 0.26)
      tl.to('.split-bot', { opacity: 0, y: () => travel() + 60, duration: 0.08 }, 0.26)

      // Telemetry HUD — lands over the fly-through (circuits, spool, gears),
      // which is where a live instrument readout actually means something.
      tl.fromTo(
        '.beat-2',
        { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.09 },
        0.46,
      )
      tl.to('.beat-2', { opacity: 0, scale: 1.05, filter: 'blur(6px)', duration: 0.07 }, 0.6)

      // ── ACT 3a — the promise, over the sprint ────────────────────────────────
      // Lands as the sprinter comes into frame, holds while he runs, then clears
      // so the machine alone closes the shot.
      tl.fromTo(
        '.beat-sprint',
        { opacity: 0, y: 34, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.05 },
        0.74,
      )
      tl.to('.beat-sprint', { opacity: 0, y: -22, filter: 'blur(6px)', duration: 0.05 }, 0.87)

      // ── ACT 3b — resolve / CTA ───────────────────────────────────────────────
      tl.fromTo(
        '.beat-3',
        { opacity: 0, y: 56, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.06 },
        0.92,
      )

      // ── The lighting cue ─────────────────────────────────────────────────────
      // `.cine-dim` lifts under each copy beat and drops between them, so the
      // film plays at full strength exactly when nothing is written over it.
      tl.to('.cine-dim', { opacity: 0.16, ease: 'power1.inOut', duration: 0.1 }, HOLD) // machine far back — barely needed
      tl.to('.cine-dim', { opacity: 0.04, ease: 'power1.inOut', duration: 0.07 }, 0.28) // ✦ the box opens — clear
      tl.to('.cine-dim', { opacity: 0.46, ease: 'power1.inOut', duration: 0.07 }, 0.46) // telemetry
      tl.to('.cine-dim', { opacity: 0.1, ease: 'power1.inOut', duration: 0.07 }, 0.62) // tunnel — clear
      tl.to('.cine-dim', { opacity: 0.58, ease: 'power1.inOut', duration: 0.06 }, 0.74) // sprint headline
      tl.to('.cine-dim', { opacity: 0.14, ease: 'power1.inOut', duration: 0.06 }, 0.87) // machine hero — clear
      tl.to('.cine-dim', { opacity: 0.62, ease: 'power1.inOut', duration: 0.06 }, 0.92) // resolve + CTAs

      // useGSAP reverts the context for us; the ticker callback is ours to undo.
      return () => {
        gsap.ticker.remove(tick)
      }
    },
    { scope: rootRef, dependencies: [ready] },
  )

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-apex-black"
    >
      {/* ─── ACT 0's charge — the bolt behind the type ─────────────────────
          A WebGL bolt (src/components/ui/Lightning.tsx) keyed to the brand
          blue, running behind the logo and headline while the screen is still
          black, then travelling up and fading out as the split begins. It is
          Act 0's only motion, which is the whole point: the opening holds for
          two wheel notches before the film moves, and a dead-still black
          screen for that long reads as a page that hasn't loaded.

          Below the aperture (z-0 against z-[1]) so the film always covers it,
          and `screen` blended so the shader's black plate composites to exactly
          the page background rather than sitting there as a dark rectangle —
          the same rule as the floating product films (see CLAUDE.md).

          Masked at the edges: at full bleed it lit the navbar and drew the eye
          to the corners of the screen instead of to the words. */}
      <div
        className="cine-bolt absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0,
          mixBlendMode: 'screen',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 62% at 50% 46%, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(ellipse 78% 62% at 50% 46%, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden="true"
      >
        <Lightning
          hue={196}
          xOffset={0}
          speed={phone ? 0.9 : 1.1}
          /* With `storm` this is the ceiling a strike reaches rather than a
             level that is held, so it is lifted: the bolt now spends most of
             its time near-dark and the strikes have to carry. */
          intensity={0.95}
          size={phone ? 1.7 : 2.2}
          paused={!boltLive}
          storm
          resolutionCap={phone ? 460 : 700}
          className="h-full w-full"
        />
      </div>

      {/* ─── The film, inside the aperture that the headline split opens ─── */}
      <div
        className="cine-aperture absolute inset-0 z-[1]"
        style={{ clipPath: apertureSlit(cfg.copyShift), opacity: 0 }}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Readability ramp — light touch; the plate is already near-black */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 120% 90% at 55% 45%, transparent 42%, rgba(5,8,14,0.55) 100%)',
          }}
        />
        {/* Tunnel vignette — intensifies on travel, sells the push-in */}
        <div
          className="cine-tunnel absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            background:
              'radial-gradient(circle at 50% 48%, transparent 26%, rgba(3,5,9,0.5) 64%, rgba(2,3,6,0.94) 100%)',
          }}
        />
        {/* Act-3 scrim — the machine recedes to a ghost so the closing
            statement owns the frame (the film rests dead-centre, so centred
            copy has nowhere else to go). */}
        <div
          className="cine-dim absolute inset-0 pointer-events-none"
          style={{ opacity: 0, background: '#04070c' }}
        />
      </div>

      {/* ─── Copy beats ─── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* ACT 0/1 — the promise, which becomes the split */}
        <ActZero />

        {/* ACT 2 — telemetry HUD mid-travel.
            Desktop flanks the film left/right: the machine holds the middle of
            frame for the whole clip, so the instrument readout lives in the dark
            margins either side of it. A phone has no such margins — the film is
            a band across the middle — so the readout becomes a 2×2 block sitting
            in the black beneath it. */}
        <div className="beat-2 absolute inset-0 opacity-0">
          {phone ? (
            <div className="absolute inset-x-0 bottom-[8%] px-8">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span
                  className="h-1.5 w-1.5 bg-apex-red"
                  style={{ animation: 'cta-glow-pulse 1.6s ease-in-out infinite' }}
                />
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-apex-blue">
                  ARI · Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {STATS.map((s) => (
                  <Stat key={s.k} {...s} align="center" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="absolute left-[11%] xl:left-[13%] top-1/2 -translate-y-1/2 flex flex-col items-end gap-9 text-right">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 bg-apex-red"
                    style={{ animation: 'cta-glow-pulse 1.6s ease-in-out infinite' }}
                  />
                  <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-apex-blue">
                    ARI · Live
                  </span>
                </div>
                {STATS.slice(0, 2).map((s) => (
                  <Stat key={s.k} {...s} align="right" />
                ))}
              </div>
              <div className="absolute right-[11%] xl:right-[13%] top-1/2 -translate-y-1/2 flex flex-col items-start gap-9 text-left">
                {STATS.slice(2).map((s) => (
                  <Stat key={s.k} {...s} align="left" />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ACT 3a — the promise, centred over the sprint, then gone */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          {/* px bounds for the same reason as the h1 above — "NEXT TENTH OF A
              SECOND" is a 22-character non-breaking string, so it is the most
              overflow-prone line on the page. */}
          <h2
            className="beat-sprint h-luxia leading-[1.04] sm:leading-[0.96] max-w-[900px] opacity-0"
            style={{ fontSize: 'clamp(26px, 4.4vw, 64px)', letterSpacing: '0.04em' }}
          >
            <span className="t-silver">DEVELOPED&nbsp;FOR&nbsp;THE</span>
            <br />
            <span className="t-blue">NEXT&nbsp;TENTH&nbsp;OF&nbsp;A&nbsp;SECOND</span>
          </h2>
        </div>

        {/* ACT 3b — the resolve + CTA */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="beat-3 w-full max-w-[900px] opacity-0 pointer-events-auto">
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              {/* Same pair, same destinations, as the classic <Hero/> this
                  replaces — order first, demo enquiry second. */}
              <a
                href="#order"
                className="group inline-flex items-center justify-center gap-2.5 cta-glow text-white font-display font-semibold text-[11px] px-8 py-4 tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Order Your System
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href={DEMO_HREF}
                className="group inline-flex items-center justify-center gap-2.5 bg-transparent border border-apex-line hover:border-apex-grey-dim text-apex-grey hover:text-apex-white font-display font-semibold text-[11px] px-8 py-4 tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Book Your Free Demo
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <ScrollCue />
    </section>
  )
}

export default function ScrollCinemaHero() {
  const [mode, setMode] = useState<'pending' | 'desktop' | 'phone' | 'fallback'>('pending')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Data Saver / a metered 2G-class connection: a few hundred images is the
    // wrong thing to do to someone who has explicitly asked you not to.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection
    const frugal = Boolean(conn?.saveData) || /^(slow-)?2g$/.test(conn?.effectiveType || '')

    if (reduced || frugal) {
      setMode('fallback')
      return
    }
    setMode(window.matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'phone')
  }, [])

  if (mode === 'desktop') return <CinemaImpl cfg={DESKTOP} phone={false} />
  if (mode === 'phone') return <CinemaImpl cfg={MOBILE} phone />

  // Reduced motion / Data Saver — the classic hero, as a still. Those settings
  // are a request not to autoplay a 13 MB loop, so it keeps the poster.
  if (mode === 'fallback') return <Hero still />

  // 'pending' — what the export ships and every visitor paints first. Act 0, so
  // the swap to the live cinema is black-to-black and invisible. See OpeningStill.
  return <OpeningStill />
}

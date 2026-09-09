'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'
import Lightning from './ui/Lightning'
import { setChromeHidden } from '@/lib/chrome'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── Scroll-cinema hero ───────────────────────────────────────────────────────
// A pinned, scroll-scrubbed cinematic banner. One continuous camera move that
// travels from the outside of the machine all the way to the athlete it drives:
//
//   ACT 0  HOLD      black frame, the headline alone, a bolt of electricity
//                    running behind it — no film yet.
//   ACT 1  SPLIT     the headline parts (TRAIN BEYOND ↑ / HUMAN LIMITS ↓) and the
//                    film opens out of the seam between them (clip-path aperture
//                    + fade), so the video is literally revealed BY the split.
//   ACT A  INTRO     the T-APEX machine, alone on a pure black plate, deep down
//                    the lens — travelling in and turning to face camera.
//   ACT B  OPEN      ✦ THE PANELS OPEN. The internals light: cable spool, motor,
//                    gears.
//   ACT C  FLY       the camera flies through the interior — gears meshing,
//                    copper, circuit macros, the chip.
//   ACT D  THROUGH   it banks up and out into a red grid tunnel, then ✦ FLIES
//                    THROUGH the opening at the end of it.
//   ACT E  RUN       out the other side: an athlete driving toward the lens down
//                    an indoor track, the same machine trackside paying cable.
//   ACT F  CHARGE    the ARI overlay floods his musculature in red and blue.
//   ACT G  DISSOLVE  he comes apart into particles and the frame falls to black
//                    on the last frame of the pin.
//
// Frames are a pre-extracted WebP sequence (buttery, no <video> stutter). Swap
// the footage by dropping a new numbered sequence into /public/hero-frames and
// updating the desktop `frameCount` below (see docs/motion-scroll-brief.md).
//
// ── The read this cut is built to protect ────────────────────────────────────
// **You watch the machine. It opens. You fly through it, and out the far end an
// athlete is running at you.**
//
// Two different generations are joined to get that (see the brief's §6), and the
// second join is the interesting one: the tunnel's far opening is a real hole
// that the camera flies through, rendered frame by frame rather than dissolved.
// It survives being scrubbed — which a video transition never has to — because
// nothing crossfades: the tunnel leaves the screen by being flown past. Stopping
// halfway shows the athlete framed inside the red tunnel mouth, which is a
// composition worth stopping on rather than a smear between two clips.
//
// ── The page chrome gets out of the way ──────────────────────────────────────
// The navbar and its progress rail are pulled off screen for the length of the
// film and put back as the pin releases (see src/lib/chrome.ts). They stay for
// Act 0, which is the landing state and carries no picture.
//
// ── The film ends on black, and that is load-bearing ─────────────────────────
// The cut runs to the source's own fade-out, so the last frame of the pin is a
// black frame. The hero therefore releases into <ScrollExpandVideo/> black-to-
// black — the sequence resolves and the next section rises out of the same
// darkness rather than cutting to it. Do NOT trim the fade off to "save" the
// ~8 % of scroll it costs; that 8 % is the transition.
//
// ── Phones get the same film ─────────────────────────────────────────────────
// The cut used to be desktop-only, and phones fell back to <Hero/> over a 13 MB
// looping banner video — the single heaviest thing on the mobile site, loaded
// through two stacked <video> elements. The scroll-cinema now runs there too,
// off a separate sequence (/hero-frames-mobile) — 960×540 and, deliberately,
// three quarters of the desktop frame count, because the phone's pin is three
// quarters as long (see MOBILE below). 7.7 MB all in, and only the first dozen
// gate the start.
//
// The one thing that could NOT come across is the framing. The footage is 16:9
// and a phone is roughly 9:19.5, so cover-fitting it would show a ~26 % wide
// slice of every shot — the run would be cropped to a strip of the athlete's
// torso. Mobile therefore fits the film to the *width* (see FIT below) and
// plays it as a band across the middle of a black screen, which is where the
// headline splits apart anyway: the type parts, the band opens in the seam. Same
// acts, same beats, framed for the device instead of cropped for it.
//
// Still falls back to the classic <Hero /> under `prefers-reduced-motion` or
// Data Saver — a three-hundred-and-fifty-frame preload is exactly what those
// settings ask you not to do.

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
  /**
   * The camera push: the scale on the fitted frame at HOLD, then at the end of
   * each act — so this array is always `ACTS.length + 1` long and the two are
   * read together in one loop. Parallel arrays rather than named stops because a
   * push that changes gear at a different scroll position from the footage
   * visibly slides against it, and this makes that impossible to write.
   *
   * The shape is not a taste choice. It is dictated by what is behind the
   * subject, and it changes early in the film:
   *
   * - **Acts A–B sit on a pure black plate**, so drawing the frame *under* 1.0
   *   puts black around it and reads as distance — the machine is a long way
   *   down the lens and flies in. That is what 0.34 buys, and nothing else can:
   *   the footage itself holds the machine at a constant size.
   * - **From act C on the frame is filled** — first by the machine's interior,
   *   then the tunnel, then a lit hall — and `fit: 'cover'` sizes the frame to
   *   exactly fill the screen at 1.0. Anything under it letterboxes, and on a
   *   filled shot a letterbox reads as black bars, not as distance. So the push
   *   **must** have reached 1.0 by the end of act B and must never go back.
   *
   * Past 1.0 keep the increments small. The footage is already flying — act D
   * contains a rendered fly-through of its own — and a push-in on top of a
   * push-in is two motions fighting.
   */
  zoom: readonly number[]
}

/** The closed aperture — a zero-height slit sitting on the headline's seam. */
function apertureSlit(copyShift: number) {
  const top = 50 - copyShift * 100
  return `inset(${top}% 0% ${100 - top}% 0%)`
}

const DESKTOP: CinemaConfig = {
  frameCount: 357,
  framePath: (i) => `/hero-frames/frame-${String(i).padStart(3, '0')}.webp`,
  // The gate is deliberately low. A frame that hasn't decoded holds the previous
  // one rather than flashing black, so arming early costs nothing visually — and
  // the alternative is a hero that ignores your scroll while a megabyte lands.
  readyFrames: 18,
  // ── Sized off the frame count, not off taste ────────────────────────────────
  // `pinDistance ÷ frameCount` has to land in the **15–20 px of scroll per
  // frame** band. Under it you are paying for frames the scroll never reaches;
  // over it a single wheel notch skips a frame and the scrub reads as stepping
  // rather than as motion.
  //
  // 357 frames × ~17px = 6100. This is a long hero — about six viewport heights
  // — and that is the honest cost of a 22-second film: there is no way to play
  // 22 seconds of footage in less scroll without either skipping frames or
  // cutting the film. If it ever needs to be shorter, take it out of the
  // fly-through (act C), which is 37 % of the pin.
  pinDistance: '+=6100',
  fit: 'cover',
  baseScale: 1,
  splitTravel: 0.34,
  // Capped at 1.5 rather than 2. Frames are 1920×1080, so on a standard 1080p
  // desktop (DPR 1) the canvas is pixel-for-pixel with the source, and on a
  // 1440pt laptop at DPR 2 it asks for 2160 — a mild upscale rather than the
  // 1.35× it was getting from a 1600-wide sequence. Above 1.5 we're pushing 4×
  // the pixels on a large retina display to show detail the frame does not have,
  // and that fill rate is better spent on framerate, which is smoothness.
  maxDpr: 1.5,
  // Tight, because <SmoothScroll/> (Lenis) already interpolates the wheel. A big
  // scrub on top of that stacks two lags and the film trails the page.
  scrub: 0.35,
  // Desktop has the width to carry an honestly-centred block.
  copyShift: 0,
  //        HOLD    A     B     C     D     E     F     G
  //          ↓     ↓     ↓     ↓     ↓     ↓     ↓     ↓
  //   machine deep down the lens ──▶ full frame as the panels open, then never
  //   back below 1.0 because every act after B fills the frame.
  zoom: [0.34, 0.62, 1.06, 1.1, 1.12, 1.16, 1.2, 1.24],
}

const MOBILE: CinemaConfig = {
  // Three quarters of the desktop count, because the phone's pin is three
  // quarters as long — 268 frames over 4200px is ~15.7 px/frame against
  // desktop's ~17. Matching desktop's 357 here would buy nothing the shorter
  // pin can reach and cost 2.5 MB on a phone.
  frameCount: 268,
  framePath: (i) => `/hero-frames-mobile/frame-${String(i).padStart(3, '0')}.webp`,
  // ~280 KB before the film can start moving, and the first six of those are
  // already in flight from the HTML preloads (see layout.tsx).
  readyFrames: 12,
  // Shorter than desktop: a thumb covers ground far faster than a wheel, and a
  // 6100px pin on a phone feels like the page has stopped responding. Against
  // 268 frames this is ~15.7px of scroll per frame — slightly finer than
  // desktop's ~17, which is the right way round, because touch has no Lenis
  // interpolation upstream of it and the scrub is the only thing smoothing the
  // platform's own scroll cadence.
  pinDistance: '+=4200',
  fit: 'width',
  // 1.35× fit-width — the band fills a good third of the screen and the athlete
  // stays whole. Above ~1.5 the run starts cropping his arms at the frame edge.
  baseScale: 1.35,
  // Enough to clear the film band (≈296px tall at rest) without throwing the
  // type off the top of a short phone.
  splitTravel: 0.21,
  // Paired with a 960-wide sequence, and the two have to move together.
  //
  // The phone used to run 640-wide frames at a 1.25 cap, which on a DPR-3 handset
  // made the backing store 488px against a 390pt box — the browser then stretched
  // that 2.4× to fill it, so the film was resampled twice and looked soft on
  // exactly the screens that could have shown it sharp. The source here is
  // 1280 wide, so 960 is a clean *downscale* rather than an upscale: the band
  // draws ~1150px from a 960px frame, once.
  maxDpr: 2,
  // Higher than desktop on purpose. Lenis leaves touch alone — momentum
  // scrolling fights any JS smoothing layered on top of it — so nothing
  // upstream is interpolating a finger drag, and the scrub is the only place
  // that can soften the platform's own scroll cadence. 0.5 is about as far as
  // it goes before the film visibly trails your thumb.
  scrub: 0.5,
  // Keep in step with `--cine-copy-shift` in globals.css.
  copyShift: 0.1,
  // Same shape as desktop, run flatter. The phone plays the film as a
  // letterboxed band whose size is `zoom × baseScale`, so these are multiplied
  // by 1.35 before they hit the canvas: the machine opens at 0.54 of fit-width
  // and the tail lands at 1.49, just under the ~1.5 where the run starts losing
  // the athlete. The band is small, so the machine has to close more of the
  // distance before the panels move than it does on desktop — hence 0.72 at the
  // end of act A rather than 0.62.
  zoom: [0.4, 0.72, 1.0, 1.01, 1.02, 1.04, 1.07, 1.1],
}

// ── ACT SCRUB — where the scroll budget is spent ─────────────────────────────
// The film does NOT scrub at one flat rate. Each act gets a share of the pinned
// scroll chosen against how much its footage moves, so the rate changes only at
// act boundaries — and those fall where the footage itself changes gear, which
// is why no leg visibly speeds up mid-shot.
//
//   act              frames       scroll        px/frame
//   A  intro          1– 47      0.045–0.170      ~16.6   machine turning on black
//   B  open          47– 78      0.170–0.262      ~18.1   ✦ the panels open
//   C  fly           78–215      0.262–0.615      ~15.7   through the interior
//   D  through      215–272      0.615–0.760      ~15.5   red tunnel, then ✦ through it
//   E  run          272–304      0.760–0.845      ~16.2   the athlete driving in
//   F  charge       304–326      0.845–0.905      ~16.6   the ARI overlay
//   G  dissolve     326–357      0.905–1.0        ~18.7   particles → black
//
// Against the 6100px pin every leg lands between 15.5 and 18.7 px of scroll per
// frame — deliberately flat. Earlier cuts of this hero spent 24px/frame on the
// opening to "give the hero shot room", but that trade only made sense when the
// opening was 19 % of the sequence; here the film is long enough that every act
// gets real screen time from a near-proportional split, and flat is smoother.
//
// Boundaries are stored as **ratios of the sequence**, not frame indices, so the
// phone — three quarters the frames, three quarters the pin — lands every cut on
// the same moment of the film, and a re-cut keeps its choreography.

// How long Act 0 holds before anything moves, as a fraction of the pinned
// scroll. ~275px on the 6100px pin: the second wheel notch. This number has been
// tuned from both directions — at 0.10 the page felt dead on arrival, at 0.03
// the split was underway before you had seen the headline. It can be this short
// only because Act 0 is not still: the bolt is alive from the first pixel, so
// the hold reads as a charge rather than as a stall.
const HOLD = 0.045

// Progress past which the bolt's shader is switched off. It is fully faded by
// ~0.16; the margin is so a small scroll back up does not strobe it.
const BOLT_OFF = 0.2

/**
 * Act boundaries: `[frame ratio, scroll progress]` at the END of each act.
 *
 * Kept as one table because the two columns only mean anything together — a
 * frame ratio without the scroll position it lands at says nothing about pace,
 * and every px/frame figure in the map above is one row divided by the previous.
 * `zoom` in each CinemaConfig is the parallel array, one entry longer.
 */
const ACTS: ReadonlyArray<readonly [number, number]> = [
  // A — the machine turns on black. Frame 47 ≈ 2.9s: it has come round to face
  //     camera, the X seam lit but still shut.
  [47 / 357, 0.17],
  // B — ✦ the panels open. Frame 78 ≈ 4.8s: wide open, internals lit, the camera
  //     already moving in. Nothing may be written over this act.
  [78 / 357, 0.262],
  // C — the fly-through: spool, motor, gears, copper, circuit macros, the chip.
  //     Frame 215 ≈ 13.4s, where the camera banks up and out. The longest act by
  //     far, and where the telemetry HUD lives — a live instrument readout means
  //     something over the machine's own internals.
  [215 / 357, 0.615],
  // D — out into the red grid tunnel and ✦ THROUGH the opening at the end of it.
  //     Frame 272 ≈ 17.0s is where the tunnel has been flown past entirely.
  //
  //     The flight through is 39 of those frames, ~605px of scroll. It was 12
  //     frames and 200px in the first cut of this and flashed past — it is the
  //     signature shot of the hero and the only one you cannot get from either
  //     source alone, so it is rendered long (see the brief's §6) rather than
  //     given more scroll, which would only have made 12 frames step.
  [272 / 357, 0.76],
  // E — the athlete driving out of the far end of the hall toward the lens.
  //     Frame 304 ≈ 18.9s: the ARI overlay has taken his whole body.
  [304 / 357, 0.845],
  // F — the charge. Frame 326 ≈ 20.3s: he starts coming apart.
  [326 / 357, 0.905],
  // G — the dissolve, to the last frame at the last pixel of the pin.
  [1, 1],
]

// ── Where the cut's content sits, as scroll progress ─────────────────────────
//
//   0–HOLD     ACT 0 holds: black, the brand mark, the headline whole, the bolt
//              running behind it. Nothing else moves.
//   HOLD–0.17  the machine alone on black, deep down the lens, travelling in and
//              turning to face camera. The headline halves clear at 0.17 —
//              nothing may be on screen when the panels move.
//   0.17–0.26  ✦ THE PANELS OPEN, internals lit.
//   0.26–0.62  the fly-through. Telemetry HUD from 0.34 to 0.53.
//   0.62–0.76  the red tunnel, and ✦ THROUGH its far opening into the hall.
//   0.76–0.85  the athlete drives out of the far end toward the lens.
//   0.85–0.91  the charge — the ARI overlay floods his musculature. The closing
//              statement lands at 0.845.
//   0.91–1.0   he comes apart into particles and the frame falls to black on the
//              last frame of the pin.
//
// ── The lighting cue is measured, not eyeballed ──────────────────────────────
// This film has two very different exposures in it: acts A–B are a near-black
// product plate, everything after is lit — and the fly-through is the brightest
// thing in the cut, not the hall. Measured mean luma of the zone each beat
// actually occupies:
//
//   beat                act   zone                measured Y   → dim
//   split headline      A     centre band            ~8         0.16
//   telemetry HUD       C     left/right flank        72         0.52
//   closing statement   F     centre band             61         0.50
//
// The levels are solved for, not chosen: pick the opacity that lands the
// backdrop near Y≈32, which is where the metallic type holds its contrast. Note
// the HUD needs MORE scrim than the closing statement even though it is smaller
// type — the circuit macros behind it are brighter than the hall. If you recut,
// re-measure; the method and the crops are in docs/motion-scroll-brief.md §1.

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
  const render = useRef({ frame: 0, scale: cfg.zoom[0] }).current

  // ── Preload the sequence so scrubbing never waits on I/O ────────────────────
  //
  // Two details that decide how a cold load *feels*:
  //
  // 1. The opening frames are fetched at high priority and everything after
  //    them at low. The whole sequence used to go out as one undifferentiated
  //    burst, so frame 4 queued behind frame 150 — which nobody sees for another
  //    three thousand pixels of scroll. The tail still streams in during Act 0's
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

  // ── Act 0's charge, brought in on MOUNT ──────────────────────────────────────
  // Deliberately not part of the scroll timeline below: that block waits on
  // `ready` (the first frames of the film decoding), so on a phone the bolt did
  // not exist until the sequence had downloaded — the opening read as a dead
  // black screen and the charge only turned up once you had started scrolling.
  // The bolt needs none of the film to run, so it starts as soon as it is in the
  // DOM. The timeline's own tween takes the opacity from here (immediateRender:
  // false) when the split begins.
  useGSAP(
    () => {
      gsap.fromTo(
        '.cine-bolt',
        { opacity: 0 },
        { opacity: 0.55, duration: 1.1, ease: 'power1.out' },
      )
    },
    { scope: rootRef },
  )

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
            // Pull the navbar and its progress rail off screen while the film
            // owns it, and put them back as the pin releases. A fixed bar across
            // the top of a full-bleed shot is the one piece of furniture that
            // gives away that this is a web page rather than a film.
            //
            // Not from progress 0: Act 0 is a black plate with the headline on
            // it, no film yet, and that is the landing state — taking the site's
            // only navigation away before the visitor has scrolled at all is a
            // different and worse thing than keeping it off a picture. It goes at
            // the same moment the aperture starts to open.
            //
            // The store's setter is a no-op when the value has not changed, so
            // this is safe to call on every scroll frame.
            setChromeHidden(self.progress > HOLD * 0.5 && self.progress < 0.985)
          },
          // Belt and braces on the way out. `onUpdate` stops firing once the
          // trigger is no longer active, so the boundary cases get their own
          // handlers — otherwise a fast fling past the end can leave the site
          // with no navigation at all.
          //
          // `released` also hands the paint order to the section below, which has
          // been pulled up over the hero's own trailing height — see the
          // `[data-cinema]` rules in globals.css. It has to flip exactly here, at
          // the pin's end, which is why it rides the pin's own callbacks rather
          // than a progress threshold.
          onLeave: () => {
            setChromeHidden(false)
            document.documentElement.dataset.cinema = 'released'
          },
          onEnterBack: () => {
            document.documentElement.dataset.cinema = 'pinned'
          },
          onLeaveBack: () => setChromeHidden(false),
        },
      })

      // ── The bed — frame scrub + camera push run under everything ─────────────
      // Both are driven straight off ACTS, one leg per act, rather than being
      // written out by hand: the frame scrub and the camera push have to change
      // gear at exactly the same scroll positions or the push visibly slides
      // against the footage. Sharing one table is what guarantees that.
      //
      // Every leg is linear (ease 'none' from defaults). The pacing lives in how
      // much scroll each act is given, not in easing curves — an eased leg
      // accelerates the film *within* a shot, which reads as the video speeding
      // up rather than as the page moving.
      //
      // The frames start moving the instant the hold ends: the aperture opening
      // on a *running* frame is what makes the split read as a reveal rather
      // than as a still being uncovered.
      //
      // The last leg runs to 1.0, not short of it. The cut ends on the source's
      // own fade to black, so the last frame of the film and the last pixel of
      // the pin are the same moment: the hero resolves to black and releases
      // into the film section below it. Parking the scrub early would freeze the
      // dissolve mid-particle and then cut to black at the release instead.
      let atFrame = HOLD
      let atScale = HOLD
      ACTS.forEach(([ratio, until], i) => {
        tl.to(render, { frame: i === ACTS.length - 1 ? last : f(ratio), duration: until - atFrame }, atFrame)
        atFrame = until
        tl.to(render, { scale: cfg.zoom[i + 1], duration: until - atScale }, atScale)
        atScale = until
      })

      // ── ACT 0 — the charge ───────────────────────────────────────────────────
      // The bolt is at full strength for the hold, then travels UP and out as
      // the headline parts — the charge leaving with the type rather than
      // simply switching off. It clears well before the film's aperture is
      // open, so the two never overlap on screen.
      // The fade-UP that brings the charge in is NOT here — it runs from its own
      // effect on mount (see below), because this block is gated on `ready`,
      // i.e. on the first frames of the film having decoded. On a phone over a
      // real connection that wait is seconds long, and it made the opening a
      // dead black screen until you scrolled. `immediateRender: false` below is
      // what lets that mount tween own the opacity until the split starts.
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

      // ── The vignette ─────────────────────────────────────────────────────────
      // Deliberately absent from the fly-through, which is the most colourful
      // stretch in the film — machined copper, blue circuit light, red cabling.
      // It used to ramp to 0.5 from the moment the panels opened, and between
      // that and the scrim below the interior visibly drained as the camera went
      // in. Both existed to make a telemetry readout legible over the top; that
      // readout is gone, and so is the reason.
      //
      // What is left is a light 0.3 over the tunnel only, where the shot is a
      // symmetrical corridor and a vignette genuinely adds depth, easing off for
      // the closing dissolve, which fills the frame corner to corner and must
      // not be cropped by its own furniture.
      tl.fromTo('.cine-tunnel', { opacity: 0 }, { opacity: 0.3, duration: 0.08 }, 0.6)
      tl.to('.cine-tunnel', { opacity: 0.12, duration: 0.08 }, 0.86)

      // The split halves clear at 0.17 — the instant before the panels move.
      // This is the one hard layout rule the footage imposes: the box opening is
      // the centrepiece of the whole hero and nothing sits on top of it.
      tl.to('.split-top', { opacity: 0, y: () => -travel() - 60, duration: 0.055 }, 0.115)
      tl.to('.split-bot', { opacity: 0, y: () => travel() + 60, duration: 0.055 }, 0.115)

      // ── ACT F — the promise, over the charge ─────────────────────────────────
      // Lands as the ARI overlay takes his whole body, holds through the peak,
      // and clears into the dissolve so the film falls to black on its own.
      tl.fromTo(
        '.beat-sprint',
        { opacity: 0, y: 34, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.05 },
        0.845,
      )
      tl.to('.beat-sprint', { opacity: 0, y: -22, filter: 'blur(6px)', duration: 0.045 }, 0.955)

      // ── The lighting cue ─────────────────────────────────────────────────────
      // `.cine-dim` is a black scrim over the film. It exists for exactly one
      // reason: to hold contrast under copy. So it lifts under a copy beat and is
      // otherwise as close to zero as the shot allows.
      //
      // There are now only two beats, and between them the film plays at full
      // strength. That is a change of principle, not just of numbers: this used
      // to carry a third level (0.52) across the whole fly-through so a telemetry
      // readout could sit on top of it, and the effect was that the interior —
      // copper, blue circuit light, red cabling, the most colourful footage in
      // the cut — visibly drained the moment the camera went in. The readout is
      // gone; the scrim goes with it.
      //
      //   beat                act   zone          measured Y   → dim
      //   split headline      A     centre band      ~8         0.16
      //   closing statement   F     centre band       61        0.50
      //
      // The levels are solved for, not chosen: the opacity that lands the
      // backdrop near Y≈32, where the metallic type holds its contrast. If a beat
      // is ever added back, measure the zone it actually occupies — do not reuse
      // a level from a different act.
      tl.to('.cine-dim', { opacity: 0.16, ease: 'power1.inOut', duration: 0.07 }, HOLD) // headline over the plate
      tl.to('.cine-dim', { opacity: 0.02, ease: 'power1.inOut', duration: 0.05 }, 0.145) // ✦ panels open — and stays clear all the way to the charge
      tl.to('.cine-dim', { opacity: 0.5, ease: 'power1.inOut', duration: 0.045 }, 0.83) // closing statement
      tl.to('.cine-dim', { opacity: 0.18, ease: 'power1.inOut', duration: 0.04 }, 0.955) // clears into the dissolve

      // useGSAP reverts the context for us; the ticker callback and the chrome
      // flag are ours to undo. The flag especially: leaving it set on unmount
      // would strand the site with no navbar.
      return () => {
        gsap.ticker.remove(tick)
        setChromeHidden(false)
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

        {/* Readability ramp — a corner falloff, permanently on. Cut from 0.55 to
            0.22: at full strength it was a third of why the fly-through looked
            drained, and with the telemetry readout gone nothing sits in the
            corners any more. The only copy over the film now is centred, where
            this gradient is transparent anyway. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 120% 90% at 55% 45%, transparent 52%, rgba(5,8,14,0.22) 100%)',
          }}
        />
        {/* Vignette — over the tunnel only, where a symmetrical corridor gains
            depth from it. Kept off the fly-through on purpose; see the timeline. */}
        <div
          className="cine-tunnel absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            background:
              'radial-gradient(circle at 50% 48%, transparent 26%, rgba(3,5,9,0.5) 64%, rgba(2,3,6,0.94) 100%)',
          }}
        />
        {/* The lighting scrim — the hall drops back to a ghost so each copy beat
            owns the frame (the athlete runs dead-centre for the whole clip, so
            centred copy has nowhere else to go). Scheduled in the timeline. */}
        <div
          className="cine-dim absolute inset-0 pointer-events-none"
          style={{ opacity: 0, background: '#04070c' }}
        />
      </div>

      {/* ─── Copy beats ─── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* ACT 0/1 — the promise, which becomes the split */}
        <ActZero />

        {/* ACT F — the promise, centred over the charge, then gone */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          {/* px bounds for the same reason as the h1 above. Two lines, one
              phrase each, both nowrap — the longest is 18 characters, which
              holds on a single line at every width down to 320px, so the vw
              term is sized to exactly that (18ch is the constraint, not the
              box). The payoff line lives in the film section that follows;
              this beat states the promise only. */}
          <h2
            className="beat-sprint h-luxia leading-[1.06] sm:leading-[0.98] max-w-[900px] opacity-0"
            style={{ fontSize: 'clamp(24px, 7.6vw, 66px)', letterSpacing: '0.04em' }}
          >
            <span className="t-silver whitespace-nowrap">WHEN PERFORMANCE</span>
            <br />
            <span className="t-blue whitespace-nowrap">MEETS INTELLIGENCE</span>
          </h2>
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

    // Tells the stylesheet a pinned cinema is running, so the section below can
    // cancel the hero's own 100svh of trailing space — see `[data-cinema]` in
    // globals.css. Set here rather than in the pinned component because it is a
    // property of *which mode won*, and the fallback must not get it.
    document.documentElement.dataset.cinema = 'pinned'
    return () => {
      delete document.documentElement.dataset.cinema
    }
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

'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── Scroll-cinema hero ───────────────────────────────────────────────────────
// A pinned, scroll-scrubbed cinematic banner staged in four acts:
//
//   ACT 0  HOLD    black frame, the headline alone — no film, no motion.
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
// updating FRAME_COUNT below (see docs/motion-scroll-brief.md).
//
// Gracefully degrades: phones and `prefers-reduced-motion` users get the classic
// <Hero /> (no pin, no scrub) instead of this.

const FRAME_COUNT = 318
const FRAME_PATH = (i: number) =>
  `/hero-frames/frame-${String(i).padStart(3, '0')}.webp`

// Scrubbing may begin once this many frames are decoded; the rest keep loading
// in the background. Act 0 is pure black + type, so it doubles as the loader.
const READY_FRAMES = 36

// How far (in px of scroll) the hero stays pinned. ~15px of scroll per frame on
// average, but that budget is spent unevenly — see ACT SCRUB below.
const PIN_DISTANCE = '+=4800'

// Camera push. The film opens on the machine sitting a long way back down the
// lens — the plate behind it is pure black, so drawing the frame under 1.0 puts
// black around it and reads as distance, not as a shrunken video. It flies in to
// full frame as the panels open, then keeps a whisper of drift across the travel.
const ZOOM_START = 0.34
const ZOOM_OPEN = 1.0
const ZOOM_END = 1.1

// ── ACT SCRUB — where the scroll budget is spent ─────────────────────────────
// Frame indices into the sequence, and the share of the pinned scroll each act
// gets. The opening is deliberately the slowest: it's the hero shot, and at a
// flat rate it flashed past in a fifth of the scroll. Now it takes a third, so
// the machine has room to travel in, turn, and open.
//
//   act        frames     scroll     px/frame
//   opening      0– 59      34%        ~24   ← the hero shot, given room
//   internals   59–185      26%        ~10
//   tunnel     185–227      10%        ~11
//   sprint     227–end      30%        ~13
const ACT_OPEN_END = 59
const ACT_INNER_END = 185
const ACT_TUNNEL_END = 227

// How far the two headline halves travel apart, as a fraction of viewport
// height. Resolved at refresh so it survives resize.
const SPLIT_TRAVEL = 0.34

// ── Where the cut's content sits, as scroll progress ─────────────────────────
// The film scrubs 0.03 → 0.97, act by act (see ACT SCRUB above):
//
//   0.03       the split starts almost immediately. It used to wait until 0.10
//              — 480px, five-odd wheel notches of nothing before the headline
//              budged, which read as the page being broken. 0.03 is ~144px, so
//              it is moving by the second notch.
//   0.03–0.40  the machine on pure black — deep down the lens, travelling in and
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
// The device is locked to the track across the sprint (the generated footage
// read as though the sprinter were towing it); see docs/motion-scroll-brief.md.

const STATS = [
  { k: 'Force', v: '412', u: 'N' },
  { k: 'Velocity', v: '9.6', u: 'm/s' },
  { k: 'Response', v: '<2', u: 'ms' },
  { k: 'Control', v: '100', u: '%' },
]

function Stat({ k, v, u, align }: { k: string; v: string; u: string; align: 'left' | 'right' }) {
  return (
    <div>
      <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-apex-grey-dim mb-2">
        {k}
      </div>
      <div className="font-display font-black text-apex-white leading-none text-4xl xl:text-5xl">
        {v}
        <span className="text-apex-blue text-base xl:text-lg ml-1 align-top">{u}</span>
      </div>
      <div
        className={`mt-3 h-px w-12 ${align === 'right' ? 'ml-auto' : ''}`}
        style={{
          background:
            align === 'right'
              ? 'linear-gradient(90deg,transparent,rgba(0,174,239,0.7))'
              : 'linear-gradient(270deg,transparent,rgba(0,174,239,0.7))',
        }}
      />
    </div>
  )
}

function CinemaImpl() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [ready, setReady] = useState(false)

  // Mutable render state the scroll timeline drives; the draw loop reads it.
  const render = useRef({ frame: 0, scale: ZOOM_START }).current

  // ── Preload the sequence so scrubbing never waits on I/O ────────────────────
  useEffect(() => {
    let loaded = 0
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = img.onerror = () => {
        loaded++
        if (loaded >= READY_FRAMES) setReady(true)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [])

  // ── Canvas draw — cover-fit the active frame, scaled for the push-in ─────────
  const draw = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const img = imagesRef.current[Math.round(render.frame)]
    // Frame still decoding — hold the previous one rather than flashing black.
    if (!img || !img.complete || !img.naturalWidth) return

    // The frames are upscaled 720p, so resampling quality is doing real work
    // here — the cheap default sampler is a visible part of the softness.
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const cw = canvas.width
    const ch = canvas.height
    const ir = img.naturalWidth / img.naturalHeight
    const cr = cw / ch
    let dw: number
    let dh: number
    if (ir > cr) {
      dh = ch
      dw = ch * ir
    } else {
      dw = cw
      dh = cw / ir
    }
    dw *= render.scale
    dh *= render.scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  // ── Size the canvas backing store to the element (dpr-aware) ─────────────────
  const sizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Capped at 1.5 rather than 2. Frames are 1920×1080, so on a standard 1080p
    // desktop (DPR 1) the canvas is already pixel-for-pixel with the source.
    // Above that we're upscaling regardless — and a 2× backing store on a large
    // retina display pushes 4× the pixels to show detail the frame doesn't have.
    // That fill rate is better spent on framerate, which is smoothness.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    draw()
  }

  useEffect(() => {
    if (!ready) return
    sizeCanvas()
    const onResize = () => sizeCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // ── The scroll-driven timeline ───────────────────────────────────────────────
  useGSAP(
    () => {
      if (!ready) return

      const travel = () => window.innerHeight * SPLIT_TRAVEL

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          pin: true,
          // Tight, because <SmoothScroll/> (Lenis) already interpolates the
          // scroll position itself. A big scrub value on top of that stacks two
          // lags and the film starts trailing the page.
          scrub: 0.35,
          onUpdate: draw,
          invalidateOnRefresh: true,
        },
      })

      // ── The bed — frame scrub + camera push run under everything ─────────────
      // Scrubbed act by act rather than at one flat rate, so the opening hero
      // shot gets a third of the scroll instead of a fifth. Each leg is still
      // linear (ease 'none' from defaults) — the rate changes only at the act
      // boundaries, which fall on cuts, so no leg visibly speeds up mid-shot.
      tl.to(render, { frame: ACT_OPEN_END, duration: 0.37 }, 0.03)
      tl.to(render, { frame: ACT_INNER_END, duration: 0.23 }, 0.4)
      tl.to(render, { frame: ACT_TUNNEL_END, duration: 0.09 }, 0.63)
      tl.to(render, { frame: FRAME_COUNT - 1, duration: 0.25 }, 0.72)

      // The machine flies in from deep in the lens and lands at full frame just
      // as the panels open; the rest is the slow push across the travel.
      // 'in', not 'out' — the machine must HOLD its distance while the headline
      // is still on screen and only close the gap at the end of the act. An
      // 'out' ease front-loads the travel and it arrives on top of the type.
      tl.to(render, { scale: ZOOM_OPEN, ease: 'power2.in', duration: 0.37 }, 0.03)
      tl.to(render, { scale: ZOOM_END, duration: 0.57 }, 0.4)

      // ── ACT 1 — the split ────────────────────────────────────────────────────
      // Eyebrow clears first so the words are alone as they part.
      tl.to('.cine-eyebrow', { opacity: 0, y: -18, duration: 0.04 }, 0.01)

      // The two halves travel apart, tracking wider as they go — the type reads
      // as being pulled open rather than simply moved.
      //
      // 'out', not 'inOut': an inOut ease leaves the split at near-zero velocity
      // for its first several percent, so even starting at 0.03 the words still
      // crept and the page read as unresponsive. An out-ease breaks them apart on
      // contact and settles into the travel.
      tl.to(
        '.split-top',
        { y: () => -travel(), letterSpacing: '0.13em', ease: 'power2.out', duration: 0.23 },
        0.03,
      )
      tl.to(
        '.split-bot',
        { y: () => travel(), letterSpacing: '0.13em', ease: 'power2.out', duration: 0.23 },
        0.03,
      )

      // The seam: a blue hairline that opens across the gap, then dims away.
      tl.fromTo(
        '.cine-seam',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: 'power2.out', duration: 0.13 },
        0.03,
      )
      tl.to('.cine-seam', { opacity: 0, duration: 0.09 }, 0.19)

      // The film opens out of the seam — aperture unclips vertically as it fades
      // up, so the video is revealed *by* the headline splitting.
      tl.fromTo(
        '.cine-aperture',
        { clipPath: 'inset(50% 0% 50% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          ease: 'power2.out',
          duration: 0.23,
        },
        0.03,
      )

      // Scroll cue clears the instant the split begins.
      tl.to('.cine-cue', { opacity: 0, duration: 0.04 }, 0.015)

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
      tl.to('.cine-dim', { opacity: 0.16, ease: 'power1.inOut', duration: 0.1 }, 0.03) // machine far back — barely needed
      tl.to('.cine-dim', { opacity: 0.04, ease: 'power1.inOut', duration: 0.07 }, 0.28) // ✦ the box opens — clear
      tl.to('.cine-dim', { opacity: 0.46, ease: 'power1.inOut', duration: 0.07 }, 0.46) // telemetry
      tl.to('.cine-dim', { opacity: 0.1, ease: 'power1.inOut', duration: 0.07 }, 0.62) // tunnel — clear
      tl.to('.cine-dim', { opacity: 0.58, ease: 'power1.inOut', duration: 0.06 }, 0.74) // sprint headline
      tl.to('.cine-dim', { opacity: 0.14, ease: 'power1.inOut', duration: 0.06 }, 0.87) // machine hero — clear
      tl.to('.cine-dim', { opacity: 0.62, ease: 'power1.inOut', duration: 0.06 }, 0.92) // resolve + CTAs
    },
    { scope: rootRef, dependencies: [ready] },
  )

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-apex-black"
    >
      {/* ─── The film, inside the aperture that the headline split opens ─── */}
      <div
        className="cine-aperture absolute inset-0 z-[1]"
        style={{ clipPath: 'inset(50% 0% 50% 0%)', opacity: 0 }}
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
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="w-full max-w-[1000px]">
          <div className="cine-eyebrow mb-7 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-apex-blue" />
            <span className="text-apex-blue font-mono text-[9px] font-medium tracking-[0.34em] uppercase">
              Elite Sports Performance Technology
            </span>
            <div className="w-8 h-px bg-apex-blue" />
          </div>

          <h1
            className="relative h-luxia leading-[0.94]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.4rem)', letterSpacing: '0.045em' }}
          >
            <div className="split-top will-change-transform">
              <span className="t-silver">TRAIN&nbsp;BEYOND</span>
            </div>

            {/* The seam the film opens out of, pinned to the split line */}
            <div
              className="cine-seam absolute left-1/2 top-1/2 h-px w-[46vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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

        {/* ACT 2 — telemetry HUD mid-travel.
            Flanked left/right rather than centred: the machine holds the middle
            of frame for the whole clip, so the instrument readout lives in the
            dark margins either side of it — and reads as an overlay ON the
            machine rather than copy fighting it. */}
        <div className="beat-2 absolute inset-0 opacity-0">
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
        </div>

        {/* ACT 3a — the promise, centred over the sprint, then gone */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h2
            className="beat-sprint h-luxia leading-[0.96] max-w-[900px] opacity-0"
            style={{ fontSize: 'clamp(1.9rem, 4.4vw, 4rem)', letterSpacing: '0.04em' }}
          >
            <span className="t-silver">ENGINEERED&nbsp;FOR&nbsp;THE</span>
            <br />
            <span className="t-blue">NEXT&nbsp;TENTH&nbsp;OF&nbsp;A&nbsp;SECOND</span>
          </h2>
        </div>

        {/* ACT 3b — the resolve + CTA */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="beat-3 max-w-[900px] opacity-0 pointer-events-auto">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#checkout"
              className="group inline-flex items-center gap-2.5 cta-glow text-white font-display font-semibold text-[11px] px-8 py-4 tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderRadius: 0 }}
            >
              Book Your Free Demo
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 bg-transparent border border-apex-line hover:border-apex-grey-dim text-apex-grey hover:text-apex-white font-display font-semibold text-[11px] px-8 py-4 tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderRadius: 0 }}
            >
              See T-Apex In Action
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
        </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="cine-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-apex-grey-dim font-mono text-[8px] tracking-[0.4em] uppercase">
          Scroll to enter
        </span>
        <div className="w-px h-8 overflow-hidden">
          <div
            className="w-px h-full"
            style={{
              background: 'linear-gradient(to bottom,#00AEEF,transparent)',
              animation: 'slow-sprint 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default function ScrollCinemaHero() {
  const [mode, setMode] = useState<'pending' | 'cinema' | 'fallback'>('pending')

  useEffect(() => {
    const bigEnough = window.matchMedia('(min-width: 1024px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMode(bigEnough && !reduced ? 'cinema' : 'fallback')
  }, [])

  // SSR / first paint: render the classic hero so there's never a blank frame.
  if (mode === 'cinema') return <CinemaImpl />
  return <Hero />
}

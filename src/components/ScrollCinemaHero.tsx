'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── Scroll-cinema hero ───────────────────────────────────────────────────────
// A pinned, scroll-scrubbed cinematic banner. As the visitor scrolls, we scrub a
// pre-extracted image sequence frame-by-frame (buttery, no <video> stutter) while
// pushing the "camera" into the frame — so it reads as *travelling through the
// machine*. Three copy beats (promise → telemetry → CTA) resolve over the top.
//
// Swap the footage by dropping a new numbered sequence into /public/hero-frames
// and updating FRAME_COUNT / FRAME_PATH below (see docs/motion-scroll-brief.md).
//
// Gracefully degrades: phones and `prefers-reduced-motion` users get the classic
// <Hero /> (no pin, no scrub) instead of this.

const FRAME_COUNT = 193
const FRAME_PATH = (i: number) =>
  `/hero-frames/frame-${String(i).padStart(3, '0')}.webp`

// How far (in px of scroll) the hero stays pinned. ~1.8 viewports ≈ an unhurried
// ~8s scroll-through on a typical trackpad.
const PIN_DISTANCE = '+=1750'

// Camera push: frame scale from start → end of the travel-through.
const ZOOM_START = 1.02
const ZOOM_END = 1.62

function CinemaImpl() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [ready, setReady] = useState(false)

  // Mutable render state the scroll timeline drives; the draw loop reads it.
  const render = useRef({ frame: 0, scale: ZOOM_START }).current

  // ── Preload the whole sequence up front so scrubbing never waits on I/O ──────
  useEffect(() => {
    let loaded = 0
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = img.onerror = () => {
        loaded++
        if (loaded === FRAME_COUNT) setReady(true)
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
    // Sub-frame blending: draw the frame below and cross-fade the frame above
    // by the fractional scroll position, so slow scrolls glide instead of
    // stepping between the 24fps source frames.
    const lo = Math.floor(render.frame)
    const hi = Math.min(lo + 1, FRAME_COUNT - 1)
    const frac = render.frame - lo
    const imgA = imagesRef.current[lo]
    const imgB = imagesRef.current[hi]
    if (!imgA || !imgA.complete || !imgA.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const ir = imgA.naturalWidth / imgA.naturalHeight
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
    ctx.globalAlpha = 1
    ctx.drawImage(imgA, dx, dy, dw, dh)
    if (frac > 0.01 && imgB && imgB.complete && imgB.naturalWidth) {
      ctx.globalAlpha = frac
      ctx.drawImage(imgB, dx, dy, dw, dh)
      ctx.globalAlpha = 1
    }
  }

  // ── Size the canvas backing store to the element (dpr-aware) ─────────────────
  const sizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    draw()
  }

  useEffect(() => {
    if (!ready) return
    sizeCanvas()
    draw()
    const onResize = () => sizeCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // ── The scroll-driven timeline: frame scrub + push-in + copy beats ───────────
  useGSAP(
    () => {
      if (!ready) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          pin: true,
          scrub: 1,
          onUpdate: draw,
          invalidateOnRefresh: true,
        },
      })

      // Frame scrub + camera push run across the whole pin, in lockstep.
      tl.to(render, { frame: FRAME_COUNT - 1 }, 0)
      tl.to(render, { scale: ZOOM_END }, 0)

      // Tunnel vignette closes in as we travel deeper into the machine.
      tl.fromTo('.cine-tunnel', { opacity: 0.15 }, { opacity: 0.9 }, 0)

      // Beat 1 — the promise. On screen at rest, then peels away as we push in.
      tl.to(
        '.beat-1',
        { opacity: 0, y: -70, ease: 'power1.in', duration: 0.22 },
        0.02,
      )

      // Beat 2 — telemetry HUD, revealed mid-travel then handed off.
      tl.fromTo(
        '.beat-2',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.18 },
        0.34,
      )
      tl.to('.beat-2', { opacity: 0, scale: 1.06, duration: 0.12 }, 0.6)

      // Beat 3 — the resolve: final line + CTAs land as the machine reassembles.
      tl.fromTo(
        '.beat-3',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.2 },
        0.74,
      )

      // Scroll cue fades the instant travel begins.
      tl.to('.cine-cue', { opacity: 0, duration: 0.04 }, 0.02)
    },
    { scope: rootRef, dependencies: [ready] },
  )

  return (
    <section ref={rootRef} id="hero" className="relative h-[100svh] w-full overflow-hidden bg-apex-black">
      {/* The scrubbed film */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Brand-tone wash + readability ramp over any frame */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'rgba(5,5,8,0.34)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 62% 42%, transparent 30%, rgba(5,8,14,0.6) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Tunnel vignette — intensifies on travel, sells the fly-through */}
      <div
        className="cine-tunnel absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, transparent 22%, rgba(3,5,9,0.55) 62%, rgba(2,3,6,0.96) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Centre reticle — a faint aerospace crosshair we push through */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-px w-[40vw]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(0,174,239,0.28),transparent)' }}
        />
        <div
          className="absolute w-px h-[30vh]"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(0,174,239,0.18),transparent)' }}
        />
      </div>

      {/* ─── Copy beats, all stacked centre-stage ─── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
        {/* Beat 1 — the promise */}
        <div className="beat-1 absolute max-w-[860px]">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-apex-blue" />
            <span className="text-apex-blue font-mono text-[9px] font-medium tracking-[0.34em] uppercase">
              Elite Sports Performance Technology
            </span>
            <div className="w-8 h-px bg-apex-blue" />
          </div>
          <h1
            className="h-luxia leading-[0.94]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.4rem)', letterSpacing: '0.045em' }}
          >
            <span className="t-silver">TRAIN&nbsp;BEYOND</span>
            <br />
            <span className="t-red">HUMAN&nbsp;LIMITS</span>
          </h1>
        </div>

        {/* Beat 2 — telemetry HUD mid-travel */}
        <div className="beat-2 absolute max-w-[900px] opacity-0">
          <p className="font-mono text-[10px] tracking-[0.34em] uppercase text-apex-blue mb-5">
            Adaptive Resistance Intelligence · Live
          </p>
          <div className="flex flex-wrap items-stretch justify-center gap-4 md:gap-8">
            {[
              { k: 'Force', v: '412', u: 'N' },
              { k: 'Velocity', v: '9.6', u: 'm/s' },
              { k: 'Response', v: '<2', u: 'ms' },
              { k: 'Control', v: '100', u: '%' },
            ].map((s) => (
              <div
                key={s.k}
                className="min-w-[7.5rem] border border-apex-line/70 bg-black/30 px-5 py-4 backdrop-blur-sm"
                style={{ borderRadius: 0 }}
              >
                <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-apex-grey-dim mb-2">
                  {s.k}
                </div>
                <div className="font-display font-black text-apex-white leading-none text-3xl md:text-4xl">
                  {s.v}
                  <span className="text-apex-blue text-base md:text-lg ml-1 align-top">{s.u}</span>
                </div>
              </div>
            ))}
          </div>
          <p
            className="mt-7 font-display font-black text-apex-white leading-tight mx-auto max-w-[620px]"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)' }}
          >
            Every rep, measured. Every session, an{' '}
            <span className="text-apex-blue">intelligence system</span>.
          </p>
        </div>

        {/* Beat 3 — the resolve + CTA */}
        <div className="beat-3 absolute max-w-[900px] opacity-0">
          <h2
            className="h-luxia leading-[0.96] mb-8"
            style={{ fontSize: 'clamp(1.9rem, 4.4vw, 4rem)', letterSpacing: '0.04em' }}
          >
            <span className="t-silver">ENGINEERED&nbsp;FOR&nbsp;THE</span>
            <br />
            <span className="t-blue">NEXT&nbsp;TENTH&nbsp;OF&nbsp;A&nbsp;SECOND</span>
          </h2>
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

      {/* Loading veil until frames are decoded (kept minimal + on-brand) */}
      {!ready && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-apex-black">
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-apex-grey-dim animate-pulse">
            Initialising
          </span>
        </div>
      )}
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

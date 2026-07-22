'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── Scroll-cinema hero — the "film title sequence" ───────────────────────────
// A full-bleed clip is pinned for ~2 viewports and given a slow cinematic
// push-in, driven by NATURAL scroll (ScrollTrigger scrub — no scroll hijack).
// Over it, three beats resolve in sequence as the visitor scrolls:
//   1) headline mask-wipes up   2) telemetry HUD counts up   3) resolve + CTAs.
// A faint drifting-particle canvas adds depth (the seed for a future 3D layer).
//
// Swap the footage by changing MEDIA_SRC / MEDIA_POSTER below.
//
// Gracefully degrades: phones + `prefers-reduced-motion` get the classic
// <Hero /> (no pin, no scrub).

const MEDIA_SRC = '/hero-video.mp4'
const MEDIA_POSTER = '/hero.webp'

// How far (px of scroll) the hero stays pinned. ~2.2 viewports ≈ an unhurried
// read-through without feeling stuck.
const PIN_DISTANCE = '+=2200'

// ── Ambient telemetry particles — cheap canvas drift, respects reduced-motion ──
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number }
    let parts: P[] = []

    const seed = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 26000) // density scales with area
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.5 + 0.1,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,174,239,${p.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    seed()
    tick()
    const onResize = () => seed()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

function CinemaImpl() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // Slow cinematic push-in on the film across the whole pin.
      tl.fromTo('.cine-media', { scale: 1.04 }, { scale: 1.18 }, 0)

      // Vignette closes a touch as we push in — adds depth.
      tl.fromTo('.cine-vignette', { opacity: 0.4 }, { opacity: 0.85 }, 0)

      // Scroll cue fades the instant travel begins.
      tl.to('.cine-cue', { opacity: 0, duration: 0.05 }, 0.01)

      // ── Beat 1 — the promise: headline lines mask-wipe up, then peel away ──
      tl.to('.line-1 .mask-inner', { yPercent: 0, duration: 0.14 }, 0.02)
      tl.to('.line-2 .mask-inner', { yPercent: 0, duration: 0.14 }, 0.08)
      tl.to('.beat-1', { opacity: 0, y: -60, filter: 'blur(8px)', ease: 'power1.in', duration: 0.12 }, 0.34)

      // ── Beat 2 — telemetry HUD: cards rise + numbers count up ──
      tl.fromTo(
        '.beat-2',
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.14 },
        0.42,
      )
      // Count-up: drive a proxy 0→1 and format each stat's number on update.
      const counter = { t: 0 }
      const stats = gsap.utils.toArray<HTMLElement>('.stat-num')
      tl.to(
        counter,
        {
          t: 1,
          duration: 0.16,
          ease: 'power1.out',
          onUpdate: () => {
            stats.forEach((el) => {
              const to = parseFloat(el.dataset.to || '0')
              const dec = parseInt(el.dataset.dec || '0', 10)
              el.textContent = (to * counter.t).toFixed(dec)
            })
          },
        },
        0.44,
      )
      tl.to('.beat-2', { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.1 }, 0.66)

      // ── Beat 3 — the resolve: final line + CTAs land as the frame settles ──
      tl.fromTo(
        '.beat-3',
        { opacity: 0, y: 56, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.16 },
        0.76,
      )
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative w-full overflow-hidden bg-apex-black"
      style={{ height: '100svh' }}
    >
      {/* The film — full-bleed, given a slow push-in */}
      <video
        className="cine-media absolute inset-0 h-full w-full object-cover"
        src={MEDIA_SRC}
        poster={MEDIA_POSTER}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Ambient telemetry particles */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none motion-reduce:hidden">
        <ParticleField />
      </div>

      {/* Brand-tone wash + readability ramp */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,8,0.34) 0%, rgba(5,5,8,0.16) 42%, rgba(5,8,14,0.64) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Tunnel vignette — intensifies on the push-in */}
      <div
        className="cine-vignette absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, transparent 26%, rgba(3,5,9,0.5) 66%, rgba(2,3,6,0.95) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top performance line */}
      <div
        className="absolute left-0 right-0 top-0 z-[4] h-[1.5px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D61F26 18%, #D61F26 82%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ─── Copy beats, stacked centre-stage ─── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
        {/* Beat 1 — the promise */}
        <div className="beat-1 absolute max-w-[880px]">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-apex-blue" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.34em] text-apex-blue">
              Elite Sports Performance Technology
            </span>
            <div className="h-px w-8 bg-apex-blue" />
          </div>
          <h1
            className="h-luxia leading-[0.92]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.4rem)', letterSpacing: '0.045em' }}
          >
            <span className="line-1 block overflow-hidden py-[0.06em]">
              <span className="mask-inner block" style={{ transform: 'translateY(115%)' }}>
                <span className="t-silver">TRAIN&nbsp;BEYOND</span>
              </span>
            </span>
            <span className="line-2 block overflow-hidden py-[0.06em]">
              <span className="mask-inner block" style={{ transform: 'translateY(115%)' }}>
                <span className="t-red">HUMAN&nbsp;LIMITS</span>
              </span>
            </span>
          </h1>
        </div>

        {/* Beat 2 — telemetry HUD */}
        <div className="beat-2 absolute max-w-[920px] opacity-0">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.34em] text-apex-blue">
            Adaptive Resistance Intelligence · Live
          </p>
          <div className="flex flex-wrap items-stretch justify-center gap-4 md:gap-7">
            {[
              { k: 'Force', to: '412', dec: 0, u: 'N' },
              { k: 'Velocity', to: '9.6', dec: 1, u: 'm/s' },
              { k: 'Response', to: '2', dec: 0, u: 'ms', pre: '<' },
              { k: 'Control', to: '100', dec: 0, u: '%' },
            ].map((s) => (
              <div
                key={s.k}
                className="min-w-[7.5rem] border border-apex-line/70 bg-black/30 px-5 py-4 backdrop-blur-sm"
                style={{ borderRadius: 0 }}
              >
                <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.3em] text-apex-grey-dim">
                  {s.k}
                </div>
                <div className="font-display text-3xl font-black leading-none text-apex-white md:text-4xl">
                  {s.pre}
                  <span className="stat-num" data-to={s.to} data-dec={s.dec}>
                    0
                  </span>
                  <span className="ml-1 align-top text-base text-apex-blue md:text-lg">{s.u}</span>
                </div>
              </div>
            ))}
          </div>
          <p
            className="mx-auto mt-7 max-w-[620px] font-display font-black leading-tight text-apex-white"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)' }}
          >
            Every rep, measured. Every session, an{' '}
            <span className="text-apex-blue">intelligence system</span>.
          </p>
        </div>

        {/* Beat 3 — the resolve + CTA */}
        <div className="beat-3 absolute max-w-[920px] opacity-0">
          <h2
            className="h-luxia mb-8 leading-[0.96]"
            style={{ fontSize: 'clamp(1.9rem, 4.4vw, 4rem)', letterSpacing: '0.04em' }}
          >
            <span className="t-silver">ENGINEERED&nbsp;FOR&nbsp;THE</span>
            <br />
            <span className="t-blue">NEXT&nbsp;TENTH&nbsp;OF&nbsp;A&nbsp;SECOND</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#checkout"
              className="group inline-flex items-center gap-2.5 cta-glow px-8 py-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderRadius: 0 }}
            >
              Book Your Free Demo
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 border border-apex-line bg-transparent px-8 py-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-apex-grey transition-all duration-300 hover:-translate-y-0.5 hover:border-apex-grey-dim hover:text-apex-white"
              style={{ borderRadius: 0 }}
            >
              See T-Apex In Action
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="cine-cue absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-apex-grey-dim">
          Scroll to begin
        </span>
        <div className="h-8 w-px overflow-hidden">
          <div
            className="h-full w-px"
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

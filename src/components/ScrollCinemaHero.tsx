'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './Hero'

gsap.registerPlugin(ScrollTrigger)

// ─── Scroll-cinema hero — "immersive scrub" (Ferrari-style, T-Apex tuned) ──────
// A centred card scrubs a frame sequence of real T-Apex footage while it scales
// up to fully immersive; the giant title words split apart then fade; at the end
// it collapses back and the resolve copy + CTAs land. Extra depth on top of the
// base pattern: a perspective TILT on the card (flattens as it immerses),
// aerospace HUD corner brackets, an ambient particle field and a telemetry
// overlay at the immersive peak.
//
// Swap the footage by dropping a numbered sequence into /public/hero-frames and
// updating FRAME_COUNT / FRAME_URL below.
//
// Gracefully degrades: phones + `prefers-reduced-motion` get the classic
// <Hero /> (no scrub).

const FRAME_COUNT = 147
const FRAME_URL = (i: number) => `/hero-frames/frame-${String(i + 1).padStart(3, '0')}.webp`

// Layout / feel constants (mirrors the reference, tuned for this footage).
const PIN_VH_MULTIPLE = 3.4 // total scroll length = (this + 1) × viewport
const IMMERSE_OVERFILL = 1.05
const CARD_START_SCALE = 0.62
const CARD_TILT = 9 // deg of perspective tilt at the "poster" state

// ── Ambient telemetry particles — cheap canvas drift ───────────────────────────
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
      const count = Math.round((w * h) / 28000)
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.45 + 0.1,
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

// ── Aerospace HUD bracket (one corner) ─────────────────────────────────────────
function Bracket({ className }: { className: string }) {
  return (
    <div className={`hud-bracket pointer-events-none absolute h-8 w-8 ${className}`} aria-hidden="true">
      <div className="absolute left-0 top-0 h-full w-px bg-apex-blue/60" />
      <div className="absolute left-0 top-0 h-px w-full bg-apex-blue/60" />
    </div>
  )
}

function CinemaImpl() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const lastDrawnRef = useRef<number>(-1)

  const cardRef = useRef<HTMLDivElement>(null)
  const titleTopRef = useRef<HTMLHeadingElement>(null)
  const titleBottomRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)
  const [aspect, setAspect] = useState(16 / 9)

  // ── Progressive frame preload (prioritise the first frames) ─────────────────
  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)
    imagesRef.current = images

    const onFirstReady = (img: HTMLImageElement) => {
      if (cancelled) return
      const canvas = canvasRef.current
      if (canvas && img.naturalWidth && img.naturalHeight) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d')?.drawImage(img, 0, 0)
        lastDrawnRef.current = 0
        setAspect(img.naturalWidth / img.naturalHeight)
      }
      setReady(true)
    }

    const loadOne = (i: number) => {
      const img = new window.Image()
      img.decoding = 'async'
      if (i < 4) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high'
      if (i === 0) img.onload = () => onFirstReady(img)
      img.src = FRAME_URL(i)
      images[i] = img
    }

    const INITIAL = Math.min(24, FRAME_COUNT)
    for (let i = 0; i < INITIAL; i++) loadOne(i)
    let cursor = INITIAL
    let timer: ReturnType<typeof setTimeout> | null = null
    const loadNext = () => {
      if (cancelled) return
      const end = Math.min(FRAME_COUNT, cursor + 20)
      for (let i = cursor; i < end; i++) loadOne(i)
      cursor = end
      if (cursor < FRAME_COUNT) timer = setTimeout(loadNext, 70)
    }
    timer = setTimeout(loadNext, 180)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [])

  // ── Entry animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from(cardRef.current, { opacity: 0, scale: 0.9, duration: 1.1, ease: 'power3.out' })
      tl.from(titleTopRef.current, { opacity: 0, y: 34, duration: 1, ease: 'expo.out' }, 0.35)
      tl.from(titleBottomRef.current, { opacity: 0, y: -34, duration: 1, ease: 'expo.out' }, 0.45)
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Scroll-driven choreography (sticky layout, scrub) ───────────────────────
  useEffect(() => {
    if (!ready) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const immerseScale = () => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const baseW = Math.min(vw * 0.96, vh * 0.72 * aspect)
        const baseH = Math.min(vh * 0.72, (vw * 0.96) / aspect)
        if (baseW <= 0 || baseH <= 0) return 1.6
        return Math.max(vw / baseW, vh / baseH) * IMMERSE_OVERFILL
      }

      const isLoaded = (i: number) => {
        const img = imagesRef.current[i]
        return !!img && img.complete && img.naturalWidth > 0
      }

      const drawFrame = (index: number) => {
        const canvas = canvasRef.current
        if (!canvas) return
        let useIdx = index
        if (!isLoaded(useIdx)) {
          let found = -1
          for (let d = 1; d < FRAME_COUNT; d++) {
            if (useIdx - d >= 0 && isLoaded(useIdx - d)) {
              found = useIdx - d
              break
            }
            if (useIdx + d < FRAME_COUNT && isLoaded(useIdx + d)) {
              found = useIdx + d
              break
            }
          }
          if (found === -1) return
          useIdx = found
        }
        if (lastDrawnRef.current === useIdx) return
        const img = imagesRef.current[useIdx]
        const c2 = canvas.getContext('2d')
        if (!c2 || !img) return
        c2.drawImage(img, 0, 0, canvas.width, canvas.height)
        lastDrawnRef.current = useIdx
      }

      // Poster state: small, tilted in 3D.
      gsap.set(cardRef.current, {
        scale: CARD_START_SCALE,
        rotateX: CARD_TILT,
        transformPerspective: 1400,
        transformOrigin: '50% 50%',
      })

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const mapped = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.63)
            drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(mapped * FRAME_COUNT)))
          },
        },
      })

      // Phase 1 (0 → .15): card squares up + flattens; titles ease apart.
      master.to(cardRef.current, { scale: 1, rotateX: 0, ease: 'power2.out', duration: 0.15 }, 0)
      master.to(titleTopRef.current, { x: () => (window.innerWidth < 768 ? '-68vw' : '-58vw'), ease: 'power2.inOut', duration: 0.15 }, 0)
      master.to(titleBottomRef.current, { x: () => (window.innerWidth < 768 ? '68vw' : '58vw'), ease: 'power2.inOut', duration: 0.15 }, 0)
      master.to(cueRef.current, { opacity: 0, duration: 0.05 }, 0)

      // Phase 2 (.15 → .78): immerse — card fills the screen, titles + HUD fade,
      // telemetry overlay resolves in and back out.
      master.to(cardRef.current, { scale: immerseScale, ease: 'power2.in', duration: 0.63 }, 0.15)
      master.to([titleTopRef.current, titleBottomRef.current], { opacity: 0, ease: 'power1.in', duration: 0.22 }, 0.15)
      master.to('.hud-bracket', { opacity: 0, ease: 'power1.in', duration: 0.18 }, 0.15)
      master.fromTo('.cine-telemetry', { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.14 }, 0.4)
      master.to('.cine-telemetry', { opacity: 0, ease: 'power1.in', duration: 0.12 }, 0.66)

      // Phase 3 (.78 → 1): collapse back to the tilted poster; resolve copy + CTAs.
      master.to(cardRef.current, { scale: CARD_START_SCALE, rotateX: CARD_TILT, ease: 'power3.inOut', duration: 0.22 }, 0.78)
      master.to([titleTopRef.current, titleBottomRef.current], { x: 0, opacity: 1, ease: 'power2.inOut', duration: 0.22 }, 0.78)
      master.to('.hud-bracket', { opacity: 1, ease: 'power1.out', duration: 0.18 }, 0.82)
      master.fromTo(eyebrowRef.current, { opacity: 0, y: -14 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.14 }, 0.84)
      master.fromTo(ctaRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.16 }, 0.86)

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [ready, aspect])

  const tallHeight = `${(PIN_VH_MULTIPLE + 1) * 100}vh`

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-clip bg-apex-black text-apex-white"
      style={{ height: tallHeight }}
      aria-label="Cinematic scroll hero"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
        {/* Depth: brand wash + particle field + vignette */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,174,239,0.08), transparent 68%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <ParticleField />
        </div>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 52%, rgba(2,3,6,0.72) 100%)' }}
          aria-hidden="true"
        />

        {/* Top performance line */}
        <div
          className="absolute left-0 right-0 top-0 z-[5] h-[1.5px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #D61F26 18%, #D61F26 82%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Eyebrow — resolves in at the end */}
        <div ref={eyebrowRef} className="absolute top-[12%] z-30 flex items-center gap-3 opacity-0 pointer-events-none">
          <div className="h-px w-8 bg-apex-blue" />
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.34em] text-apex-blue">
            Elite Sports Performance Technology
          </span>
          <div className="h-px w-8 bg-apex-blue" />
        </div>

        {/* Core stage: title / card / title */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-6">
          <h2
            ref={titleTopRef}
            className="h-luxia whitespace-nowrap"
            style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)', lineHeight: 0.88, letterSpacing: '0.02em' }}
          >
            <span className="t-silver">BEYOND</span>
          </h2>

          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[14px] shadow-[0_30px_100px_rgba(0,0,0,0.6)] ring-1 ring-apex-blue/25 will-change-transform"
            style={{
              width: `min(94vw, calc(70svh * ${aspect}))`,
              height: `min(70svh, 94vw / ${aspect})`,
              aspectRatio: aspect,
            }}
          >
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
            {/* Readability + brand-tone ramp over the footage */}
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: 'linear-gradient(180deg, rgba(5,5,8,0.16) 0%, transparent 40%, rgba(5,8,14,0.5) 100%)' }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.5)]" aria-hidden="true" />
            {/* HUD corner brackets */}
            <Bracket className="left-3 top-3" />
            <Bracket className="right-3 top-3 rotate-90" />
            <Bracket className="bottom-3 left-3 -rotate-90" />
            <Bracket className="bottom-3 right-3 rotate-180" />
            {/* Telemetry overlay — peaks while immersive */}
            <div className="cine-telemetry pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 opacity-0">
              <span className="whitespace-nowrap border border-apex-line/60 bg-black/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-apex-blue backdrop-blur-sm">
                Adaptive Resistance Intelligence · Live
              </span>
            </div>
          </div>

          <h2
            ref={titleBottomRef}
            className="h-luxia whitespace-nowrap"
            style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)', lineHeight: 0.88, letterSpacing: '0.02em' }}
          >
            <span className="t-red">LIMITS</span>
          </h2>
        </div>

        {/* Resolve CTAs — land at the end */}
        <div ref={ctaRef} className="absolute bottom-[9%] z-30 flex flex-wrap items-center justify-center gap-4 px-6 opacity-0">
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

        {/* Scroll cue */}
        <div ref={cueRef} className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-apex-grey-dim">Scroll to enter</span>
          <div className="h-8 w-px overflow-hidden">
            <div
              className="h-full w-px"
              style={{ background: 'linear-gradient(to bottom,#00AEEF,transparent)', animation: 'slow-sprint 1.8s ease-in-out infinite' }}
            />
          </div>
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

  if (mode === 'cinema') return <CinemaImpl />
  return <Hero />
}

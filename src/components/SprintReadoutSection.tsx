'use client'

import { useEffect, useRef, useState } from 'react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { useIsMobile } from './useIsMobile'

// ─── 01b — SPRINT READOUT ─────────────────────────────────────────────────────
// The hand-off out of the scroll-cinema hero. You've just watched the sprint;
// this section tilts the telemetry console up off the page and lays it flat as
// you scroll, so the run resolves into the data it produced.
//
// Motion comes from the generic <ContainerScroll> primitive in components/ui;
// everything here is the T-APEX dressing — square corners, apex.* surfaces, the
// metallic headline system. Keeping the two apart means the primitive stays a
// clean drop-in that can be updated from upstream.

export default function SprintReadoutSection() {
  const isMobile = useIsMobile()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  // The console footage is a perpetual loop — the one thing worth switching off
  // on phones and for reduced-motion users (see MotionProvider's note).
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reduced) {
      v.pause()
      return
    }
    // Only run the loop while the console is actually on screen.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduced])

  return (
    <section className="relative bg-apex-black overflow-hidden">
      {/* Blue signal wash bleeding down out of the hero */}
      <div
        className="absolute inset-x-0 top-0 h-[36rem] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(0,174,239,0.10), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <ContainerScroll
        // Finish the tilt as the console settles on screen, rather than upstream's
        // default which needs ~1500px of dead padding to resolve.
        offset={['start end', 'center center']}
        className="relative flex items-center justify-center px-4 md:px-10 py-16 md:py-24"
        cardClassName="max-w-6xl -mt-8 md:-mt-12 mx-auto h-[22rem] sm:h-[28rem] md:h-[40rem] w-full border border-apex-line bg-apex-panel p-1.5 md:p-3"
        innerClassName="relative h-full w-full overflow-hidden bg-apex-black"
        titleComponent={
          <div className="flex flex-col items-center text-center px-2 mb-6 md:mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-apex-blue" />
              <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
                Live Telemetry
              </span>
              <div className="w-8 h-px bg-apex-blue" />
            </div>

            <h2
              className="h-luxia t-silver leading-[0.9] max-w-4xl"
              style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
            >
              THE SPRINT <span className="t-blue">BECOMES A READOUT</span>
            </h2>

            <p className="mt-5 md:mt-7 max-w-2xl text-apex-grey text-sm md:text-base leading-relaxed">
              Every metre of that run is measured as it happens — force, velocity,
              time to peak — and lands on the console before the athlete walks back
              to the line.
            </p>
          </div>
        }
      >
        {/* ── Console screen ─────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/data-report.mp4"
          poster="/data-report-poster.jpg"
          muted
          loop
          playsInline
          preload={isMobile ? 'none' : 'metadata'}
          aria-label="T-APEX console showing live force, velocity and power telemetry from a sprint"
        />

        {/* HUD glass: scanlines + vignette so the footage reads as a screen */}
        <div className="hud-scanlines absolute inset-0 pointer-events-none opacity-40" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 120px 30px rgba(5,5,5,0.75)' }}
          aria-hidden="true"
        />

        {/* Corner ticks — the engineered frame used across the site */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-6 h-px bg-apex-blue/60" />
          <div className="absolute top-0 left-0 w-px h-6 bg-apex-blue/60" />
          <div className="absolute top-0 right-0 w-6 h-px bg-apex-blue/60" />
          <div className="absolute top-0 right-0 w-px h-6 bg-apex-blue/60" />
          <div className="absolute bottom-0 left-0 w-6 h-px bg-apex-blue/60" />
          <div className="absolute bottom-0 left-0 w-px h-6 bg-apex-blue/60" />
          <div className="absolute bottom-0 right-0 w-6 h-px bg-apex-blue/60" />
          <div className="absolute bottom-0 right-0 w-px h-6 bg-apex-blue/60" />
        </div>

        {/* Live badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2 border border-apex-line/80 bg-apex-black/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-apex-red opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-apex-red" />
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.28em] uppercase text-apex-grey-dim">
            Session Live
          </span>
        </div>
      </ContainerScroll>
    </section>
  )
}

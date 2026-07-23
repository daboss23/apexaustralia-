'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Smooth scroll (Lenis) ────────────────────────────────────────────────────
// Interpolates the raw wheel/touch scroll so scroll-driven animations (the
// frame-scrub hero especially) glide instead of stepping. Wired to GSAP the
// canonical way: Lenis emits `scroll` → ScrollTrigger.update; GSAP's ticker
// drives Lenis's rAF (single rAF loop, no drift). Disabled for users who ask
// for reduced motion so we never impose inertia on them.

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05, // inertia length — higher = more "glide"
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])

  return <>{children}</>
}

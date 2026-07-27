'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Smooth scroll ────────────────────────────────────────────────────────────
// A mouse wheel doesn't emit continuous motion — it fires discrete notches, each
// jumping the page ~100px at once. On an ordinary page you never notice, but the
// scroll-cinema hero maps scroll position straight onto film frames, so one
// notch = a visible jump of several frames. That reads as stutter no matter how
// dense the frame sequence is.
//
// Lenis interpolates the real scroll position toward the target every frame, so
// a wheel notch becomes a short eased glide and the scrub gets continuous input.
//
// The critical part is that Lenis and ScrollTrigger must share ONE clock. If
// both run their own RAF loop they read the scroll position at different moments
// in the frame and the hero judders — worse than no smoothing. So Lenis is
// driven from GSAP's ticker and ScrollTrigger is told to update on Lenis events.
//
// Disabled entirely for `prefers-reduced-motion` — hijacking scroll is exactly
// what that setting asks you not to do.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // Time-based easing; `duration` is how long it takes to converge on the
      // target. ~1.1s is long enough to erase wheel steps without feeling laggy.
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      // Leave touch alone: mobile already scrolls smoothly and momentum
      // scrolling fights any JS smoothing we add on top.
      smoothWheel: true,
      touchMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return null
}

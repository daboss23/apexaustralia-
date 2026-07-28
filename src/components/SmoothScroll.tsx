'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis, scrollToTarget } from '@/lib/scroll'

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
//
// This component also owns every *programmatic* jump on the page. `html {
// scroll-behavior: smooth }` used to handle anchor clicks, but the browser's
// smooth scroll and Lenis both write window.scrollY every frame and the result
// is a fight you can feel. Instead one delegated listener catches same-page hash
// clicks and routes them through `scrollToTarget()`, which uses Lenis when it's
// running and the native scroll when it isn't — and offsets for the fixed navbar
// either way, so a section never lands underneath it.
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null
    let raf: ((time: number) => void) | null = null

    if (!reduced) {
      lenis = new Lenis({
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

      raf = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      setLenis(lenis)
    }

    // ── Delegated same-page anchor handling ─────────────────────────────────
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href') || ''
      if (hash.length < 2) return
      if (scrollToTarget(hash)) {
        e.preventDefault()
        // Keep the URL honest without letting the browser also jump.
        history.replaceState(null, '', hash)
      }
    }
    document.addEventListener('click', onClick)

    // Deep link on first load: the target has to clear the navbar too, and the
    // frame sequence / images above it may still be settling, so do it once the
    // page has actually laid out.
    const hash = window.location.hash
    const deepLink = hash.length > 1 ? window.setTimeout(() => scrollToTarget(hash), 300) : 0

    return () => {
      document.removeEventListener('click', onClick)
      if (deepLink) clearTimeout(deepLink)
      if (raf) {
        gsap.ticker.remove(raf)
        gsap.ticker.lagSmoothing(500, 33)
      }
      setLenis(null)
      lenis?.destroy()
    }
  }, [])

  return null
}

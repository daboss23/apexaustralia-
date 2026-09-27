'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Video source (served from /public). */
  src: string
  /** Extra classes merged onto each stacked <video> layer. */
  className?: string
  /** Crossfade length, in seconds, applied at the loop seam. */
  fade?: number
  /** object-position for both layers, e.g. '50% 35%'. */
  objectPosition?: string
  /** Playback speed (1 = native). */
  playbackRate?: number
  /** Still shown in place of the film. */
  poster?: string
  /**
   * Render the poster only and never touch the video.
   *
   * Not a nicety: /hero-banner.mp4 is 13 MB and this component stacks *two*
   * <video preload="auto"> elements on it. Before the scroll-cinema hero decides
   * which mode it's in, it renders <Hero/> — so every visitor, on every device,
   * was kicking off that download for a hero they were about to replace. `still`
   * is how the caller says "this is a placeholder, don't spend the bandwidth".
   */
  still?: boolean
  /** Start loading this far outside the viewport. */
  rootMargin?: string
}

/**
 * Seamless looping background video — fills its (positioned) parent.
 *
 * A single `<video loop>` hard-cuts from its last frame back to its first, which
 * reads as a visible "jump" whenever those frames differ. Instead we stack two
 * copies of the clip and, in the final `fade` seconds of each pass, start the
 * second copy from 0 and crossfade it in on top of the first — so the seam is a
 * soft dissolve rather than a cut. The copies then swap roles and the cycle
 * repeats forever. Both <video> elements share one URL, so the file downloads
 * once and the second layer plays from cache.
 *
 * The two layers are wrapped in an `isolate`d box, so their internal z-indexing
 * never escapes — any overlay the parent paints after this component stays on
 * top. Falls back to a plain looping video under `prefers-reduced-motion`.
 *
 * Lazy, like <LazyVideo/>: neither layer gets a `src` until the box is within
 * `rootMargin` of the viewport, and the whole loop — both layers and the rAF
 * that drives the dissolve — pauses whenever the box is off screen, then picks
 * up where it left off. A hero at the top of the page is on screen at mount, so
 * it still starts at once; it just stops decoding once it's scrolled past.
 */
export default function SeamlessVideo({
  src,
  className = '',
  fade = 0.8,
  objectPosition = '50% 50%',
  playbackRate = 1,
  poster,
  still = false,
  rootMargin = '400px',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  // Latches true the first time the box comes near the viewport — the src gate.
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (still || near) return
    const el = wrapRef.current
    if (!el) return
    // No IntersectionObserver (very old browser): just load it.
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true)
    }, { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [still, near, rootMargin])

  useEffect(() => {
    if (still || !near) return
    const wrap = wrapRef.current
    const a = aRef.current
    const b = bRef.current
    if (!wrap || !a || !b) return

    // Runs the loop while on screen, parks it while off. Called by the
    // visibility observer below; `run` and `park` are set per mode.
    let run = () => {}
    let park = () => {}
    const watch = () => {
      if (typeof IntersectionObserver === 'undefined') {
        run()
        return () => park()
      }
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? run() : park()))
      io.observe(wrap)
      return () => {
        io.disconnect()
        park()
      }
    }

    a.playbackRate = playbackRate
    b.playbackRate = playbackRate

    // Reduced motion: one calmly-looping layer, no crossfade churn.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      b.style.opacity = '0'
      a.loop = true
      a.style.opacity = '1'
      run = () => { a.play().catch(() => {}) }
      park = () => a.pause()
      return watch()
    }

    let active = a
    let incoming = b
    let swapping = false
    let raf = 0

    a.style.opacity = '1'
    b.style.opacity = '0'

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const d = active.duration
      if (!d || !Number.isFinite(d)) return

      const timeLeft = d - active.currentTime
      if (timeLeft > fade) return

      // Entering the seam window — bring the other copy in from the top.
      if (!swapping) {
        swapping = true
        incoming.currentTime = 0
        incoming.style.zIndex = '2'
        active.style.zIndex = '1'
        incoming.play().catch(() => {})
      }

      const p = Math.min(1, Math.max(0, (fade - timeLeft) / fade))
      incoming.style.opacity = String(p)

      // Crossfade complete: promote the incoming copy, retire the old one.
      if (p >= 1 || active.ended) {
        incoming.style.opacity = '1'
        active.pause()
        active.style.opacity = '0'
        const prev = active
        active = incoming
        incoming = prev
        swapping = false
      }
    }

    a.currentTime = 0
    let running = false
    run = () => {
      if (running) return
      running = true
      active.play().catch(() => {})
      if (swapping) incoming.play().catch(() => {})
      raf = requestAnimationFrame(tick)
    }
    park = () => {
      running = false
      cancelAnimationFrame(raf)
      a.pause()
      b.pause()
    }
    return watch()
  }, [src, fade, playbackRate, still, near])

  const layer = `absolute inset-0 w-full h-full object-cover ${className}`

  if (still) {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ isolation: 'isolate' }} aria-hidden="true">
        {poster && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={poster} alt="" className={layer} style={{ objectPosition }} />
        )}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" style={{ isolation: 'isolate' }} aria-hidden="true">
      <video
        ref={aRef}
        {...(near ? { src } : {})}
        poster={poster}
        muted
        playsInline
        preload={near ? 'auto' : 'none'}
        tabIndex={-1}
        className={layer}
        style={{ opacity: 1, objectPosition }}
      />
      <video
        ref={bRef}
        {...(near ? { src } : {})}
        poster={poster}
        muted
        playsInline
        preload={near ? 'auto' : 'none'}
        tabIndex={-1}
        className={layer}
        style={{ opacity: 0, objectPosition }}
      />
    </div>
  )
}

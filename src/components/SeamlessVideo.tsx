'use client'

import { useEffect, useRef } from 'react'

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
 */
export default function SeamlessVideo({
  src,
  className = '',
  fade = 0.8,
  objectPosition = '50% 50%',
  playbackRate = 1,
}: Props) {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    if (!a || !b) return

    a.playbackRate = playbackRate
    b.playbackRate = playbackRate

    // Reduced motion: one calmly-looping layer, no crossfade churn.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      b.style.opacity = '0'
      a.loop = true
      a.style.opacity = '1'
      a.play().catch(() => {})
      return
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
    a.play().catch(() => {})
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [src, fade, playbackRate])

  const layer = `absolute inset-0 w-full h-full object-cover ${className}`

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ isolation: 'isolate' }} aria-hidden="true">
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className={layer}
        style={{ opacity: 1, objectPosition }}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className={layer}
        style={{ opacity: 0, objectPosition }}
      />
    </div>
  )
}

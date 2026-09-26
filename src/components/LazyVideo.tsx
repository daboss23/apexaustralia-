'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Props = {
  src: string
  poster?: string
  className?: string
  style?: CSSProperties
  /** Passed through to the <video>, e.g. 'T-Apex unit turning in space'. */
  'aria-label'?: string
  /** Start loading this far outside the viewport. */
  rootMargin?: string
  loop?: boolean
  playbackRate?: number
}

/**
 * A background video that costs nothing until it is nearly on screen.
 *
 * The section videos on this page are the bulk of the site's weight —
 * data-report.mp4 alone is 6.9 MB and sits two thirds of the way down. Written
 * as a plain autoplaying `<video src>` the browser starts pulling all of them
 * during the first screenful, on a phone, over mobile data, competing with the
 * hero for bandwidth. Nobody has scrolled to any of them yet.
 *
 * So: no `src` on the element until an IntersectionObserver says we're close,
 * then play. It also pauses whenever it leaves the viewport — decoding video
 * nobody can see is pure battery.
 *
 * Under `prefers-reduced-motion` the clip still loads and paints, but is held on
 * its first frame rather than looping.
 */
export default function LazyVideo({
  src,
  poster,
  className = '',
  style,
  rootMargin = '400px',
  loop = true,
  playbackRate = 1,
  ...rest
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)
  const holdRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    holdRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = () => {
      if (!holdRef.current) el.play().catch(() => {})
    }

    // No IntersectionObserver (very old browser): just load it.
    if (typeof IntersectionObserver === 'undefined') {
      setLoad(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true)
          start()
        } else if (!el.paused) {
          el.pause()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const el = ref.current
    if (el && load) {
      el.playbackRate = playbackRate
      if (!holdRef.current) el.play().catch(() => {})
    }
  }, [load, playbackRate])

  return (
    <video
      ref={ref}
      {...(load ? { src } : {})}
      poster={poster}
      muted
      loop={loop}
      playsInline
      preload="none"
      className={className}
      style={style}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  )
}

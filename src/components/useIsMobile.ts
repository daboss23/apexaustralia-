'use client'

import { useEffect, useState } from 'react'

/**
 * True on phone-width viewports.
 *
 * Starts `false` and corrects in an effect — deliberately, even though reading
 * matchMedia in the initial state looks tidier. The static export ships HTML
 * rendered with `false`; if the first *client* render answered `true`, React
 * would hydrate a tree that doesn't match the markup and bail out of hydration
 * for that subtree (errors #418 / #423 — which is exactly what the phone build
 * was throwing). One extra render after mount is the cheap half of that trade.
 *
 * Used to switch OFF the handful of genuinely *perpetual* (always-looping)
 * animations on phones — the ones that quietly drain the battery — while leaving
 * cheap, one-shot scroll/interaction reveals running everywhere.
 */
export function useIsMobile(query = '(max-width: 767px)') {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMobile(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])

  return mobile
}

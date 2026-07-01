'use client'

import { useEffect, useState } from 'react'

/**
 * True on phone-width viewports. SSR-safe: lazily initialised from matchMedia so
 * the value is correct on the very first client render (the server renders
 * `false`, then the client corrects on mount).
 *
 * Used to switch OFF the handful of genuinely *perpetual* (always-looping)
 * animations on phones — the ones that quietly drain the battery — while leaving
 * cheap, one-shot scroll/interaction reveals running everywhere.
 */
export function useIsMobile(query = '(max-width: 767px)') {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMobile(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])

  return mobile
}

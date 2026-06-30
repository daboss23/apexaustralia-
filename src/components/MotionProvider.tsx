'use client'

import { MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'

// On phones, force Framer Motion into reduced-motion. This stops the perpetual
// transform-driven loops (drifting particles, sweeping streaks, etc.) and turns
// reveal slide-ups into simple fades — content still animates in via opacity,
// but the device isn't compositing dozens of infinite animations every frame.
// Lazy-initialised from matchMedia so it's correct on the very first client
// render (MotionConfig emits no DOM, so there's no hydration mismatch).
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)')
    const on = () => setMobile(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])

  return <MotionConfig reducedMotion={mobile ? 'always' : 'never'}>{children}</MotionConfig>
}

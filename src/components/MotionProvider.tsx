'use client'

import { MotionConfig } from 'framer-motion'

// Honour the operating-system "reduce motion" setting only.
//
// We deliberately no longer force reduced-motion on phones. That blanket switch
// killed the site's signature scroll-triggered motion on mobile — the counting
// stat flashes, the data-line boot surge, the sport slider crossfades and the
// portrait mirror sweep all went dead. Instead, the few genuinely *perpetual*
// (always-looping) animations that actually cost battery are switched off
// per-component on phones via `useIsMobile`, while cheap one-shot reveals play
// everywhere. MotionConfig emits no DOM, so there's no hydration mismatch.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

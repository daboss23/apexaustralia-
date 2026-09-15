'use client'

import { useCallback, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/* ── GlowCard — cursor-tracked spotlight card ─────────────────────────────────
   A panel whose border lights up where the cursor is, with a soft wash of the
   same colour bleeding inward. Tuned to the site rather than the stock
   component it came from: square corners (the site's corners are square), and
   the glow takes the brand accents — `#D61F26` performance red and `#00AEEF`
   electric blue — instead of the original purple.

   How the ring is drawn: one layer carries a radial gradient centred on the
   cursor, masked with the standard border-box/content-box `exclude` trick so
   only the 1px ring survives. Nothing animates layout or paint beyond opacity
   and a gradient position, so it stays cheap at three cards side by side.

   Pointer position is written straight to CSS custom properties inside a rAF —
   React state here would re-render the card on every mousemove.

   No hover on a phone, so on touch the glow simply never fires. That's fine:
   it's decorative, and the card is designed to read without it (see the
   CLAUDE.md note — hover-revealed things that *do* something need `md:`, but
   decorative glows are fine as-is). Under `prefers-reduced-motion` the glow
   holds still at the card's centre instead of chasing the cursor.          */

type GlowCardProps = {
  children?: ReactNode
  /** Glow colour. Use the site accents: `#D61F26` red or `#00AEEF` blue. */
  glowColor?: string
  /** Spotlight diameter in px. */
  size?: number
  className?: string
  style?: CSSProperties
}

export function GlowCard({
  children,
  glowColor = '#D61F26',
  size = 340,
  className = '',
  style,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (frame.current !== null) return
    const { clientX, clientY } = e
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const r = el.getBoundingClientRect()
      el.style.setProperty('--gx', `${clientX - r.left}px`)
      el.style.setProperty('--gy', `${clientY - r.top}px`)
    })
  }, [])

  /* The ring runs a bright crown into the accent — a flat accent gradient on a
     1.5px edge is too dim to register as "lit". The wash uses the accent
     straight, and a tighter falloff, so the interior stays a tint rather than
     a coloured panel. */
  const ringLayer: CSSProperties = {
    background: `radial-gradient(${size}px circle at var(--gx) var(--gy), #FFFFFF, ${glowColor} 18%, ${glowColor}00 62%)`,
  }
  const washLayer: CSSProperties = {
    background: `radial-gradient(${Math.round(size * 0.85)}px circle at var(--gx) var(--gy), ${glowColor}, transparent 64%)`,
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      /* The outer bloom is a box-shadow on this element rather than another
         layer: `overflow-hidden` (passed in by the caller to clip the media)
         would crop any child that tried to bleed past the edge, but it never
         clips the element's own shadow. */
      className={`group/glow relative transition-shadow duration-500 hover:shadow-[0_0_45px_-12px_var(--glow-color)] ${className}`}
      style={
        {
          borderRadius: 0,
          '--glow-color': glowColor,
          // Centre by default, so the first frame before any pointer move —
          // and every reduced-motion viewer — gets a sane spotlight position.
          '--gx': '50%',
          '--gy': '50%',
          ...style,
        } as CSSProperties
      }
    >
      {children}

      {/* Border ring — the gradient, masked down to the edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          ...ringLayer,
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Interior wash — the light the ring throws into the card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-[0.18]"
        style={{ ...washLayer, mixBlendMode: 'screen' }}
      />
    </div>
  )
}

export default GlowCard

'use client'

import { ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SeamlessVideo from './SeamlessVideo'

// ─── Hero scene — the cinematic banner, brought alive ─────────────────────────
// The top-of-site banner: a seamless, crossfade-looping film rendered as a
// fixed-aspect stage on lg+ screens. The live headline / copy / CTAs are passed
// in as children and rendered in the left column over a dark ramp that keeps
// them legible across any frame of the footage. A slow scroll parallax adds
// depth; the loop itself is handled by <SeamlessVideo> (no visible seam).

export default function HeroScene({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll()
  const sceneY = useTransform(scrollY, [0, 700], [0, -45])

  return (
    <div className="relative w-full overflow-hidden bg-apex-black" style={{ aspectRatio: '1537 / 1023' }}>
      {/* The film, with a slow cinematic parallax on scroll */}
      <motion.div className="absolute inset-0" style={{ y: sceneY, willChange: 'transform' }}>
        <SeamlessVideo src="/cinematic-banner.mp4" objectPosition="56% 42%" fade={0.9} />

        {/* Speed streaks — ambient light passing the athlete */}
        <div
          className="absolute h-[2px] w-[34vw] top-[27%] z-[4]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.4), transparent)',
            animation: 'energy-streak-rtl 8s linear infinite',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute h-[3px] w-[42vw] top-[46%] z-[4]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.35), transparent)',
            animation: 'energy-streak-rtl 11s linear infinite',
            animationDelay: '2.8s',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute h-px w-[28vw] top-[62%] z-[4]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,59,48,0.3), transparent)',
            animation: 'energy-streak-rtl 9s linear infinite',
            animationDelay: '5.5s',
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Left atmosphere ramp — keeps the copy column readable over any footage */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: 'linear-gradient(90deg, rgba(5,5,8,0.9) 0%, rgba(5,5,8,0.6) 24%, rgba(5,5,8,0.2) 44%, transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Live content column — headline / copy / CTAs */}
      <div className="absolute z-20" style={{ left: '3.5%', top: '10%', width: '44%' }}>
        {children}
      </div>

      {/* Seating: vignette under the navbar, fade into the next section */}
      <div
        className="absolute top-0 inset-x-0 h-[14%] pointer-events-none z-[3]"
        style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.85), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[8%] pointer-events-none z-[3]"
        style={{ background: 'linear-gradient(0deg, #050505, transparent)' }}
        aria-hidden="true"
      />

      {/* Top performance line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D61F26 18%, #D61F26 82%, transparent 100%)' }}
        aria-hidden="true"
      />
    </div>
  )
}

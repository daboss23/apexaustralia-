'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Cinematic "mirror wave" sweep for a framed photo.
 *
 * A narrow vertical band travels left→right across the image when the frame
 * scrolls into view. Inside the band the photo ripples (an animated SVG
 * displacement map — like light bending through glass/water) and a soft
 * specular sheen rides along with it. The band sweeps off the frame edge and
 * vanishes (the parent frame is overflow-hidden), then repeats periodically.
 *
 * Drop it inside a `relative overflow-hidden` frame, after the base <Image>:
 *   <PortraitWaveSweep src="/piero.webp" />
 *
 * Honours prefers-reduced-motion (renders nothing when set).
 */
export default function PortraitWaveSweep({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // Replays each time the frame re-enters view (once:false default).
  const inView = useInView(ref, { amount: 0.5 })
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])

  const active = inView && !reduced
  const fid = 'piero-wave'

  // Vertical band sweeping across, then held off-frame (hidden) between passes.
  const clipKeys = [
    'inset(0% 100% 0% 0%)', // off the left edge — hidden
    'inset(0% 84% 0% 0%)',
    'inset(0% 60% 0% 14%)',
    'inset(0% 37% 0% 37%)',
    'inset(0% 14% 0% 60%)',
    'inset(0% 0% 0% 84%)',
    'inset(0% 0% 0% 100%)', // off the right edge — hidden
  ]
  const sweepTimes = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]
  const sweep = {
    duration: 1.9,
    times: sweepTimes,
    repeat: Infinity,
    repeatDelay: 3.4,
    ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
  }

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {active && (
        <>
          {/* Displacement filter — the water/glass ripple, gently shimmering */}
          <svg className="absolute w-0 h-0">
            <filter id={fid} x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.028" numOctaves="2" seed="7" result="noise">
                <animate
                  attributeName="baseFrequency"
                  dur="7s"
                  values="0.008 0.028;0.011 0.038;0.008 0.028"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          {/* The travelling band: a rippled, lightly lifted copy of the photo */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: clipKeys[0] }}
            animate={{ clipPath: clipKeys }}
            transition={sweep}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{
                // match the base photo's grade so only the ripple + sheen read,
                // not a hard-edged brightness rectangle at the band edges
                filter: `url(#${fid}) saturate(0.94) contrast(1.04)`,
                transform: 'scale(1.045)',
                transformOrigin: 'center top',
              }}
            />
            {/* glassy specular sheen riding inside the band */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(102deg, transparent 28%, rgba(255,255,255,0.08) 44%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.07) 56%, transparent 72%)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Crisp leading highlight — the bright edge of the passing light */}
          <motion.div
            className="absolute top-0 bottom-0 w-[9%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              filter: 'blur(2px)',
              mixBlendMode: 'screen',
            }}
            initial={{ left: '-10%', opacity: 0 }}
            animate={{ left: ['-10%', '-4%', '104%', '110%'], opacity: [0, 0.85, 0.85, 0] }}
            transition={{ ...sweep, times: [0, 0.08, 0.92, 1] }}
          />
        </>
      )}
    </div>
  )
}

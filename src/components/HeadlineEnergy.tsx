'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

// ─── Headline telemetry energy system ─────────────────────────────────────────
// Engineered performance telemetry moving through the hero headline — an F1
// data system, not lightning. Seven layers:
//
//   1  Primary energy network — two horizontal streams with hand-drawn
//      varying-width channels: electric-blue (telemetry, slow, upper third)
//      and T-Apex red (force output, medium, rhythmic pulse, lower third).
//      A bright comet core travels each channel inside a soft mask, so its
//      thickness follows the channel; smooth branches fade in occasionally.
//   2  Frequency waves — ECG / oscilloscope / sine telemetry marching
//      horizontally on seamless loops, fading in and out, crossing each other.
//   3  Letter interaction — the blue channel bends under the O of BEYOND and
//      blooms as the comet passes it; reflections flare on the metal edges in
//      sync with each passing core (timings share the comet's duration).
//   4  Electrical events — tiny recurring spikes every 3–5 s: an arc from N
//      to D, a spark running down the edge of H, a flash beneath LIMITS.
//   5  Energy bloom — screen-blended lens bloom (core + halo + anamorphic
//      streak), not neon glow.
//   6  Data ghosting — 5–10 % opacity readouts, force curves, vector paths.
//   7  Motion — every layer runs at its own speed; nothing moves together.
//
// Deterministic geometry renders on the server; only the random drift
// particles are generated client-side (hydration-safe, skipped under
// prefers-reduced-motion). All loops are CSS keyframes ("tele-*" in
// globals.css) so the global reduced-motion rule neutralises them.
//
// Rendered as two layers around the headline text (which sits at z-[1]):
// the field at z-0 behind the letters, interactions/events at z-[2] above.

// Shared box — extends past the headline so streams run beyond the words.
// viewBox 0 0 1000 560 maps onto it; the text block spans y ≈ 125–423
// (line 1: 125–274, line 2: 274–423).
const FIELD_BOX = 'absolute -inset-x-[10%] -top-[42%] -bottom-[46%] pointer-events-none select-none'

const EDGE_MASK: CSSProperties = {
  maskImage: 'radial-gradient(150% 130% at 50% 50%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
  WebkitMaskImage: 'radial-gradient(150% 130% at 50% 50%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
}

// ── Layer 1 · stream channels (closed ribbons, width varies 10 → 30 px) ─────

// Blue telemetry channel — spine wanders around y 150 (upper third of line 1),
// pinches thin (10), swells thick (30), and bends down under the O of BEYOND
// (measured: O spans x 516–586, centre ≈ 551).
const CHANNEL_BLUE =
  'M -40 142 C 20 142, 90 142, 140 142 C 195 142, 245 137, 300 135 ' +
  'C 355 133, 410 143, 460 146.5 C 492 148.7, 521 150.5, 551 151.5 ' +
  'C 590 152.7, 625 144.5, 660 142 C 707 138.7, 753 138.4, 800 138 ' +
  'C 880 137.4, 950 139.5, 1040 140 ' +
  'L 1040 158 C 950 158.5, 880 158.3, 800 158 C 753 157.7, 707 158.2, 660 158 ' +
  'C 625 157.8, 590 166.2, 551 165.5 C 521 164.9, 492 161.5, 460 158.5 ' +
  'C 410 153.8, 355 168, 300 165 C 245 162.4, 195 152.3, 140 152 ' +
  'C 90 151.7, 20 158.4, -40 158 Z'

// Red force channel — spine around y 400 (lower third of line 2), heavier.
const CHANNEL_RED =
  'M -40 391 C 27 392.8, 110 396, 160 396.5 C 220 397.1, 280 383, 340 380 ' +
  'C 400 377, 465 394.4, 520 396.5 C 580 398.8, 645 386.9, 700 385 ' +
  'C 755 383.1, 805 395.4, 860 396.5 C 925 397.8, 980 391.6, 1040 390 ' +
  'L 1040 410 C 980 410.6, 925 408.1, 860 407.5 C 805 406.9, 755 411.4, 700 411 ' +
  'C 645 410.6, 580 409.9, 520 409.5 C 465 409.2, 400 413, 340 412 ' +
  'C 280 411, 220 407.9, 160 407.5 C 110 407.2, 27 408.6, -40 409 Z'

// Channel centre hairlines (carry a fine flowing data-bit dash)
const SPINE_BLUE =
  'M -40 150 C 60 147, 200 144.5, 320 149 C 420 152.5, 500 156.5, 551 158.5 C 600 159.5, 630 151, 660 150 C 720 148, 880 148.5, 1040 149'
const SPINE_RED =
  'M -40 400 C 100 401.5, 240 394, 360 393.5 C 480 403, 600 396, 720 397.5 C 840 402.5, 950 398, 1040 400'

// Smooth occasional branches — split channels, not lightning
const BRANCH_BLUE_1 = 'M 296 146 C 330 138, 356 128, 392 124 C 420 121, 444 124, 462 130'
const BRANCH_BLUE_2 = 'M 642 152 C 668 158, 688 168, 716 172 C 742 176, 764 174, 782 168'
const BRANCH_RED_1 = 'M 338 396 C 368 388, 392 380, 424 378 C 448 376, 468 380, 484 386'
const BRANCH_RED_2 = 'M 698 402 C 724 408, 744 416, 772 420 C 790 422, 804 421, 814 418'

// Comet — the travelling energy mass (bright head, long tapered tail)
const COMET = 'M 0 0 C -22 -11, -90 -7.5, -300 -2 L -300 2 C -90 7.5, -22 11, 0 0 Z'

// ── Layer 2 · frequency wave builders (periodic → seamless translateX loop) ──

function sineWave(y: number, amp: number, period: number, x0: number, x1: number) {
  let d = `M ${x0} ${y}`
  for (let x = x0; x < x1; x += period) {
    d += ` q ${period / 4} ${-2 * amp} ${period / 2} 0 q ${period / 4} ${2 * amp} ${period / 2} 0`
  }
  return d
}

function ecgWave(y: number, x0: number, x1: number) {
  let d = `M ${x0} ${y}`
  for (let x = x0; x < x1; x += 240) {
    d += ' h 92 l 8 -6 l 6 10 l 7 -46 l 7 52 l 6 -16 l 8 6 h 106'
  }
  return d
}

function pulseWave(y: number, x0: number, x1: number) {
  let d = `M ${x0} ${y}`
  for (let x = x0; x < x1; x += 200) {
    d += ' h 58 l 6 -22 h 30 l 6 22 h 24 l 6 14 h 28 l 6 -14 h 36'
  }
  return d
}

const WAVES: Array<{
  d: string; stroke: string; width: number; shift: string
  drift: string; fade: string; delay: string; mdOnly?: boolean
}> = [
  // blue sine riding behind line 1
  { d: sineWave(210, 14, 80, -340, 1340), stroke: '#2CC0F8', width: 1.5, shift: '-80px', drift: '7s', fade: '13s', delay: '0s' },
  // blue ECG above the headline
  { d: ecgWave(120, -500, 1340), stroke: '#7FD8FF', width: 1.4, shift: '-240px', drift: '9.5s', fade: '17s', delay: '-6s' },
  // red oscilloscope behind line 2 (drifts the other way)
  { d: sineWave(350, 8, 120, -380, 1340), stroke: '#FF5A4D', width: 1.5, shift: '120px', drift: '8.5s', fade: '11s', delay: '-3s' },
  // red pulse wave below the headline …
  { d: pulseWave(452, -460, 1340), stroke: '#FF5A4D', width: 1.4, shift: '-200px', drift: '12s', fade: '19s', delay: '-9s' },
  // … crossed by a fine blue sine weaving through it
  { d: sineWave(458, 5, 50, -310, 1340), stroke: '#7FD8FF', width: 1.2, shift: '-50px', drift: '5.5s', fade: '9s', delay: '-1.5s' },
  // long slow blue undulation crossing the upper waves (desktop only)
  { d: sineWave(180, 38, 400, -660, 1460), stroke: '#2CC0F8', width: 1, shift: '-400px', drift: '21s', fade: '23s', delay: '-11s', mdOnly: true },
]

// ── Layers 3–5 · interaction points, events, blooms ─────────────────────────
// The blue comet crosses x = 551 (the O of BEYOND) at ~54 % of its run; the
// red comet crosses LIMITS (x ≈ 588) at ~56 % — tele-bloom-pass peaks at 55 %,
// so any element given the comet's duration lights up exactly as it passes.

const BLUE_DUR = '14s' // Layer 7: blue telemetry = slow
const RED_DUR = '9s' //            red force     = medium

type SparkDot = {
  left: number; top: number
  dx: number[]; dy: number[]
  dur: number; delay: number; size: number; color: string
}

export default function HeadlineEnergy({ appearDelay = 0 }: { appearDelay?: number }) {
  // Layer 7 — random drift particles, client-only (SSR-safe), skipped when
  // the user prefers reduced motion.
  const [sparks, setSparks] = useState<SparkDot[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = (a: number, b: number) => a + Math.random() * (b - a)
    const blue = ['#7FD8FF', '#2CC0F8', '#EAF9FF']
    const red = ['#FF8A7A', '#FF5A4D', '#FFD9D4']
    setSparks(
      Array.from({ length: 16 }, (_, i) => {
        const isBlue = i < 10
        return {
          left: r(2, 96),
          top: isBlue ? r(22, 32) : r(66, 77), // emitted along each stream
          dx: [0, r(-30, 30), r(-30, 30), 0],
          dy: [0, r(-22, 22), r(-22, 22), 0],
          dur: r(2.5, 6),
          delay: r(0, 5),
          size: r(1.2, 2.6),
          color: (isBlue ? blue : red)[i % 3],
        }
      })
    )
  }, [])

  return (
    <>
      {/* ════ UNDER-LAYER (z-0, behind the letters) ════ */}
      <motion.div
        aria-hidden="true"
        className={`${FIELD_BOX} z-0`}
        style={EDGE_MASK}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: appearDelay }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 560" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <defs>
            {/* channel bodies fade out toward both ends */}
            <linearGradient id="tg-body-b" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#00AEEF" stopOpacity="0" />
              <stop offset="0.18" stopColor="#00AEEF" stopOpacity="0.6" />
              <stop offset="0.5" stopColor="#2CC0F8" stopOpacity="1" />
              <stop offset="0.82" stopColor="#00AEEF" stopOpacity="0.6" />
              <stop offset="1" stopColor="#00AEEF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tg-body-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#D61F26" stopOpacity="0" />
              <stop offset="0.18" stopColor="#FF3B30" stopOpacity="0.65" />
              <stop offset="0.5" stopColor="#FF5A4D" stopOpacity="1" />
              <stop offset="0.82" stopColor="#FF3B30" stopOpacity="0.65" />
              <stop offset="1" stopColor="#D61F26" stopOpacity="0" />
            </linearGradient>
            {/* hairlines / branches */}
            <linearGradient id="tg-line-b" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#2CC0F8" stopOpacity="0" />
              <stop offset="0.15" stopColor="#2CC0F8" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#7FD8FF" stopOpacity="1" />
              <stop offset="0.85" stopColor="#2CC0F8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#2CC0F8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tg-line-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FF5A4D" stopOpacity="0" />
              <stop offset="0.15" stopColor="#FF5A4D" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#FF8A7A" stopOpacity="1" />
              <stop offset="0.85" stopColor="#FF5A4D" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FF5A4D" stopOpacity="0" />
            </linearGradient>
            {/* comet bodies: transparent tail → hot head */}
            <linearGradient id="tg-comet-b" gradientUnits="userSpaceOnUse" x1="-300" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#00AEEF" stopOpacity="0" />
              <stop offset="0.45" stopColor="#00AEEF" stopOpacity="0.35" />
              <stop offset="0.8" stopColor="#7FD8FF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#EAF9FF" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="tg-comet-r" gradientUnits="userSpaceOnUse" x1="-300" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#D61F26" stopOpacity="0" />
              <stop offset="0.45" stopColor="#FF3B30" stopOpacity="0.4" />
              <stop offset="0.8" stopColor="#FF8A7A" stopOpacity="0.85" />
              <stop offset="1" stopColor="#FFD9D4" stopOpacity="1" />
            </linearGradient>
            <filter id="tg-soft" x="-15%" y="-200%" width="130%" height="500%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="tg-wide" x="-15%" y="-600%" width="130%" height="1300%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id="tg-maskblur" x="-15%" y="-300%" width="130%" height="700%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
            {/* comets ride a fixed line; the soft channel mask shapes their
                thickness to the ribbon's pinches and swells */}
            <mask id="tg-mask-b" maskUnits="userSpaceOnUse" x="-60" y="80" width="1160" height="150">
              <path d={CHANNEL_BLUE} fill="#fff" filter="url(#tg-maskblur)" />
              <path d={CHANNEL_BLUE} stroke="#fff" strokeWidth="5" opacity="0.55" filter="url(#tg-maskblur)" />
            </mask>
            <mask id="tg-mask-r" maskUnits="userSpaceOnUse" x="-60" y="330" width="1160" height="140">
              <path d={CHANNEL_RED} fill="#fff" filter="url(#tg-maskblur)" />
              <path d={CHANNEL_RED} stroke="#fff" strokeWidth="5" opacity="0.55" filter="url(#tg-maskblur)" />
            </mask>
          </defs>

          {/* ── Layer 6 · data ghosting (5–10 %, almost invisible) ── */}
          <g className="tele-ghost hidden md:inline" opacity="0.085">
            <text x="28" y="64" fontSize="11" className="font-mono" fill="#7FD8FF" letterSpacing="1">237.4 Hz</text>
            <text x="28" y="80" fontSize="11" className="font-mono" fill="#7FD8FF" letterSpacing="1">Δ 0.042 s</text>
            <path d="M 28 92 h 64 M 28 88 v 8 M 60 89.5 v 5 M 92 88 v 8" stroke="#7FD8FF" strokeWidth="1" />
            {/* force curve, axes + trace */}
            <path d="M 845 235 V 320 H 968" stroke="#FF8A7A" strokeWidth="1" />
            <path d="M 845 318 C 875 310, 898 284, 912 266 C 926 250, 946 243, 966 241" stroke="#FF8A7A" strokeWidth="1.2" />
            <circle cx="966" cy="241" r="2" fill="#FF8A7A" />
            <text x="845" y="332" fontSize="10" className="font-mono" fill="#FF8A7A" letterSpacing="1">F(t) kN</text>
            {/* vector path with arrowhead */}
            <path d="M 540 60 L 760 84 M 760 84 l -10 -1.5 M 760 84 l -7 -7" stroke="#7FD8FF" strokeWidth="1" strokeDasharray="5 6" />
            <text x="700" y="72" fontSize="10" className="font-mono" fill="#7FD8FF" letterSpacing="1">v 9.42</text>
            {/* oscilloscope square trace, lower left */}
            <path d="M 60 506 h 26 v -12 h 22 v 12 h 18 v -7 h 22 v 7 h 26 v -12 h 20 v 12 h 24" stroke="#7FD8FF" strokeWidth="1" />
            {/* frequency scale, far right */}
            <path d="M 985 130 V 410 M 981 150 h 8 M 981 220 h 8 M 981 290 h 8 M 981 360 h 8" stroke="#9FB3C8" strokeWidth="1" />
            <text x="958" y="154" fontSize="9" className="font-mono" fill="#9FB3C8">400</text>
            <text x="958" y="294" fontSize="9" className="font-mono" fill="#9FB3C8">200</text>
          </g>

          {/* ── Layer 2 · frequency waves ── */}
          {WAVES.map((w, i) => (
            <g
              key={i}
              className={`tele-wave${w.mdOnly ? ' hidden md:inline' : ''}`}
              style={{ '--wave-shift': w.shift, '--drift-dur': w.drift, '--fade-dur': w.fade, '--fade-delay': w.delay } as CSSProperties}
            >
              <path d={w.d} stroke={w.stroke} strokeWidth={w.width} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}

          {/* ── Layer 1 · blue telemetry stream (slow) ── */}
          <g>
            <path d={CHANNEL_BLUE} fill="url(#tg-body-b)" opacity="0.3" filter="url(#tg-wide)" />
            <path d={CHANNEL_BLUE} fill="url(#tg-body-b)" opacity="0.5" filter="url(#tg-soft)" />
            <path d={SPINE_BLUE} stroke="url(#tg-line-b)" strokeWidth="1.2" opacity="0.7" />
            {/* data bits streaming along the spine */}
            <path
              d={SPINE_BLUE} pathLength={1} stroke="#7FD8FF" strokeWidth="2" opacity="0.7"
              strokeDasharray="0.012 0.038" className="tele-flow" style={{ animationDuration: '3.4s' }}
            />
            {/* occasional branches */}
            <path d={BRANCH_BLUE_1} pathLength={1} stroke="url(#tg-line-b)" strokeWidth="1.4" strokeDasharray="0.3 0.7"
              className="tele-branch" style={{ '--flow-dur': '2.2s', '--fade-dur': '8s', '--fade-delay': '-2s' } as CSSProperties} />
            <path d={BRANCH_BLUE_2} pathLength={1} stroke="url(#tg-line-b)" strokeWidth="1.4" strokeDasharray="0.3 0.7"
              className="tele-branch" style={{ '--flow-dur': '2.6s', '--fade-dur': '12.5s', '--fade-delay': '-7s' } as CSSProperties} />
            {/* travelling core */}
            <g mask="url(#tg-mask-b)">
              <g transform="translate(0 150)">
                <g className="tele-comet" style={{ '--from': '-320px', '--to': '1300px', animationDuration: BLUE_DUR } as CSSProperties}>
                  <ellipse cx="-10" cy="0" rx="26" ry="13" fill="#2CC0F8" opacity="0.45" filter="url(#tg-soft)" />
                  <path d={COMET} fill="url(#tg-comet-b)" filter="url(#tg-soft)" />
                  <path d={COMET} fill="url(#tg-comet-b)" opacity="0.9" />
                  <ellipse cx="-5" cy="0" rx="12" ry="6" fill="#EAF9FF" opacity="0.95" filter="url(#tg-soft)" />
                  <circle cx="-4" cy="0" r="2.6" fill="#FFFFFF" />
                </g>
              </g>
            </g>
          </g>

          {/* ── Layer 1 · red force stream (medium, rhythmic) ── */}
          <g className="tele-force-pulse">
            <path d={CHANNEL_RED} fill="url(#tg-body-r)" opacity="0.24" filter="url(#tg-wide)" />
            <path d={CHANNEL_RED} fill="url(#tg-body-r)" opacity="0.44" filter="url(#tg-soft)" />
            <path d={SPINE_RED} stroke="url(#tg-line-r)" strokeWidth="1.2" opacity="0.55" />
            <path
              d={SPINE_RED} pathLength={1} stroke="#FF8A7A" strokeWidth="2" opacity="0.6"
              strokeDasharray="0.012 0.038" className="tele-flow" style={{ animationDuration: '2.1s' }}
            />
            <path d={BRANCH_RED_1} pathLength={1} stroke="url(#tg-line-r)" strokeWidth="1.4" strokeDasharray="0.3 0.7"
              className="tele-branch" style={{ '--flow-dur': '1.9s', '--fade-dur': '9.5s', '--fade-delay': '-4s' } as CSSProperties} />
            <path d={BRANCH_RED_2} pathLength={1} stroke="url(#tg-line-r)" strokeWidth="1.4" strokeDasharray="0.3 0.7"
              className="tele-branch" style={{ '--flow-dur': '2.3s', '--fade-dur': '11s', '--fade-delay': '-1s' } as CSSProperties} />
            <g mask="url(#tg-mask-r)">
              <g transform="translate(0 400)">
                <g className="tele-comet" style={{ '--from': '-320px', '--to': '1300px', animationDuration: RED_DUR } as CSSProperties}>
                  <ellipse cx="-10" cy="0" rx="28" ry="14" fill="#FF3B30" opacity="0.5" filter="url(#tg-soft)" />
                  <path d={COMET} fill="url(#tg-comet-r)" filter="url(#tg-soft)" />
                  <path d={COMET} fill="url(#tg-comet-r)" opacity="0.95" />
                  <ellipse cx="-5" cy="0" rx="13" ry="6.5" fill="#FFD9D4" opacity="0.95" filter="url(#tg-soft)" />
                  <circle cx="-4" cy="0" r="2.8" fill="#FFFFFF" />
                </g>
              </g>
            </g>
          </g>
        </svg>

        {/* Layer 5 — ambient telemetry bloom over the channel's thickest swell */}
        <div
          className="absolute tele-breathe"
          style={{
            left: '22%', top: '17%', width: '18%', height: '20%',
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(127,216,255,0.5), rgba(0,174,239,0.18) 45%, transparent 75%)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* ════ OVER-LAYER (z-[2], reacting with the letters) ════ */}
      <motion.div
        aria-hidden="true"
        className={`${FIELD_BOX} z-[2]`}
        style={EDGE_MASK}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: appearDelay + 0.3 }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 560" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="tg-flash-r" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FF5A4D" stopOpacity="0.5" />
              <stop offset="0.6" stopColor="#FF3B30" stopOpacity="0.18" />
              <stop offset="1" stopColor="#FF3B30" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Layer 4 · electrical events (tiny, every 3–5 s) ── */}
          {/* arc jumps N → D in BEYOND (measured letter tops) */}
          <g className="tele-event" style={{ animationDuration: '5.3s', animationDelay: '1.2s', filter: 'drop-shadow(0 0 3px #7FD8FF)' }}>
            <path d="M 619 142 Q 651 120 683 140" stroke="#CFF3FF" strokeWidth="1" />
            <circle cx="619" cy="142" r="1.3" fill="#EAF9FF" />
            <circle cx="683" cy="140" r="1.3" fill="#EAF9FF" />
          </g>
          {/* spark runs down the left edge of H in HUMAN */}
          <path
            d="M 90 282 L 90 412" pathLength={1} strokeDasharray="0.22 0.78"
            stroke="#FFE8E4" strokeWidth="1.7" strokeLinecap="round"
            className="tele-edge-run"
            style={{ animationDuration: '4.1s', filter: 'drop-shadow(0 0 4px #FF5A4D)' }}
          />
          {/* small flash beneath LIMITS (spans x 451–726) */}
          <g className="tele-flash" style={{ animationDuration: '3.7s', animationDelay: '2.6s' }}>
            <ellipse cx="588" cy="438" rx="140" ry="13" fill="url(#tg-flash-r)" />
            <path d="M 466 434 H 712" stroke="url(#tg-line-r)" strokeWidth="1" opacity="0.7" />
          </g>
        </svg>

        {/* ── Layer 3+5 · synced blooms + metal-edge reflections ──
            same duration as each comet → they flare exactly on its pass
            (the comets cross these x positions at ~53 % of their run) */}
        {/* blue bloom at the O of BEYOND (O centre ≈ 55.1 %, stream y ≈ 27.7 %) */}
        <div className="absolute tele-bloom-pass" style={{ left: '55.1%', top: '27.7%', animationDuration: BLUE_DUR, '--bloom-max': 0.75, mixBlendMode: 'screen' } as CSSProperties}>
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 170, height: 110, background: 'radial-gradient(50% 50% at 50% 50%, rgba(127,216,255,0.34), rgba(0,174,239,0.12) 50%, transparent 78%)' }} />
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 64, height: 40, background: 'radial-gradient(50% 50% at 50% 50%, rgba(234,249,255,0.6), transparent 70%)' }} />
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 230, height: 2, background: 'linear-gradient(90deg, transparent, rgba(180,232,255,0.55), transparent)' }} />
        </div>
        {/* its reflection on the metal top edge of the O */}
        <div
          className="absolute tele-bloom-pass"
          style={{
            left: '52.3%', top: '24%', width: '5.6%', height: 1.5,
            background: 'linear-gradient(90deg, transparent, rgba(234,249,255,0.9), transparent)',
            animationDuration: BLUE_DUR, '--bloom-max': 0.55,
          } as CSSProperties}
        />
        {/* red force bloom across LIMITS (centre ≈ 58.8 %, stream y ≈ 71.4 %) */}
        <div className="absolute tele-bloom-pass" style={{ left: '58.8%', top: '71.4%', animationDuration: RED_DUR, '--bloom-max': 0.6, mixBlendMode: 'screen' } as CSSProperties}>
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 190, height: 110, background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,138,122,0.3), rgba(214,31,38,0.12) 50%, transparent 78%)' }} />
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 70, height: 42, background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,217,212,0.55), transparent 70%)' }} />
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: 250, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,179,166,0.5), transparent)' }} />
        </div>
        {/* its reflection on the bottom edge of LIMITS */}
        <div
          className="absolute tele-bloom-pass"
          style={{
            left: '54.3%', top: '75.5%', width: '9%', height: 1.5,
            background: 'linear-gradient(90deg, transparent, rgba(255,217,212,0.85), transparent)',
            animationDuration: RED_DUR, '--bloom-max': 0.45,
          } as CSSProperties}
        />

        {/* ── Layer 7 · random drift particles along the streams ── */}
        {sparks.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            }}
            animate={{ x: s.dx, y: s.dy, opacity: [0, 0.85, 0.4, 0] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.7, 1] }}
          />
        ))}
      </motion.div>
    </>
  )
}

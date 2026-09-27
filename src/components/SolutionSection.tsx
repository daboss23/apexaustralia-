'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import LazyVideo from './LazyVideo'

const SOLUTION_PILLARS = [
  {
    label: 'Precision Loading',
    tag: 'Control',
    body: 'Apply resistance and assistance with fine control across acceleration, deceleration, change of direction, and movement-specific work.',
  },
  {
    label: 'Adaptive Response',
    tag: 'Intelligence',
    body: 'Resistance designed to respond to athlete movement and intent — a more responsive loading environment than a fixed, preset stimulus.',
  },
  {
    label: 'Multi-Phase Utility',
    tag: 'Versatility',
    body: 'One system across speed development, force production, control work, progressive reconditioning, and controlled return-to-play.',
  },
]

// ─── Pillar card (presentational) ─────────────────────────────────────────────

function PillarCard({ pillar, side = 'right' }: { pillar: typeof SOLUTION_PILLARS[0]; side?: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <div className={`flex items-start gap-3 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Merge point — glowing dot + thin fading line, identical to the
          "Engineered like nothing else" callouts. Points toward the unit. */}
      <div className={`flex items-center gap-1.5 flex-shrink-0 mt-1 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-apex-blue" style={{ boxShadow: '0 0 8px #00AEEF' }} />
        <div
          className="w-8 h-px"
          style={{ background: isLeft ? 'linear-gradient(90deg, #00AEEF, transparent)' : 'linear-gradient(270deg, #00AEEF, transparent)' }}
        />
      </div>

      {/* Label — slim, box-less */}
      <div className={`min-w-0 ${isLeft ? 'text-right' : 'text-left'}`}>
        <span className="block text-[8px] font-mono tracking-[0.24em] text-apex-blue uppercase mb-1.5">
          {pillar.tag}
        </span>
        <h3
          className="font-display font-bold text-apex-white leading-snug mb-2"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)' }}
        >
          {pillar.label}
        </h3>
        <p className="text-apex-grey font-body text-[13px] leading-relaxed">{pillar.body}</p>
      </div>
    </div>
  )
}

// ─── Solution section ─────────────────────────────────────────────────────────

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  // Boot trigger — fires when the section is well into view, and re-arms
  // each time it leaves so the boot sequence replays on every scroll-in
  const booted = useInView(sectionRef, { margin: '-30% 0px' })
  const filmRef = useRef<HTMLDivElement>(null)
  const filmInView = useInView(filmRef, { once: true, margin: '-10% 0px' })

  return (
    <section ref={sectionRef} id="solution" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
      {/* Top rule — draws on as the system comes online */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={booted ? { scaleX: 1 } : { scaleX: 0 }}
        transition={booted ? { duration: 1.4, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
      />

      {/* Boot-up scan sweep — bright leading edge dragging a long energy trail */}
      {booted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              width: '34%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(0,174,239,0.03) 30%, rgba(0,174,239,0.08) 62%, rgba(0,174,239,0.16) 82%, rgba(0,174,239,0.32) 93%, rgba(0,174,239,0.7) 97.5%, rgba(0,174,239,0.12) 99%, transparent 100%)',
            }}
            initial={{ x: '-105%', opacity: 1 }}
            animate={{ x: '400%', opacity: [1, 1, 1, 0] }}
            transition={{ duration: 4.6, ease: [0.4, 0, 0.3, 1] }}
          >
            {/* Glowing scan line at the head of the trail */}
            <div
              className="absolute inset-y-0 right-[2%] w-px"
              style={{
                background: 'rgba(160,225,255,0.9)',
                boxShadow: '0 0 18px 4px rgba(0,174,239,0.55), 0 0 50px 14px rgba(0,174,239,0.25)',
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(0,174,239,0.07), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-12 lg:gap-20 items-start">
          {/* Left — headline + intro copy */}
          <div>
            <motion.h2
              className="h-luxia t-silver leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              MEET THE SMARTER<br />
              <motion.span
                className="t-blue inline-block"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [0, 1, 0.4, 1] } : {}}
                transition={{ duration: 0.7, delay: 0.5, times: [0, 0.45, 0.65, 1] }}
              >
                RESISTANCE SYSTEM.
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex is an intelligent resistance training device built to challenge movement with
              real control, fast response, and clear intent.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              It gives coaches a smarter way to load, guide, and
              develop athletes across every phase of training — from acceleration and speed
              work through to controlled return-to-play and progressive reconditioning.
            </motion.p>
          </div>

          {/* Right — emphasis callout + core mechanism */}
          <div className="lg:pt-4">
            <motion.div
              className="border-l-4 border-apex-blue pl-6 py-2 mb-8"
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <p
                className="font-display font-black t-feature leading-tight"
                style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)' }}
              >
                Not just another resistance tool — a smarter training system for
                coaches who demand more.
              </p>
            </motion.div>

            {/* ARI mechanism support line */}
            <motion.div
              className="relative p-6"
              style={{
                background: 'rgba(20,20,24,0.7)',
                border: '1px solid rgba(0,174,239,0.22)',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {/* Left accent draws on like a powering-up indicator */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-apex-blue origin-top"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="text-[9px] font-mono tracking-[0.26em] uppercase" style={{ color: 'rgba(0,174,239,0.85)' }}>
                  The Core Mechanism
                </div>
                <motion.div
                  className="flex items-center gap-1.5"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.15 }}
                >
                  <span className="text-[7px] font-mono text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-apex-grey font-body leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                At the core of T-Apex is{' '}
                <span className="text-apex-white font-display font-bold">Adaptive Resistance Intelligence</span>{' '}
                — an approach designed to make resistance training more accurate,
                more adaptable, and more useful on real training floors.
                <span
                  className="inline-block w-[6px] h-[11px] ml-1.5 bg-apex-blue/80 align-baseline"
                  style={{ animation: 'caret-blink 1.1s steps(1, end) infinite' }}
                  aria-hidden="true"
                />
              </p>
            </motion.div>
          </div>
        </div>

      </div>

      {/* ── The unit in motion — full-bleed film, melted into the black ──
          Same treatment as the data-report film in DataInsightsSection: edge
          to edge, a tint scrim, then a top/bottom vignette that reaches solid
          #050505 before the clip's edge so no hard video outline shows. The
          sides are feathered too, so the frame has no edge anywhere.
          hero-banner.mp4 is the phone hero's clip — one file, one cache entry. */}
      <motion.div
        ref={filmRef}
        className="relative w-full mt-12 md:mt-20 overflow-hidden aspect-[16/10] md:aspect-video"
        initial={{ opacity: 0, y: 16 }}
        animate={filmInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <LazyVideo
          src="/hero-banner.mp4"
          aria-label="T-Apex adaptive resistance unit in motion"
          className="absolute inset-0 w-full h-full object-cover object-[50%_45%]"
        />

        {/* Overall darkening scrim — same tint depth as the hero banner */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,5,8,0.35)' }} />

        {/* Top & bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #050505 0%, rgba(5,5,5,0.85) 7%, transparent 22%, transparent 66%, rgba(5,5,5,0.8) 86%, #050505 96%)' }}
        />
        {/* Side feather — the film fades out into the page at both edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #050505 0%, transparent 16%, transparent 84%, #050505 100%)' }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Pillars beneath the film */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-4 md:mt-2">
          {SOLUTION_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 18 }}
              animate={filmInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <PillarCard pillar={pillar} side="right" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

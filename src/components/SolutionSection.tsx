'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import ElectricAura from './ElectricAura'
import { useIsMobile } from './useIsMobile'

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

// Desktop stage positions: each pillar materializes around the floating unit,
// connected to it by a hairline. anchor/from are % of the stage (x, y).
// anchor = where the connector meets the callout (its dot); target = the
// lock-on reticle on the unit. The hairline runs anchor → elbow → target.
const STAGE_CARDS = [
  { seq: 0, side: 'left' as const, pos: { left: 0, top: '14%' } as const, anchor: { x: 18, y: 16 }, target: { x: 30, y: 36 } },
  { seq: 1, side: 'right' as const, pos: { right: 0, top: '10%' } as const, anchor: { x: 82, y: 12 }, target: { x: 60, y: 30 } },
  { seq: 2, side: 'right' as const, pos: { right: '1%', bottom: '8%' } as const, anchor: { x: 82, y: 80 }, target: { x: 66, y: 62 } },
]

const CARD_LINE_AT = (seq: number) => 0.45 + seq * 0.7
const CARD_AT = (seq: number) => 0.75 + seq * 0.7

type Riser = { left: number; bottom: number; size: number; dur: number; delay: number; drift: number; color: string }

// ─── Floating T-Apex unit — mystical, high-tech centrepiece ──────────────────

function FloatingUnit({ active }: { active: boolean }) {
  // Rising energy particles around the unit (client-only for SSR safety,
  // skipped under prefers-reduced-motion)
  const [risers, setRisers] = useState<Riser[]>([])
  // Phones: hold the unit still (the slow float loop is perpetual = battery).
  const isMobile = useIsMobile()
  // The product film — a slow turntable of the unit with its background removed
  // and composited onto pure black, so `mix-blend-mode: screen` drops the black
  // and leaves the unit floating in the section's energy field (the same
  // treatment the static art used). Held on its first frame under reduced motion.
  const unitRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = unitRef.current
    if (v && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay')
      v.pause()
    }
  }, [])

  useEffect(() => {
    // Off under reduced-motion and on phones (perpetual particles = mobile heat).
    if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return
    const r = (a: number, b: number) => a + Math.random() * (b - a)
    const colors = ['#00AEEF', '#7fd8ff', '#ff3b30']
    setRisers(
      Array.from({ length: 14 }, () => ({
        left: r(28, 72),
        bottom: r(8, 22),
        size: r(1.5, 3.5),
        dur: r(4, 8),
        delay: r(0, 5),
        drift: r(-18, 18),
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    )
  }, [])

  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Ambient energy field behind the unit */}
      <div
        className="absolute inset-x-[10%] inset-y-[6%]"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 55%, rgba(0,174,239,0.13), rgba(214,31,38,0.05) 55%, transparent 75%)',
          animation: 'energy-breathe 6s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Orbiting energy rings beneath the unit */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[74%] h-[24%]"
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <ellipse cx="200" cy="45" rx="190" ry="36" stroke="rgba(0,174,239,0.25)" strokeWidth="1" strokeDasharray="3 9" style={{ animation: 'freq-march 9s linear infinite' }} />
        <ellipse cx="200" cy="45" rx="140" ry="25" stroke="rgba(214,31,38,0.22)" strokeWidth="1" strokeDasharray="2 8" style={{ animation: 'freq-march 7s linear infinite reverse' }} />
        <ellipse cx="200" cy="45" rx="95" ry="16" stroke="rgba(0,174,239,0.38)" strokeWidth="1.2" strokeDasharray="5 12" style={{ animation: 'freq-march 11s linear infinite' }} />
      </svg>

      {/* Floor glow the unit hovers above */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[5%] w-[44%] h-[9%]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,174,239,0.28), transparent 70%)',
          filter: 'blur(14px)',
          animation: 'energy-breathe 5s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* The unit — floating, slowly turning in space */}
      <div className="absolute inset-x-0 top-[2%] bottom-[12%] flex items-center justify-center" style={{ perspective: 1200 }}>
        <motion.div
          className="relative h-[92%] max-w-full"
          style={{ transformStyle: 'preserve-3d', aspectRatio: '1 / 1' }}
          animate={
            active && !isMobile
              ? { y: [-10, 10], rotateY: [-9, 9], rotateX: [1.5, -1.5] }
              : {}
          }
          transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          <video
            ref={unitRef}
            src="/product-rotation.mp4"
            poster="/product-rotation-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-label="T-Apex adaptive resistance unit turning in space"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Rotation-light sheen travelling across the metalwork */}
          <div className="absolute inset-[12%] overflow-hidden" aria-hidden="true">
            <div
              className="absolute inset-y-0 w-[26%]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(180,225,255,0.5), transparent)',
                mixBlendMode: 'overlay',
                animation: 'sheen-sweep 9s ease-in-out infinite',
              }}
            />
          </div>

          {/* Electricity living around the unit */}
          <div className="absolute inset-[8%]">
            <ElectricAura appearDelay={0.6} />
          </div>
        </motion.div>
      </div>

      {/* Rising energy particles */}
      {risers.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{ y: [0, -130], x: [0, p.drift], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

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

// ─── Lock-on reticle — same brackets as the product-showcase callouts ─────────

function LockReticle({ target, active, delay }: { target: { x: number; y: number }; active: boolean; delay: number }) {
  return (
    <motion.div
      className="absolute hidden xl:block pointer-events-none z-20"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        width: 22,
        height: 22,
        marginLeft: -11,
        marginTop: -11,
        filter: 'drop-shadow(0 0 6px rgba(0,174,239,0.7))',
      }}
      initial={{ opacity: 0, scale: 2.6 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 2.6 }}
      transition={active ? { duration: 0.4, delay, ease: [0.2, 1.1, 0.3, 1] } : { duration: 0 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 22 22" fill="none" className="w-full h-full">
        <path d="M1 6V1h5" stroke="#00AEEF" strokeWidth="1.3" />
        <path d="M16 1h5v5" stroke="#00AEEF" strokeWidth="1.3" />
        <path d="M21 16v5h-5" stroke="#00AEEF" strokeWidth="1.3" />
        <path d="M6 21H1v-5" stroke="#00AEEF" strokeWidth="1.3" />
        <circle cx="11" cy="11" r="1.3" fill="#00AEEF" />
      </svg>
    </motion.div>
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
  // Stage trigger — the floating unit + emerging cards replay on every pass
  const stageRef = useRef<HTMLDivElement>(null)
  const stageActive = useInView(stageRef, { amount: 0.35 })

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

        {/* ── The unit, floating in space — pillars materialize as it turns ── */}
        <div ref={stageRef} className="relative mt-10 lg:mt-4 h-[400px] sm:h-[480px] lg:h-[640px]">
          <FloatingUnit active={stageActive} />

          {/* Connector hairlines (lg+) — same structure as the "Engineered like
              nothing else" callouts: dot → hairline (with an elbow) → reticle. */}
          <svg
            className="absolute inset-0 w-full h-full hidden xl:block pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {STAGE_CARDS.map(c => {
              const elbowX = c.target.x + (c.side === 'left' ? -6 : 6)
              const d = `M ${c.anchor.x} ${c.anchor.y} L ${elbowX} ${c.anchor.y} L ${c.target.x} ${c.target.y}`
              return (
                <motion.path
                  key={c.seq}
                  d={d}
                  fill="none"
                  stroke="rgba(0,174,239,0.55)"
                  strokeWidth="0.18"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={stageActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={
                    stageActive
                      ? { pathLength: { duration: 0.5, delay: CARD_LINE_AT(c.seq) + 0.15, ease: 'linear' }, opacity: { duration: 0.01, delay: CARD_LINE_AT(c.seq) + 0.15 } }
                      : { duration: 0 }
                  }
                />
              )
            })}
          </svg>

          {/* Lock-on reticles on the unit */}
          {STAGE_CARDS.map(c => (
            <LockReticle key={c.seq} target={c.target} active={stageActive} delay={CARD_LINE_AT(c.seq)} />
          ))}

          {/* Pillars around the unit (lg+) */}
          {STAGE_CARDS.map(({ seq, side, pos }) => (
            <motion.div
              key={seq}
              className="absolute hidden xl:block w-[210px] z-10"
              style={pos}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={stageActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
              transition={
                stageActive
                  ? { duration: 0.55, delay: CARD_AT(seq), ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0 }
              }
            >
              <PillarCard pillar={SOLUTION_PILLARS[seq]} side={side} />
            </motion.div>
          ))}
        </div>

        {/* Pillars stacked below the unit (mobile / tablet / lg) */}
        <div className="xl:hidden flex flex-col gap-4 mt-8">
          {SOLUTION_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <PillarCard pillar={pillar} side="right" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

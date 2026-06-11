'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import ElectricAura from './ElectricAura'

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
const STAGE_CARDS = [
  { seq: 0, pos: { left: 0, top: '10%' } as const, from: { x: 41, y: 38 }, to: { x: 26, y: 22 } },
  { seq: 1, pos: { right: 0, top: '6%' } as const, from: { x: 59, y: 34 }, to: { x: 74, y: 18 } },
  { seq: 2, pos: { right: '1%', bottom: '4%' } as const, from: { x: 58, y: 60 }, to: { x: 73, y: 80 } },
]

const CARD_LINE_AT = (seq: number) => 0.45 + seq * 0.7
const CARD_AT = (seq: number) => 0.75 + seq * 0.7

type Riser = { left: number; bottom: number; size: number; dur: number; delay: number; drift: number; color: string }

// ─── Floating T-Apex unit — mystical, high-tech centrepiece ──────────────────

function FloatingUnit({ active }: { active: boolean }) {
  // Rising energy particles around the unit (client-only for SSR safety,
  // skipped under prefers-reduced-motion)
  const [risers, setRisers] = useState<Riser[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
          className="relative h-full max-w-full"
          style={{ transformStyle: 'preserve-3d', aspectRatio: '1920 / 1230' }}
          animate={
            active
              ? { y: [-10, 10], rotateY: [-9, 9], rotateX: [1.5, -1.5] }
              : {}
          }
          transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tapex-unit.png"
            alt="T-Apex adaptive resistance unit"
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

function PillarCard({ pillar }: { pillar: typeof SOLUTION_PILLARS[0] }) {
  return (
    <div
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-blue/30 transition-colors duration-300 cursor-default"
      style={{ borderLeft: '2px solid rgba(0,174,239,0.6)', borderRadius: 0 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,174,239,0.06), transparent)' }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display font-black t-feature tracking-wide"
          style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)' }}>
          {pillar.label}
        </h3>
        <span
          className="flex-shrink-0 text-[8px] font-mono font-semibold tracking-[0.18em] uppercase px-2 py-1 border"
          style={{ color: '#00AEEF', borderColor: 'rgba(0,174,239,0.35)', background: 'rgba(0,174,239,0.08)' }}
        >
          {pillar.tag}
        </span>
      </div>

      <p className="text-apex-grey font-body text-sm leading-relaxed">{pillar.body}</p>
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
  // Stage trigger — the floating unit + emerging cards replay on every pass
  const stageRef = useRef<HTMLDivElement>(null)
  const stageActive = useInView(stageRef, { amount: 0.35 })

  return (
    <section ref={sectionRef} id="solution" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
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
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
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

          {/* Connector hairlines: unit → cards (lg+) */}
          <svg
            className="absolute inset-0 w-full h-full hidden lg:block pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {STAGE_CARDS.map(c => (
              <motion.path
                key={c.seq}
                d={`M ${c.from.x} ${c.from.y} L ${c.to.x} ${c.to.y}`}
                fill="none"
                stroke="rgba(0,174,239,0.45)"
                strokeWidth="0.16"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={stageActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={
                  stageActive
                    ? { pathLength: { duration: 0.5, delay: CARD_LINE_AT(c.seq), ease: 'linear' }, opacity: { duration: 0.01, delay: CARD_LINE_AT(c.seq) } }
                    : { duration: 0 }
                }
              />
            ))}
          </svg>

          {/* Pillars around the unit (lg+) */}
          {STAGE_CARDS.map(({ seq, pos }) => (
            <motion.div
              key={seq}
              className="absolute hidden lg:block w-[300px] xl:w-[340px] z-10"
              style={pos}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={stageActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
              transition={
                stageActive
                  ? { duration: 0.55, delay: CARD_AT(seq), ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0 }
              }
            >
              <PillarCard pillar={SOLUTION_PILLARS[seq]} />
            </motion.div>
          ))}
        </div>

        {/* Pillars stacked below the unit (mobile / tablet) */}
        <div className="lg:hidden flex flex-col gap-4 mt-8">
          {SOLUTION_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <PillarCard pillar={pillar} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
